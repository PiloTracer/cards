import enum, datetime as dt
from uuid import UUID
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, PK_UUID


class Role(str, enum.Enum):
    owner = "owner"           # global admin
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

    company: Mapped["Company | None"] = relationship(back_populates="users")

    created_at: Mapped[dt.datetime] = mapped_column(default=dt.datetime.utcnow)
