# backend/app/api/endpoints/users.py
from __future__ import annotations

from typing import List
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user, require_global_owner, get_db
from app.models.company import Company
from app.models.user import User, Role
from app.schemas.user import UserCreate, UserRead
from app.services.security import hash_password

router = APIRouter(prefix="/users", tags=["users"])


# ──────────────────────────────
# Helper utilities
# ──────────────────────────────
async def _email_in_use(db: AsyncSession, email: str) -> bool:
    """True if e-mail already exists (case-insensitive)."""
    return bool(
        await db.scalar(
            select(func.count())
            .select_from(User)
            .where(func.lower(User.email) == email.lower())
        )
    )


async def _company_exists(db: AsyncSession, company_id: uuid.UUID) -> bool:
    """True if the company exists."""
    return bool(await db.scalar(select(func.count()).select_from(Company).where(Company.id == company_id)))


def _validate_card_coherence(body: UserCreate) -> None:
    """card_* allowed only if company_id supplied."""
    has_card = any(
        (
            body.card_full_name,
            body.card_email,
            body.card_mobile_phone,
            body.card_job_title,
            body.card_office_phone,
            body.card_web,
        )
    )
    if has_card and body.company_id is None:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail="card_* fields require a company_id; user must belong to a company.",
        )


# ──────────────────────────────
# List users
# ──────────────────────────────
@router.get("/", response_model=List[UserRead])
async def list_users(
    current: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> List[UserRead]:
    stmt = select(User)
    if current.role != Role.owner:
        stmt = stmt.where(User.company_id == current.company_id)

    res = await db.execute(stmt)
    return res.scalars().all()


# ──────────────────────────────
# Create user  (global owners only)
# ──────────────────────────────
@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def create_user(
    body: UserCreate,
    current: User = Depends(require_global_owner),
    db: AsyncSession = Depends(get_db),
) -> UserRead:
    # 1️⃣  high-level validation
    _validate_card_coherence(body)

    # 2️⃣  make sure the company exists (if provided)
    if body.company_id and not await _company_exists(db, body.company_id):
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            detail=f"Company {body.company_id} does not exist.",
        )

    # 3️⃣  duplicate e-mail guard
    if await _email_in_use(db, body.email):
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            detail=f"E-mail “{body.email}” is already registered.",
        )

    # 4️⃣  persist
    user = User(
        email=body.email,
        hashed_password=hash_password(body.password),
        role=body.role,
        company_id=body.company_id,
        card_full_name=body.card_full_name,
        card_email=body.card_email,
        card_mobile_phone=body.card_mobile_phone,
        card_job_title=body.card_job_title,
        card_office_phone=body.card_office_phone,
        card_web=body.card_web,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
