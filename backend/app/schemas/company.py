from uuid import UUID
from pydantic import BaseModel


class CompanyBase(BaseModel):
    name: str
    phone_prefix: str | None = None
    email: str | None = None
    phone: str | None = None
    web: str | None = None
    note: str | None = None
    description: str | None = None
    

class CompanyCreate(CompanyBase):
    pass


class CompanyRead(CompanyBase):
    id: UUID

    class Config:
        from_attributes = True
