# app/models/user.py
import enum
import datetime as dt
from uuid import UUID
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, PK_UUID

class Role(str, enum.Enum):
    owner = "owner"
    administrator = "administrator"
    collaborator = "collaborator"
    standard = "standard"

class User(Base):
    __tablename__ = "users"

    id: Mapped[PK_UUID]
    email: Mapped[str] = mapped_column(unique=True, index=True)
    hashed_password: Mapped[str]
    role: Mapped[Role] = mapped_column(default=Role.standard)
    is_active: Mapped[bool] = mapped_column(default=True)
    company_id: Mapped[UUID | None] = mapped_column(ForeignKey("companies.id"), nullable=True)

    # Card fields (optional)
    card_full_name: Mapped[str | None]
    card_email: Mapped[str | None] = mapped_column(index=True)
    card_mobile_phone: Mapped[str | None]
    card_job_title: Mapped[str | None]
    card_office_phone: Mapped[str | None]
    card_web: Mapped[str | None]

    # Relationships (use string references to avoid circular imports)
    company: Mapped["Company | None"] = relationship(
        "Company", 
        back_populates="users"
    )

    created_at: Mapped[dt.datetime] = mapped_column(default=dt.datetime.utcnow)