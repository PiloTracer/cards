from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.schemas.company import CompanyRead, CompanyCreate
from app.models.company import Company
from app.api.dependencies import require_global_owner

router = APIRouter(prefix="/companies", tags=["companies"])


@router.get("/", response_model=list[CompanyRead])
async def get_companies(
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_global_owner),   # only owners see all companies
):
    res = await db.execute(select(Company))
    return res.scalars().all()


@router.post("/", response_model=CompanyRead, status_code=201)
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
