# backend/migrations/env.py
import os
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool
from app.models import base  # make sure models are imported!  <-- KEEP
from app.models import company, user   # 👈 make metadata include all tables

# ──────────────────────────────────────────────────────────────
# Alembic config & logging
# ──────────────────────────────────────────────────────────────
config = context.config

# Tell Alembic to use the *sync* URL for migrations
config.set_main_option("sqlalchemy.url", os.environ["SYNC_DATABASE_URL"])

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Give Alembic your model metadata for autogenerate
target_metadata = base.Base.metadata

# ──────────────────────────────────────────────────────────────
# Offline migrations (no DB connection)
# ──────────────────────────────────────────────────────────────
def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

# ──────────────────────────────────────────────────────────────
# Online migrations (engine + connection)
# ──────────────────────────────────────────────────────────────
def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()

# ──────────────────────────────────────────────────────────────
# Entry point
# ──────────────────────────────────────────────────────────────
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
