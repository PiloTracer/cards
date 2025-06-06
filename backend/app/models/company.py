from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, PK_UUID


class Company(Base):
    __tablename__ = "companies"

    id: Mapped[PK_UUID]
    name: Mapped[str] = mapped_column(unique=True, index=True)

    users: Mapped[list["User"]] = relationship(back_populates="company", cascade="all,delete")
