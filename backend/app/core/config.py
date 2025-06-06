# backend/app/core/config.py
from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # --------------------------------------------------------------------- #
    # Environment variables (loaded from .env by model_config below)        #
    # --------------------------------------------------------------------- #
    database_url: str = Field(..., env="DATABASE_URL")   # accept async driver
    secret_key: str = Field(..., env="SECRET_KEY")
    access_token_expire_minutes: int = 60 * 24  # 1 day

    # Pydantic-v2 settings: replace old `class Config`
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance so we don’t parse .env on every import."""
    return Settings()
