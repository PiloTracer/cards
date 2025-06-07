from uuid import UUID, uuid4
import datetime as dt
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, PK_UUID
from .mixins import TimeStampMixin
from .enums import RecordStatus


class CollabCard(Base, TimeStampMixin):
    __tablename__ = "collabcards"

    id: Mapped[PK_UUID] = mapped_column(default=uuid4)
    batch_id: Mapped[UUID] = mapped_column(ForeignKey("batches.id"))
    company_id: Mapped[UUID | None] = mapped_column(ForeignKey("companies.id"))
    created_by: Mapped[UUID | None] = mapped_column(ForeignKey("users.id"))

    # data columns (Spanish → English)
    full_name: Mapped[str]               # Nombre
    email: Mapped[str] = mapped_column(index=True)   # Correo Electrónico
    mobile_phone: Mapped[str | None]     # Celular
    job_title: Mapped[str | None]        # Puesto
    office_phone: Mapped[str | None]     # Teléfono Oficina

    # generation/output
    status: Mapped[RecordStatus] = mapped_column(default=RecordStatus.pending)
    card_filename: Mapped[str | None] = mapped_column(nullable=True)
    generated_at: Mapped[dt.datetime | None] = mapped_column(nullable=True)

    batch: Mapped["Batch"] = relationship(back_populates="records")
