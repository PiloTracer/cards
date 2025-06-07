# backend/app/models/__init__.py
from .base import Base  # noqa: F401

# import all modules that define tables so that they register with Base.metadata
from .company import Company
from .user import User
from .batch import Batch
from .collabcard import CollabCard
from .audit import AuditLog
