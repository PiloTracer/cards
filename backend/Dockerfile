# ───── build stage ─────────────────────────────────────────
FROM python:3.12-slim AS builder
WORKDIR /app
ENV PIP_DISABLE_PIP_VERSION_CHECK=on \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
COPY backend/requirements.txt .
RUN pip install --upgrade pip \
 && pip wheel --no-deps -r requirements.txt -w /wheels

# ───── runtime stage ───────────────────────────────────────
FROM python:3.12-slim
WORKDIR /app
ENV PYTHONPATH=/app
COPY --from=builder /wheels /wheels
RUN pip install --no-index /wheels/*
COPY backend /app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
