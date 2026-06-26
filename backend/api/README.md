# StudyAI Python API

This is the Python API for operations that must stay server-side, such as AI requests, payment verification, and admin operations.

It does not replace Supabase Auth or the Supabase database in Sprint 1. The frontend continues to use Supabase Auth and `profiles` directly.

## Included Now

- FastAPI application
- Health endpoint: `GET /health`
- AI Tutor endpoint: `POST /api/v1/ai/chat`
- Files endpoints: `POST /api/v1/files/upload`, `GET /api/v1/files`
- Interactive Swagger UI: `/docs`
- CORS for the future Next.js frontend
- Automated tests for health and AI route structure

## You Need To Do Once

Install Python 3.11 or newer and ensure that the installer option **Add python.exe to PATH** is enabled.

After installation, open PowerShell in `backend/api` and run:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

If PowerShell blocks activation, run this only for the current terminal window, then activate again:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
```

## Verify

Open these addresses in a browser:

```text
http://127.0.0.1:8000/health
http://127.0.0.1:8000/docs
```

`/health` should return:

```json
{
  "status": "ok",
  "service": "studyai-api",
  "environment": "development"
}
```

Swagger at `/docs` lets you call the endpoint without Thunder Client or Postman.

## Test

With the virtual environment activated:

```powershell
python -m pytest
```

## Environment

Create a local `.env` file from `.env.example` only when a server-side feature needs configuration. Never commit the real `.env` file.

For the AI Tutor endpoint, fill:

```env
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AI_PROVIDER=gemini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

`SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY` must never be used in frontend code.

## Frontend Contract

See `AI_CHAT_API.md`.

See `FILES_API.md` for the Files Workspace upload/list/delete contract.

After this endpoint is deployed, the frontend should call `POST /api/v1/ai/chat` for AI Tutor messages instead of inserting `ai_messages` directly. The API saves both the user message and the Gemini assistant response.

## Vercel

If deploying only this API folder to Vercel, use `backend/api` as the project root. The Vercel entrypoint is:

```text
api/index.py
```

See `DEPLOYMENT.md` for the deployment checklist and required environment variables.
