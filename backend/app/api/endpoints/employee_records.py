# backend/app/api/endpoints/employee_records.py
from __future__ import annotations

import os
import shutil
import uuid
import datetime as dt

from pathlib import Path
from typing import AsyncGenerator

import pandas as pd
from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form,
    HTTPException,
    status,
    BackgroundTasks,
    Query,
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.core.config import get_settings
from app.schemas.employee import EmployeeCreate, EmployeeRead
from app.schemas.batch import BatchRead
from app.models.enums import BatchStatus, RecordStatus
from app.models import Batch, EmployeeRecord, AuditLog, Company, User
from app.api.dependencies import get_current_user
from app.models.user import Role

router = APIRouter(prefix="/employee-records", tags=["employee_records"])
settings = get_settings()

UPLOAD_ROOT = Path(settings.upload_dir or "/data/uploads")
SPANISH_TO_ENGLISH = {
    "Nombre": "full_name",
    "Correo Electrónico": "email",
    "Celular": "mobile_phone",
    "Puesto": "job_title",
    "Telefono Oficina": "office_phone",
    "Teléfono Oficina": "office_phone",
}


# ────────────────────────────────────────────────
# helpers
# ────────────────────────────────────────────────
async def _log(
    db: AsyncSession,
    *,
    user_id: uuid.UUID | None,
    entity_type: str,
    entity_id: uuid.UUID,
    action: str,
    details: dict,
) -> None:
    db.add(
        AuditLog(
            user_id=user_id,
            entity_type=entity_type,
            entity_id=entity_id,
            action=action,
            details=details,
        )
    )
    await db.commit()


def _company_guard(current: User, company_id: uuid.UUID | None) -> uuid.UUID | None:
    """
    Returns the target company_id or raises 403/404.
    * Owners may supply company_id (else None).
    * Non-owners must belong to exactly one company.
    """
    if current.role == Role.owner:
        return company_id
    if company_id and company_id != current.company_id:
        raise HTTPException(status_code=403, detail="Cannot act on other companies")
    if not current.company_id:
        raise HTTPException(status_code=400, detail="User has no company assigned")
    return current.company_id


# ────────────────────────────────────────────────
# 1. Single record (typed-in)
# ────────────────────────────────────────────────
@router.post(
    "/",
    response_model=EmployeeRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_single_employee(
    body: EmployeeCreate,
    background_tasks: BackgroundTasks,          # ← plain param
    company_id: uuid.UUID | None = Query(None),
    db: AsyncSession = Depends(get_db),
    current: User = Depends(get_current_user),
):
    target_company_id = _company_guard(current, company_id)

    # create 1-row batch first
    batch = Batch(
        company_id=target_company_id,
        created_by=current.id,
        original_filename=None,
        total_records=1,
        processed_records=0,
        status=BatchStatus.pending,
    )
    db.add(batch)
    await db.flush()  # get batch.id

    record = EmployeeRecord(
        batch_id=batch.id,
        company_id=target_company_id,
        created_by=current.id,
        **body.model_dump(),
    )
    db.add(record)

    # set processed=1 immediately; generation worker will update status later
    batch.processed_records = 1
    await db.commit()
    await db.refresh(record)

    background_tasks.add_task(
        _log,
        db=db,
        user_id=current.id,
        entity_type="employee_record",
        entity_id=record.id,
        action="create",
        details={"via": "typed"},
    )
    return record

# ────────────────────────────────────────────────
# 2. XLSX upload (multi-record)
# ────────────────────────────────────────────────
@router.post(
    "/upload-xlsx",
    response_model=BatchRead,
    status_code=status.HTTP_202_ACCEPTED,
)
async def upload_employee_xlsx(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    company_id: uuid.UUID | None = Query(None),
    db: AsyncSession = Depends(get_db),
    current: User = Depends(get_current_user),
):
    if not file.filename.lower().endswith(".xlsx"):
        raise HTTPException(400, detail="File must be .xlsx")

    target_company_id = _company_guard(current, company_id)

    # create batch row first
    batch = Batch(
        company_id=target_company_id,
        created_by=current.id,
        original_filename=file.filename,
        status=BatchStatus.processing,
    )
    db.add(batch)
    await db.flush()  # assign ID to build path

    # Prepare permanent path: uploads/<company>/<batch>/original.xlsx
    dest_dir = UPLOAD_ROOT / (str(target_company_id) if target_company_id else "global") / str(batch.id)
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest_path = dest_dir / file.filename

    # Stream file → disk in chunks (no size limit except disk space)
    with dest_path.open("wb") as f:
        while chunk := file.file.read(1024 * 1024):  # 1 MiB chunks
            f.write(chunk)

    # Parse in pandas (can be moved to Celery later)
    try:
        df_iter: AsyncGenerator[pd.DataFrame, None] | list[pd.DataFrame]

        # use chunksize to avoid loading entire sheet in memory
        df_iter = pd.read_excel(dest_path, chunksize=5000)

        total = 0
        for chunk in df_iter:
            chunk.rename(columns=SPANISH_TO_ENGLISH, inplace=True, errors="ignore")
            missing_cols = {"full_name", "email"} - set(chunk.columns)
            if missing_cols:
                raise ValueError(f"Missing cols {missing_cols} in chunk")

            objs = [
                EmployeeRecord(
                    batch_id=batch.id,
                    company_id=target_company_id,
                    created_by=current.id,
                    full_name=row.get("full_name"),
                    email=row.get("email"),
                    mobile_phone=row.get("mobile_phone"),
                    job_title=row.get("job_title"),
                    office_phone=row.get("office_phone"),
                )
                for _, row in chunk.iterrows()
            ]
            db.add_all(objs)
            total += len(objs)

        batch.total_records = total
        batch.processed_records = total
        batch.status = BatchStatus.pending
        await db.commit()
    except Exception as exc:  # noqa: BLE001
        batch.status = BatchStatus.error
        await db.commit()
        raise HTTPException(400, detail=f"Parse error: {exc}") from exc

    background_tasks.add_task(
        _log,
        db=db,
        user_id=current.id,
        entity_type="batch",
        entity_id=batch.id,
        action="upload_xlsx",
        details={"filename": file.filename, "records": batch.total_records},
    )
    return batch
