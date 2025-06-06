# ─── build stage ───────────────────────────────────────────
FROM python:3.12-slim AS builder
WORKDIR /app
ENV PIP_DISABLE_PIP_VERSION_CHECK=on \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY backend/requirements.txt .
RUN pip install --upgrade pip \
 && pip wheel -r requirements.txt -w /wheels

# ─── runtime stage ─────────────────────────────────────────
FROM python:3.12-slim
WORKDIR /app
ENV PYTHONPATH=/app

# 1) wheel cache + requirements file
COPY --from=builder /wheels /wheels
COPY --from=builder /app/requirements.txt /app/requirements.txt

# 2) install strictly from the wheelhouse
RUN pip install --no-index --find-links=/wheels -r /app/requirements.txt

# 3) application source
COPY backend /app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
