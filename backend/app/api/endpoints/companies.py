import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.company import Company
from app.schemas.company import CompanyRead, CompanyCreate, CompanyUpdate
from app.api.dependencies import require_global_owner

router = APIRouter(prefix="/companies", tags=["companies"])


@router.get(
    "/",
    response_model=list[CompanyRead],
    summary="List all companies (global owners only)",
)
async def get_companies(
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_global_owner),
):
    result = await db.execute(select(Company))
    return result.scalars().all()


@router.get(
    "/{company_id}",
    response_model=CompanyRead,
    summary="Get a single company by ID (global owners only)",
)
async def get_company(
    company_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_global_owner),
):
    company = await db.get(Company, company_id)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Company {company_id} not found",
        )
    return company


@router.post(
    "/",
    response_model=CompanyRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new company (global owners only)",
)
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
    summary="Update an existing company (global owners only)",
)
async def update_company(
    company_id: uuid.UUID,
    body: CompanyUpdate,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_global_owner),
):
    # 1️⃣ Fetch
    company = await db.get(Company, company_id)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Company {company_id} not found",
        )

    # 2️⃣ Apply only provided (unset fields are skipped)
    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(company, field, value)

    # 3️⃣ Persist
    db.add(company)
    await db.commit()
    await db.refresh(company)
    return company
