import enum


class BatchStatus(str, enum.Enum):
    pending = "pending"       # file uploaded / record typed, not processed
    processing = "processing"
    completed = "completed"   # all employee records generated
    error = "error"


class RecordStatus(str, enum.Enum):
    pending = "pending"
    generating = "generating"
    generated = "generated"
    failed = "failed"
