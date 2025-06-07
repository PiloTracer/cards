from uuid import UUID
from datetime import datetime
from pydantic import BaseModel
from app.models.enums import BatchStatus


class BatchBase(BaseModel):
    original_filename: str | None = None


class BatchRead(BatchBase):
    id: UUID
    total_records: int
    processed_records: int
    status: BatchStatus
    created_at: datetime

    class Config:
        from_attributes = True
