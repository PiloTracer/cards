from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.user import User, Role
from app.schemas.user import UserCreate, UserRead
from app.services.security import hash_password
from app.api.dependencies import get_current_user, require_global_owner

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=list[UserRead])
async def list_users(
    current: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    q = select(User)
    if current.role != Role.owner:
        q = q.where(User.company_id == current.company_id)
    res = await db.execute(q)
    return res.scalars().all()


@router.post("/", response_model=UserRead, status_code=201)
async def create_user(
    body: UserCreate,
    current: User = Depends(require_global_owner),  # only global owners
    db: AsyncSession = Depends(get_db),
):
    user = User(
        email=body.email,
        hashed_password=hash_password(body.password),
        role=body.role,
        company_id=body.company_id,
        # card
        card_full_name=body.card_full_name,
        card_email=body.card_email,
        card_mobile_phone=body.card_mobile_phone,
        card_job_title=body.card_job_title,
        card_office_phone=body.card_office_phone,
        card_web=body.card_web
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
