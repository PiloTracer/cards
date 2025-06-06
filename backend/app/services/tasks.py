# backend/app/services/tasks.py
from celery import Celery
import os

celery = Celery(
    "cards",
    broker=os.getenv("CELERY_BROKER_URL", "redis://redis:6379/0"),
    backend=os.getenv("CELERY_BACKEND_URL", "redis://redis:6379/0"),
)

@celery.task
def ping() -> str:
    """Simple connectivity test."""
    return "pong"
