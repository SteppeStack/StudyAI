# StudyAI AI Chat API

This endpoint connects the frontend AI Tutor flow to server-side Supabase storage,
subscription usage checks, and Gemini.

## Endpoint

```http
POST /api/v1/ai/chat
Authorization: Bearer USER_ACCESS_TOKEN
Content-Type: application/json
```

Body:

```json
{
  "message": "Explain quadratic equations step by step.",
  "conversation_id": "optional-existing-conversation-id",
  "title": "Optional title for a new chat"
}
```

If `conversation_id` is not provided, the API creates a new `ai_conversations` row.

Response:

```json
{
  "conversation_id": "conversation-id",
  "user_message": {
    "id": "user-message-id",
    "role": "user",
    "content": "Explain quadratic equations step by step.",
    "created_at": "2026-06-26T00:00:00Z"
  },
  "assistant_message": {
    "id": "assistant-message-id",
    "role": "assistant",
    "content": "Assistant answer from Gemini",
    "created_at": "2026-06-26T00:00:01Z"
  },
  "usage": {
    "ai_requests_used": 1,
    "monthly_ai_request_limit": 300
  },
  "model_used": "gemini-2.5-flash-lite",
  "fallback_used": false
}
```

## Frontend Behavior

When this endpoint is enabled, the frontend should call `POST /api/v1/ai/chat`
instead of inserting chat messages directly into `ai_messages`.

The backend will:

- verify the Supabase access token;
- check the active subscription and monthly usage limit;
- create a conversation when needed;
- save the user message;
- call Gemini;
- save the assistant message;
- increment `monthly_usage.ai_requests_used`;
- create an `activity_events` row for the dashboard.

## Required Environment Variables

```env
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AI_PROVIDER=gemini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` or `GEMINI_API_KEY` in frontend code.
