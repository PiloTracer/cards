from uuid import UUID
from pydantic import BaseModel, EmailStr
from app.models.user import Role


class UserBase(BaseModel):
    email: EmailStr
    role: Role

    # Optional
    card_full_name: str | None = None
    card_email: EmailStr | None = None
    card_mobile_phone: str | None = None
    card_job_title: str | None = None
    card_office_phone: str | None = None
    card_web: str | None = None


class UserCreate(UserBase):
    password: str
    company_id: UUID | None = None


class UserRead(UserBase):
    id: UUID
    company_id: UUID | None

    class Config:
        from_attributes = True
