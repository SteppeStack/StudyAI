from typing import Any

import httpx
from fastapi import HTTPException, status

from app.core.config import Settings, get_settings


class GeminiProvider:
    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()

    async def generate_text(self, prompt: str) -> str:
        if self.settings.ai_provider != "gemini":
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unsupported AI provider",
            )

        if not self.settings.gemini_api_key:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="GEMINI_API_KEY is not configured",
            )

        url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            f"{self.settings.gemini_model}:generateContent"
        )
        payload: dict[str, Any] = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt}],
                }
            ]
        }
        params = {"key": self.settings.gemini_api_key}

        async with httpx.AsyncClient(timeout=45) as client:
            response = await client.post(url, params=params, json=payload)

        if response.status_code >= 400:
            error_detail: str | dict[str, Any] = "Gemini API request failed"
            if self.settings.app_env == "development":
                error_detail = {
                    "message": error_detail,
                    "status_code": response.status_code,
                    "provider_response": response.text[:1000],
                }
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=error_detail,
            )

        data = response.json()
        return self._extract_text(data)

    @staticmethod
    def _extract_text(data: dict[str, Any]) -> str:
        candidates = data.get("candidates") or []
        if not candidates:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Gemini API returned no candidates",
            )

        parts = candidates[0].get("content", {}).get("parts") or []
        text = "\n".join(part.get("text", "") for part in parts).strip()
        if not text:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Gemini API returned an empty response",
            )

        return text


def get_gemini_provider() -> GeminiProvider:
    return GeminiProvider()
