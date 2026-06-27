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

## Verify After Deploy

Open:

```text
https://YOUR_API_DOMAIN/health
https://YOUR_API_DOMAIN/docs
```

Then test:

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
