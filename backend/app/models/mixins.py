import datetime as dt
from sqlalchemy.orm import Mapped, mapped_column, declared_attr


class TimeStampMixin:
    created_at: Mapped[dt.datetime] = mapped_column(
        default=dt.datetime.utcnow, nullable=False
    )
    updated_at: Mapped[dt.datetime] = mapped_column(
        default=dt.datetime.utcnow,
        onupdate=dt.datetime.utcnow,
        nullable=False,
    )

    @declared_attr.directive
    def __mapper_args__(cls):  # noqa: N805
        return {"eager_defaults": True}
