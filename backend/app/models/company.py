# app/models/company.py
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

from .base import Base, PK_UUID

class Company(Base):
    __tablename__ = "companies"

    id: Mapped[PK_UUID]
    name: Mapped[str] = mapped_column(unique=True, index=True)
    phone_prefix: Mapped[str | None] = mapped_column(nullable=True)
    email: Mapped[str | None] = mapped_column(nullable=True)
    phone: Mapped[str | None] = mapped_column(nullable=True)
    web: Mapped[str | None] = mapped_column(nullable=True)
    note: Mapped[str | None] = mapped_column(nullable=True)
    description: Mapped[str | None] = mapped_column(nullable=True)

    # Use string reference for User model
    users: Mapped[List["User"]] = relationship(
        "User", 
        back_populates="company",
        cascade="all,delete"
    )