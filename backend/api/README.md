# StudyAI Python API

This is the Python API for operations that must stay server-side, such as AI requests, payment verification, and admin operations.

It does not replace Supabase Auth or the Supabase database in Sprint 1. The frontend continues to use Supabase Auth and `profiles` directly.

## Included Now

- FastAPI application
- Health endpoint: `GET /health`
- Interactive Swagger UI: `/docs`
- CORS for the future Next.js frontend
- One automated health-check test

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

`SUPABASE_SERVICE_ROLE_KEY` is reserved for future server-side Supabase calls and must never be used in frontend code.
