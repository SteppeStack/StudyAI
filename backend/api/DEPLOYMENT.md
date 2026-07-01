# StudyAI API Deployment

Deploy this folder as a separate Vercel project.

## Project Root

Use this folder as the Vercel project root:

```text
backend/api
```

Vercel entrypoint:

```text
api/index.py
```

## Environment Variables

Add these variables in Vercel Project Settings:

```env
APP_ENV=production
API_CORS_ORIGINS=https://YOUR_FRONTEND_DOMAIN
SUPABASE_URL=https://qbehdcwyuvbuwyrytjtx.supabase.co
SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
AI_PROVIDER=gemini
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-2.5-flash
GEMINI_MODEL_CHAIN=gemini-2.5-flash-lite,gemini-2.0-flash,gemini-2.5-flash
SUPABASE_STORAGE_BUCKET=study-files
MAX_UPLOAD_SIZE_BYTES=26214400
MAX_ANALYSIS_FILE_SIZE_BYTES=10485760
MAX_AI_INPUT_CHARS=30000
AI_TUTOR_HISTORY_LIMIT=8
```

Use comma-separated origins if you need both production and local frontend:

```env
API_CORS_ORIGINS=https://YOUR_FRONTEND_DOMAIN,http://localhost:3000
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` or `GEMINI_API_KEY` in frontend code.

## Required Supabase Migrations

Before deploying or testing the latest API routes, apply these migrations in Supabase SQL Editor if they are not applied yet:

```text
backend/supabase/migrations/202607010001_create_documents.sql
backend/supabase/migrations/202607010002_create_exam_preps.sql
backend/supabase/migrations/202607010003_create_diploma_projects.sql
backend/supabase/migrations/202607010004_create_ai_request_events.sql
```

These migrations are also listed in `ACTIONS_REQUIRED.md`.

## Frontend Environment

The frontend should know the deployed API domain:

```env
NEXT_PUBLIC_API_URL=https://YOUR_API_DOMAIN
```

Keep Supabase public values in frontend:

```env
NEXT_PUBLIC_SUPABASE_URL=https://qbehdcwyuvbuwyrytjtx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

## Verify After Deploy

Open:

```text
https://YOUR_API_DOMAIN/health
https://YOUR_API_DOMAIN/docs
```

Then smoke test these authenticated endpoints in Swagger:

```text
GET /api/v1/dashboard
POST /api/v1/ai/chat
POST /api/v1/documents
POST /api/v1/exam-preps
POST /api/v1/diplomas
```

AI Tutor example:

```http
POST https://YOUR_API_DOMAIN/api/v1/ai/chat
Authorization: Bearer USER_ACCESS_TOKEN
Content-Type: application/json
```

Body:

```json
{
  "message": "Explain quadratic equations step by step.",
  "conversation_id": null,
  "title": "Math test"
}
```

Expected:

- `200 OK` for `GET /health`;
- Swagger loads at `/docs`;
- authenticated endpoints return `401` without a token;
- authenticated endpoints work with a valid Supabase access token;
- AI endpoints include `model_used`, `fallback_used`, and usage fields.
