# ─── Build Stage ───────────────────────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /app

# Environment variables for build stage
ENV PIP_DISABLE_PIP_VERSION_CHECK=on \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Copy and build dependency wheels
COPY backend/requirements.txt .
RUN pip install --upgrade pip \
 && pip wheel --no-cache-dir -r requirements.txt -w /wheels

# ─── Runtime Stage ─────────────────────────────────────────
FROM python:3.12-slim

WORKDIR /app

# Environment variables for runtime
ENV PYTHONPATH=/app \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Copy wheels and requirements from builder
COPY --from=builder /wheels /wheels
COPY --from=builder /app/requirements.txt /app/requirements.txt

# Install dependencies and debugpy, clean up wheels
RUN pip install --no-index --find-links=/wheels -r requirements.txt \
 && pip install --no-cache-dir debugpy~=1.8 \
 && rm -rf /wheels

# Copy the entire backend directory (overlaid by volume at runtime)
COPY backend /app

# Expose application and debug ports
EXPOSE 8000 5678

# Run the application with Uvicorn and debugpy
CMD ["python", "-Xfrozen_modules=off", \
     "-m", "debugpy", "--listen", "0.0.0.0:5678", "--wait-for-client", \
     "-m", "uvicorn", "app.main:app", \
     "--host", "0.0.0.0", "--port", "8000", \
     "--reload", "--reload-dir", "/app"]