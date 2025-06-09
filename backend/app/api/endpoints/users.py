# backend/app/api/endpoints/users.py
import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user, require_global_owner, get_db
from app.models.company import Company
from app.models.user import User, Role
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.services.security import hash_password

router = APIRouter(prefix="/users", tags=["users"])


async def _email_in_use(db: AsyncSession, email: str, exclude_id: uuid.UUID | None = None) -> bool:
    q = select(func.count()).select_from(User).where(func.lower(User.email) == email.lower())
    if exclude_id:
        q = q.where(User.id != exclude_id)
    return bool(await db.scalar(q))


async def _company_exists(db: AsyncSession, company_id: uuid.UUID) -> bool:
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


def _validate_card_coherence_on_update(data: dict) -> None:
    # if any card_* field present without company_id also present, forbid
    card_fields = {
        k for k in data
        if k.startswith("card_") and data.get(k) is not None
    }
    if card_fields and "company_id" not in data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="To update card_* fields, company_id must also be provided",
        )


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
    # _validate_card_coherence(body)

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


@router.get(
    "/{user_id}",
    response_model=UserRead,
    summary="Get a single user by ID (global owners only)",
)
async def get_user(
    user_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_global_owner),
):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.patch(
    "/{user_id}",
    response_model=UserRead,
    summary="Update an existing user (global owners only)",
)
async def update_user(
    user_id: uuid.UUID,
    body: UserUpdate,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(require_global_owner),
):
    # 1️⃣ Fetch existing
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")

    # 2️⃣ Validate card coherence
    data = body.model_dump(exclude_unset=True)
    # _validate_card_coherence_on_update(data)

    # 3️⃣ If email changing, ensure uniqueness
    if "email" in data and await _email_in_use(db, data["email"], exclude_id=user_id):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"E-mail {data['email']} is already in use",
        )

    # 4️⃣ If company_id changing, ensure it exists
    if "company_id" in data and data["company_id"] is not None:
        if not await _company_exists(db, data["company_id"]):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Company {data['company_id']} does not exist",
            )

    # 5️⃣ Apply only provided fields
    for field, val in data.items():
        setattr(user, field, val)

    # 6️⃣ Persist
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user