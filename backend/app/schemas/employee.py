from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, EmailStr
from app.models.enums import RecordStatus


class EmployeeCreate(BaseModel):
    full_name: str
    email: EmailStr
    mobile_phone: str | None = None
    job_title: str | None = None
    office_phone: str | None = None


class EmployeeRead(EmployeeCreate):
    id: UUID
    status: RecordStatus
    card_filename: str | None
    generated_at: datetime | None

    class Config:
        from_attributes = True
