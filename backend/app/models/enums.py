import enum


class BatchStatus(str, enum.Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    error = "error"


class RecordStatus(str, enum.Enum):
    pending = "pending"
    generating = "generating"
    generated = "generated"
    failed = "failed"
