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
ENV PYTHONPATH=/app PYTHONUNBUFFERED=1

# wheel cache + requirements
COPY --from=builder /wheels /wheels
COPY --from=builder /app/requirements.txt /app/requirements.txt

# install deps *and* debugpy for remote debugging
RUN pip install --no-index --find-links=/wheels -r /app/requirements.txt \
 && pip install --no-cache-dir debugpy~=1.8

# copy source once (over-mounted later for hot reload)
COPY backend /app

# expose app + debug ports (for docs only)
EXPOSE 8000 5678

CMD ["python", "-Xfrozen_modules=off", \
     "-m", "debugpy", "--listen", "0.0.0.0:5678", "--wait-for-client", \
     "-m", "uvicorn", "app.main:app", \
     "--host", "0.0.0.0", "--port", "8000", \
     "--reload", "--reload-dir", "/app/backend"]
