from uuid import UUID, uuid4
from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.collabcard import CollabCard
from .base import Base, PK_UUID
from .mixins import TimeStampMixin
from .enums import BatchStatus


class Batch(Base, TimeStampMixin):
    __tablename__ = "batches"

    id: Mapped[PK_UUID] = mapped_column(default=uuid4)
    company_id: Mapped[UUID | None] = mapped_column(ForeignKey("companies.id"))
    created_by: Mapped[UUID | None] = mapped_column(ForeignKey("users.id"))

    original_filename: Mapped[str | None] = mapped_column(nullable=True, index=True)
    total_records: Mapped[int] = mapped_column(Integer, default=0)
    processed_records: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[BatchStatus] = mapped_column(default=BatchStatus.pending)

    # relationships
    records: Mapped[list["CollabCard"]] = relationship(
        back_populates="batch", cascade="all,delete-orphan"
    )
