from uuid import UUID
from pydantic import BaseModel


class CompanyBase(BaseModel):
    name: str


class CompanyCreate(CompanyBase):
    pass


class CompanyRead(CompanyBase):
    id: UUID

    class Config:
        from_attributes = True
