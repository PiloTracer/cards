from uuid import UUID
from pydantic import BaseModel, EmailStr
from app.models.user import Role


class UserBase(BaseModel):
    email: EmailStr
    role: Role


class UserCreate(UserBase):
    password: str
    company_id: UUID | None = None


class UserRead(UserBase):
    id: UUID
    company_id: UUID | None

    class Config:
        from_attributes = True
