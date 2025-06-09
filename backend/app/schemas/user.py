# app/schemas/user.py
from uuid import UUID
from typing import Optional
from pydantic import BaseModel, EmailStr, root_validator
from app.models.user import Role

class UserBase(BaseModel):
    email: EmailStr
    role: Role

    # Optional card fields
    card_full_name: Optional[str] = None
    card_email: Optional[EmailStr] = None
    card_mobile_phone: Optional[str] = None
    card_job_title: Optional[str] = None
    card_office_phone: Optional[str] = None
    card_web: Optional[str] = None

class UserCreate(UserBase):
    password: str
    company_id: Optional[UUID] = None

class UserRead(UserBase):
    id: UUID
    company_id: Optional[UUID]

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    """
    All fields optional; only those supplied will be updated.
    """
    email: Optional[EmailStr] = None
    role: Optional[Role] = None
    company_id: Optional[UUID] = None

    card_full_name: Optional[str] = None
    card_email: Optional[EmailStr] = None
    card_mobile_phone: Optional[str] = None
    card_job_title: Optional[str] = None
    card_office_phone: Optional[str] = None
    card_web: Optional[str] = None

    @root_validator(pre=True)
    def require_at_least_one(cls, values):
        if not any(v is not None for v in values.values()):
            raise ValueError("At least one field must be provided")
        return values

    class Config:
        from_attributes = True
