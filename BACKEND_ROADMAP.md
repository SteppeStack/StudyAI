# StudyAI Backend Roadmap

This file is the working TODO list for backend development.

When the user writes "continue by BACKEND_ROADMAP.md", Codex should:

1. Read this file.
2. Pick the first unchecked item from "Next Tasks".
3. Implement it in the smallest safe backend-focused scope.
4. Add or update tests/docs/migrations when needed.
5. Run available checks.
6. Update this file only when the task is genuinely done.
7. If manual user action is required, add it to `ACTIONS_REQUIRED.md` and continue with the next independent task when possible.
8. Tell the user what changed, what was added to `ACTIONS_REQUIRED.md`, what to test manually, and what commit name to use.

## Team Rules

- Backend work lives in `backend/`.
- Python API work lives in `backend/api/`.
- Supabase schema and RLS changes live in `backend/supabase/migrations/`.
- Do not commit `.env` files.
- Commit and update `.env.example` when new environment variables are required.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` or `GEMINI_API_KEY` to frontend code.
- Every database change should have a migration file.
- If a migration must be applied manually, provide the exact SQL text for Supabase SQL Editor.
- If a required step needs user action, write it to `ACTIONS_REQUIRED.md`.
- Do not stop autonomous work for a manual action if there is another independent task that can be done safely.
- If a task is blocked by a manual action, leave it unchecked and add a short blocker note below it.
- If frontend needs to integrate a backend feature, document endpoints, request body, response body, auth headers, and expected errors.
- After backend changes, run tests when Python is available.
- After frontend-touching fixes, run `npm.cmd run lint` and `npm.cmd run build`.

## Autonomous Work Rules

During an autonomous work session, Codex should:

1. Work from top to bottom in "Next Tasks".
2. Complete tasks that can be done without new secrets, logins, paid services, or manual Supabase UI actions.
3. Add all user-required actions to `ACTIONS_REQUIRED.md`.
4. Continue past blocked tasks when the next task is independent.
5. Avoid git commits unless the user explicitly asks for them.
6. Avoid destructive commands.
7. Keep docs and tests updated with each feature.
8. At the end, summarize completed tasks and list pending items from `ACTIONS_REQUIRED.md`.

## Current Environment Notes

- The local backend `.venv` currently points to a missing Python executable:
  `C:\Users\Al\AppData\Local\Python\pythoncore-3.14-64\python.exe`
- If backend tests cannot run, first fix/recreate the virtual environment.
- Frontend checks currently pass:
  - `npm.cmd run lint`
  - `npm.cmd run build`

## Done

- [x] Sprint 1: Supabase Auth with email/password.
- [x] Sprint 1: `profiles` table.
- [x] Sprint 1: RLS for profiles.
- [x] Sprint 2: AI Tutor conversations/messages tables.
- [x] Sprint 2: RLS for AI Tutor data.
- [x] Python FastAPI backend scaffold in `backend/api`.
- [x] Swagger/OpenAPI docs through FastAPI `/docs`.
- [x] AI Tutor API with Gemini integration.
- [x] AI Tutor API saves user and assistant messages.
- [x] Files API: upload, list, signed URL, delete.
- [x] Files API: Gemini file analysis.
- [x] File analysis cache and token optimization.
- [x] Assignment Helper API: create, list, get, update, delete.
- [x] Assignment Helper API: generate AI help with Gemini.
- [x] Gemini model fallback chain.
- [x] API deployment documentation.
- [x] Frontend build/lint cleanup from 2026-07-01.

## Next Tasks

- [ ] Fix local Python environment and make backend tests runnable again.
  - Blocked: local `.venv` points to a missing Python executable. Manual steps are in `ACTIONS_REQUIRED.md`.
- [ ] Run backend test suite and fix any failing tests.
  - Blocked until local Python environment is repaired.
- [x] Add Documents API.
  - SQL apply step is listed in `ACTIONS_REQUIRED.md`.
- [x] Add Exam Prep API.
  - SQL apply step is listed in `ACTIONS_REQUIRED.md`.
- [x] Add Diploma Assistant API.
  - SQL apply step is listed in `ACTIONS_REQUIRED.md`.
- [x] Add usage limits and AI request accounting.
  - SQL apply step is listed in `ACTIONS_REQUIRED.md`.
- [x] Add dashboard API endpoints if frontend should stop reading dashboard tables directly from Supabase.
- [x] Add subscription/payment backend design before real payment provider integration.
  - Provider choice is listed in `ACTIONS_REQUIRED.md`.
- [x] Add API error response documentation for frontend.
- [x] Add deployment checklist for production backend and frontend integration.
- [x] Update root README so it matches the current backend state.

## Suggested Order

1. Environment repair.
2. Tests.
3. Documents API.
4. Exam Prep API.
5. Diploma Assistant API.
6. Usage limits/accounting.
7. Subscription/payment design.
8. Production readiness.

## Backend Feature Checklist

Use this checklist for every new backend feature:

- [ ] Migration exists if database schema changes.
- [ ] RLS policies are defined if frontend/Supabase direct access is needed.
- [ ] FastAPI route exists if server-side secrets or AI are required.
- [ ] Pydantic request/response schemas exist.
- [ ] Service layer handles Supabase/Gemini calls.
- [ ] Auth is enforced through `Authorization: Bearer USER_ACCESS_TOKEN`.
- [ ] Swagger docs show useful request examples.
- [ ] Tests cover success and important error cases.
- [ ] Docs explain frontend integration.
- [ ] `.env.example` is updated if new env vars are needed.

## Frontend Handoff Template

For every completed API, give frontend this:

```md
## Feature Name

Base URL:
`https://YOUR_API_DOMAIN`

Auth:
`Authorization: Bearer USER_ACCESS_TOKEN`

Endpoints:

- `METHOD /path`

Request:

```json
{}
```

Response:

```json
{}
```

Frontend tasks:

- [ ] Add API function.
- [ ] Connect form/page.
- [ ] Handle loading state.
- [ ] Handle error state.
- [ ] Show empty state.
```

## Manual Test Template

Use Swagger:

1. Open `/docs`.
2. Click endpoint.
3. Click "Try it out".
4. Add `Authorization: Bearer USER_ACCESS_TOKEN`.
5. Send request body.
6. Confirm expected response.
7. Confirm data in Supabase if the endpoint writes data.

## Commit Message Ideas

- `fix: restore frontend lint and build`
- `chore: repair backend python test environment`
- `feat: add documents api`
- `feat: add exam prep api`
- `feat: add diploma assistant api`
- `feat: add ai usage limits`
- `docs: update backend integration guide`
