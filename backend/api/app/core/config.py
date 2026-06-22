import os


def cors_origins() -> list[str]:
    """Return configured browser origins while keeping local development simple."""
    raw_origins = os.getenv("API_CORS_ORIGINS", "http://localhost:3000")
    return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]


APP_ENV = os.getenv("APP_ENV", "development")
