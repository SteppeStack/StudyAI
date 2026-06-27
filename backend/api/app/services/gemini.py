import base64
from dataclasses import dataclass
from typing import Any

import httpx
from fastapi import HTTPException, status

from app.core.config import Settings, get_settings


@dataclass(frozen=True)
class GeminiResult:
    text: str
    model_used: str
    fallback_used: bool


@dataclass(frozen=True)
class GeminiRawResult:
    data: dict[str, Any]
    model_used: str
    fallback_used: bool


class GeminiProvider:
    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()

    async def generate_text(self, prompt: str) -> str:
        result = await self.generate_text_result(prompt)
        return result.text

    async def generate_text_result(self, prompt: str) -> GeminiResult:
        payload: dict[str, Any] = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt}],
                }
            ]
        }
        raw = await self._generate_with_fallback(payload=payload, timeout=45)
        return GeminiResult(
            text=self._extract_text(raw.data),
            model_used=raw.model_used,
            fallback_used=raw.fallback_used,
        )

    async def generate_text_from_file(
        self,
        prompt: str,
        content: bytes,
        mime_type: str,
    ) -> str:
        result = await self.generate_text_from_file_result(
            prompt=prompt,
            content=content,
            mime_type=mime_type,
        )
        return result.text

    async def generate_text_from_file_result(
        self,
        prompt: str,
        content: bytes,
        mime_type: str,
    ) -> GeminiResult:
        payload: dict[str, Any] = {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {"text": prompt},
                        {
                            "inline_data": {
                                "mime_type": mime_type,
                                "data": base64.b64encode(content).decode("ascii"),
                            }
                        },
                    ],
                }
            ]
        }
        raw = await self._generate_with_fallback(payload=payload, timeout=60)
        return GeminiResult(
            text=self._extract_text(raw.data),
            model_used=raw.model_used,
            fallback_used=raw.fallback_used,
        )

    async def _generate_with_fallback(
        self,
        payload: dict[str, Any],
        timeout: int,
    ) -> GeminiRawResult:
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

        responses: list[dict[str, Any]] = []
        model_chain = self._model_chain()
        params = {"key": self.settings.gemini_api_key}

        async with httpx.AsyncClient(timeout=timeout) as client:
            attempt_index = 0
            for model in model_chain:
                attempt_index += 1
                url = (
                    "https://generativelanguage.googleapis.com/v1beta/models/"
                    f"{model}:generateContent"
                )
                response = await client.post(url, params=params, json=payload)
                if response.status_code < 400:
                    return GeminiRawResult(
                        data=response.json(),
                        model_used=model,
                        fallback_used=attempt_index > 1,
                    )

                responses.append(
                    {
                        "model": model,
                        "status_code": response.status_code,
                        "provider_response": response.text[:1000],
                    }
                )

                if not self._should_try_next_model(response):
                    break

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=self._fallback_error_detail(responses),
        )

    def _model_chain(self) -> list[str]:
        chain = self.settings.gemini_model_chain or [self.settings.gemini_model]
        seen: set[str] = set()
        ordered: list[str] = []
        for model in chain:
            if model and model not in seen:
                ordered.append(model)
                seen.add(model)
        return ordered or [self.settings.gemini_model]

    @staticmethod
    def _should_try_next_model(response: httpx.Response) -> bool:
        if response.status_code == 429:
            return True

        body = response.text.lower()
        return (
            "resource_exhausted" in body
            or "quota" in body
            or "rate limit" in body
            or "rate_limit" in body
        )

    def _fallback_error_detail(self, responses: list[dict[str, Any]]) -> str | dict[str, Any]:
        message = "Gemini API request failed"
        if self.settings.app_env != "development":
            return message

        return {
            "message": message,
            "attempts": responses,
        }

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
