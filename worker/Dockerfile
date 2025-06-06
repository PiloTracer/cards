# ─── build stage ─────────────────────────────
FROM python:3.12-slim AS build
WORKDIR /app
ENV PIP_DISABLE_PIP_VERSION_CHECK=on \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
COPY backend/requirements.txt .
RUN pip install --upgrade pip \
 && pip wheel -r requirements.txt -w /wheels

# ─── runtime stage ───────────────────────────
FROM python:3.12-slim
WORKDIR /app
COPY --from=build /wheels /wheels
RUN pip install --no-index /wheels/*
COPY backend /app
CMD ["celery", "-A", "app.services.tasks", "worker", "--loglevel=info"]
