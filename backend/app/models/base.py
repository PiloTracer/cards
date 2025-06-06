from typing import Annotated
from uuid import uuid4, UUID
from sqlalchemy import MetaData
from sqlalchemy.orm import DeclarativeBase, mapped_column


class Base(DeclarativeBase):
    pass


PK_UUID = Annotated[UUID, mapped_column(primary_key=True, default=uuid4)]
metadata = MetaData()
