import datetime as dt
from uuid import uuid4, UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import JSON
from .base import Base, PK_UUID


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[PK_UUID] = mapped_column(default=uuid4)
    timestamp: Mapped[dt.datetime] = mapped_column(default=dt.datetime.utcnow)
    user_id: Mapped[UUID | None] = mapped_column(nullable=True)

    entity_type: Mapped[str]            # "batch" | "employee_record"
    entity_id: Mapped[UUID]
    action: Mapped[str]                 # "create" | "update" | ...
    details: Mapped[dict] = mapped_column(JSON)
