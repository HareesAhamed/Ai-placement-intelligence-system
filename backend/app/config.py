from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "PrepIQ Coding API"
    app_env: str = "development"
    app_debug: bool = True

    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/prepiq"

    jwt_secret_key: str = "change-me"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 120

    execution_timeout_seconds: int = 20
    execution_cpu_limit: float = 0.5
    execution_memory_limit_mb: int = 256
    docker_image_cpp: str = "prepiq-executor:latest"
    docker_image_java: str = "prepiq-executor:latest"
    docker_image_python: str = "prepiq-executor:latest"
    docker_image_javascript: str = "prepiq-executor:latest"
    cors_allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173"
    clist_api_username: str | None = None
    clist_api_key: str | None = None
    contest_sync_hour_utc: int = 2
    connectors_user_agent: str = "PrepIQ/1.0"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


def get_cors_origins(settings: Settings) -> list[str]:
    return [origin.strip() for origin in settings.cors_allowed_origins.split(",") if origin.strip()]
