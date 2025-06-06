FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /wheels /wheels
RUN pip install --no-index /wheels/*
COPY backend /app
CMD ["celery", "-A", "app.services.tasks", "worker", "--loglevel=info"]
