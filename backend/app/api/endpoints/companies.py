# app/api/endpoints/companies.py

import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.company import Company
from app.schemas.company import CompanyRead, CompanyCreate, CompanyUpdate
from app.api.dependencies import require_global_owner

router = APIRouter(prefix="/companies", tags=["companies"])


@router.get("/", response_model=list[CompanyRead])
async def get_companies(
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_global_owner),   # only global owners
):
    res = await db.execute(select(Company))
    return res.scalars().all()


@router.post("/", response_model=CompanyRead, status_code=status.HTTP_201_CREATED)
async def create_company(
    body: CompanyCreate,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_global_owner),
):
    company = Company(**body.model_dump())
    db.add(company)
    await db.commit()
    await db.refresh(company)
    return company


@router.patch(
    "/{company_id}",
    response_model=CompanyRead,
    status_code=status.HTTP_200_OK,
    summary="Update an existing company (global owners only)",
)
async def update_company(
    company_id: uuid.UUID,
    body: CompanyUpdate,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_global_owner),
):
    # 1️⃣ Fetch the existing company
    company = await db.get(Company, company_id)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Company {company_id} not found",
        )

    # 2️⃣ Apply only the provided fields
    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(company, field, value)

    # 3️⃣ Persist changes
    db.add(company)
    await db.commit()
    await db.refresh(company)
    return company
