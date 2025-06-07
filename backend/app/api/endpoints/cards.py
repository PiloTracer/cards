from __future__ import annotations

import datetime as dt
import uuid
from pathlib import Path
from typing import List

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    HTTPException,
    Query,
    UploadFile,
    status,
)
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user, get_db
from app.core.config import get_settings
from app.models import AuditLog, Batch, EmployeeRecord, User
from app.models.enums import BatchStatus, RecordStatus
from app.models.user import Role
from app.schemas.batch import BatchRead

# ──────────────────────────────────────────────────────────────
# Router / constants
# ──────────────────────────────────────────────────────────────
router = APIRouter(prefix="/cards", tags=["cards"])
settings = get_settings()

CARDS_ROOT = Path(settings.upload_dir or "/data/uploads").joinpath("cards")
CARDS_ROOT.mkdir(parents=True, exist_ok=True)

CHUNK = 1_048_576  # 1 MiB


# ──────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────
def _company_guard(current: User, batch: Batch) -> None:
    """Raise 403 if a non-owner tries to touch another company’s batch."""
    if current.role == Role.owner:
        return
    if current.company_id != batch.company_id:
        raise HTTPException(status_code=403, detail="Cannot act on other companies")


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


# ──────────────────────────────────────────────────────────────
# 1. Upload one or many PNG e-cards for a single batch
# ──────────────────────────────────────────────────────────────
@router.post(
    "/upload",
    response_model=BatchRead,
    status_code=status.HTTP_202_ACCEPTED,
)
async def upload_cards(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),          # any number of PNGs
    batch_id: uuid.UUID = Query(...),
    company_id: uuid.UUID | None = Query(None),   # optional for owners
    db: AsyncSession = Depends(get_db),
    current: User = Depends(get_current_user),
):
    # ── fetch & authorise batch ───────────────────────────────
    batch: Batch | None = (
        await db.execute(select(Batch).where(Batch.id == batch_id))
    ).scalar_one_or_none()
    if not batch:
        raise HTTPException(404, detail="Batch not found")

    _company_guard(current, batch)

    # sanity: company in URL (if provided) must match
    if company_id and company_id != batch.company_id:
        raise HTTPException(400, detail="company_id does not match batch")

    # dest = /data/uploads/cards/<company|global>/<batch>/
    dest_dir = (
        CARDS_ROOT
        / (str(batch.company_id) if batch.company_id else "global")
        / str(batch.id)
    )
    dest_dir.mkdir(parents=True, exist_ok=True)

    now = dt.datetime.utcnow()
    saved = 0

    # build a map of employee_record.id → record
    records_by_id: dict[uuid.UUID, EmployeeRecord] = {
        r.id: r
        for r in (
            await db.execute(
                select(EmployeeRecord).where(EmployeeRecord.batch_id == batch.id)
            )
        ).scalars()
    }

    for f in files:
        if not f.filename.lower().endswith(".png"):
            continue  # silently skip non-png

        # try to parse record_id from file stem (e.g. <uuid>.png)
        try:
            rec_id = uuid.UUID(f.filename.rsplit(".", 1)[0])
        except ValueError:
            continue  # filename not a UUID – ignore

        if rec_id not in records_by_id:
            continue  # no matching record in this batch

        # stream-save
        dest_path = dest_dir / f.filename
        with dest_path.open("wb") as out:
            for chunk in iter(lambda: f.file.read(CHUNK), b""):
                out.write(chunk)

        # update record
        rec = records_by_id[rec_id]
        rec.card_filename = str(dest_path.relative_to(CARDS_ROOT))
        rec.generated_at = now
        rec.status = RecordStatus.generated
        saved += 1

    # flush all modified records
    await db.commit()

    # ── update batch counters / status ────────────────────────
    batch.processed_records = saved
    if saved == 0:
        batch.status = BatchStatus.pending
    elif saved == batch.total_records:
        batch.status = BatchStatus.completed
    else:
        batch.status = BatchStatus.processing

    await db.commit()
    await db.refresh(batch)

    # ── audit entry async ─────────────────────────────────────
    background_tasks.add_task(
        _log,
        db=db,
        user_id=current.id,
        entity_type="batch",
        entity_id=batch.id,
        action="upload_cards",
        details={"files": saved},
    )

    return batch
