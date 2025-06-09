# app/schemas/company.py
from uuid import UUID
from typing import Optional
from pydantic import BaseModel, root_validator

class CompanyBase(BaseModel):
    name: str
    phone_prefix: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    web: Optional[str] = None
    note: Optional[str] = None
    description: Optional[str] = None

class CompanyCreate(CompanyBase):
    """All fields required as in CompanyBase."""
    pass

class CompanyUpdate(BaseModel):
    """
    All fields optional; only the ones present will be updated.
    """
    name: Optional[str] = None
    phone_prefix: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    web: Optional[str] = None
    note: Optional[str] = None
    description: Optional[str] = None

    @root_validator(pre=True)
    def require_at_least_one(cls, values):
        if not any(v is not None for v in values.values()):
            raise ValueError("At least one field must be provided for update")
        return values

    class Config:
        from_attributes = True

class CompanyRead(CompanyBase):
    id: UUID

    class Config:
        from_attributes = True
