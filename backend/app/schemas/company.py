# app/schemas/company.py

from uuid import UUID
from typing import Optional, Any, Dict
from pydantic import BaseModel, root_validator

class CompanyBase(BaseModel):
    name: str
    phone_prefix: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    web: Optional[str] = None
    note: Optional[str] = None
    description: Optional[str] = None

    class Config:
        # Allow reading from ORM models
        from_attributes = True


class CompanyCreate(CompanyBase):
    """All fields required as in CompanyBase."""
    # inherits Config.from_attributes via CompanyBase
    pass


class CompanyUpdate(BaseModel):
    """
    All fields optional; only the ones present will be updated.
    Enforces that at least one field is provided.
    """
    name: Optional[str] = None
    phone_prefix: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    web: Optional[str] = None
    note: Optional[str] = None
    description: Optional[str] = None

    @root_validator(pre=True)
    def require_at_least_one(cls, values: Dict[str, Any]) -> Dict[str, Any]:
        if not any(value is not None for value in values.values()):
            raise ValueError("At least one field must be provided for update")
        return values

    class Config:
        from_attributes = True
        # allow unset fields to be excluded in .model_dump(exclude_unset=True)
        populate_by_name = True


class CompanyRead(CompanyBase):
    id: UUID

    class Config:
        from_attributes = True
