import os
from dataclasses import dataclass
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


def _list_env(name: str, default: str) -> list[str]:
    raw_value = os.getenv(name, default)
    return [item.strip() for item in raw_value.split(",") if item.strip()]


def _int_env(name: str, default: int) -> int:
    raw_value = os.getenv(name)
    if not raw_value:
        return default

    try:
        return int(raw_value)
    except ValueError:
        return default


@dataclass(frozen=True)
class Settings:
    app_env: str
    cors_origins: list[str]
    supabase_url: str
    supabase_publishable_key: str
    supabase_service_role_key: str
    ai_provider: str
    gemini_api_key: str
    gemini_model: str
    gemini_model_chain: list[str]
    storage_bucket: str
    max_upload_size_bytes: int
    max_analysis_file_size_bytes: int
    max_ai_input_chars: int
    ai_tutor_history_limit: int
    payment_provider: str
    payment_success_url: str
    payment_cancel_url: str
    stripe_secret_key: str
    stripe_webhook_secret: str
    stripe_student_premium_price_id: str
    stripe_teacher_price_id: str


@lru_cache
def get_settings() -> Settings:
    return Settings(
        app_env=os.getenv("APP_ENV", "development"),
        cors_origins=_list_env("API_CORS_ORIGINS", "http://localhost:3000"),
        supabase_url=os.getenv("SUPABASE_URL", "").rstrip("/"),
        supabase_publishable_key=os.getenv("SUPABASE_PUBLISHABLE_KEY", ""),
        supabase_service_role_key=os.getenv("SUPABASE_SERVICE_ROLE_KEY", ""),
        ai_provider=os.getenv("AI_PROVIDER", "gemini"),
        gemini_api_key=os.getenv("GEMINI_API_KEY", ""),
        gemini_model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
        gemini_model_chain=_list_env(
            "GEMINI_MODEL_CHAIN",
            "gemini-2.5-flash-lite,gemini-2.0-flash,gemini-2.5-flash",
        ),
        storage_bucket=os.getenv("SUPABASE_STORAGE_BUCKET", "study-files"),
        max_upload_size_bytes=_int_env("MAX_UPLOAD_SIZE_BYTES", 26214400),
        max_analysis_file_size_bytes=_int_env("MAX_ANALYSIS_FILE_SIZE_BYTES", 10485760),
        max_ai_input_chars=_int_env("MAX_AI_INPUT_CHARS", 30000),
        ai_tutor_history_limit=_int_env("AI_TUTOR_HISTORY_LIMIT", 8),
        payment_provider=os.getenv("PAYMENT_PROVIDER", "stripe"),
        payment_success_url=os.getenv("PAYMENT_SUCCESS_URL", ""),
        payment_cancel_url=os.getenv("PAYMENT_CANCEL_URL", ""),
        stripe_secret_key=os.getenv("STRIPE_SECRET_KEY", ""),
        stripe_webhook_secret=os.getenv("STRIPE_WEBHOOK_SECRET", ""),
        stripe_student_premium_price_id=os.getenv("STRIPE_STUDENT_PREMIUM_PRICE_ID", ""),
        stripe_teacher_price_id=os.getenv("STRIPE_TEACHER_PRICE_ID", ""),
    )


def cors_origins() -> list[str]:
    """Return configured browser origins while keeping local development simple."""
    return get_settings().cors_origins


APP_ENV = get_settings().app_env
