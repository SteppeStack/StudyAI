# StudyAI Actions Required

This file collects manual actions that Codex cannot safely complete alone.

During autonomous work, Codex should add items here instead of stopping immediately when possible. After adding an item, Codex should continue with the next independent task from `BACKEND_ROADMAP.md`.

## How To Use

- User reviews this file after an autonomous work session.
- User completes the unchecked actions.
- User can mark actions as done by changing `[ ]` to `[x]`.
- If an action is no longer needed, add a short note instead of deleting it.

## Action Format

```md
- [ ] YYYY-MM-DD - Short title
  - Why: why this is needed.
  - Where: service/file/page where the action must be done.
  - Steps:
    1. Exact step.
    2. Exact step.
  - Needed value/result: what Codex needs after this is done.
  - Related task: task name from `BACKEND_ROADMAP.md`.
```

## Pending Actions

- [ ] 2026-07-01 - Repair local Python environment
  - Why: backend tests cannot run because `.venv` points to a missing Python executable.
  - Where: local machine, `backend/api/.venv`.
  - Steps:
    1. Install or restore Python 3.14 at `C:\Users\Al\AppData\Local\Python\pythoncore-3.14-64\python.exe`, or install a stable Python version and recreate `.venv`.
    2. From `backend/api`, run `python -m venv .venv`.
    3. Activate `.venv`.
    4. Run `pip install -r requirements.txt`.
    5. Run `python -m pytest`.
  - Current note: Codex checked again and `.venv` still points to the missing Python executable; `python` is still not available in PATH in this session.
  - Needed value/result: backend tests should start successfully.
  - Related task: Fix local Python environment and make backend tests runnable again.

- [ ] 2026-07-02 - Add Stripe webhook secret after backend deploy
  - Why: `POST /api/v1/billing/webhook` verifies Stripe signatures with `STRIPE_WEBHOOK_SECRET`.
  - Where: Stripe Dashboard -> Developers -> Webhooks, then backend Vercel env.
  - Steps:
    1. Deploy backend and copy the public backend URL.
    2. In Stripe Dashboard, create webhook endpoint: `https://YOUR_BACKEND_DOMAIN/api/v1/billing/webhook`.
    3. Subscribe to `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted`.
    4. Copy the webhook signing secret that starts with `whsec_`.
    5. Add it to backend env as `STRIPE_WEBHOOK_SECRET`.
    6. Redeploy backend.
  - Needed value/result: Stripe webhooks can update Supabase subscriptions.
  - Related task: Add Stripe checkout API.

## Completed Actions

- [x] 2026-07-01 - Apply Documents API migration in Supabase
  - Why: the new Documents API uses the `public.documents` table, which must exist in Supabase.
  - Where: Supabase Dashboard -> SQL Editor.
  - Steps:
    1. Open `backend/supabase/migrations/202607010001_create_documents.sql`.
    2. Copy the full SQL.
    3. Run it in Supabase SQL Editor.
    4. Confirm that `public.documents` exists and RLS is enabled.
  - Needed value/result: `public.documents` table exists in the shared Supabase project.
  - Related task: Add Documents API.

- [x] 2026-07-01 - Apply Exam Prep API migration in Supabase
  - Why: the new Exam Prep API uses the `public.exam_preps` table, which must exist in Supabase.
  - Where: Supabase Dashboard -> SQL Editor.
  - Steps:
    1. Open `backend/supabase/migrations/202607010002_create_exam_preps.sql`.
    2. Copy the full SQL.
    3. Run it in Supabase SQL Editor.
    4. Confirm that `public.exam_preps` exists and RLS is enabled.
  - Needed value/result: `public.exam_preps` table exists in the shared Supabase project.
  - Related task: Add Exam Prep API.

- [x] 2026-07-01 - Apply Diploma API migration in Supabase
  - Why: the new Diploma API uses the `public.diploma_projects` table, which must exist in Supabase.
  - Where: Supabase Dashboard -> SQL Editor.
  - Steps:
    1. Open `backend/supabase/migrations/202607010003_create_diploma_projects.sql`.
    2. Copy the full SQL.
    3. Run it in Supabase SQL Editor.
    4. Confirm that `public.diploma_projects` exists and RLS is enabled.
  - Needed value/result: `public.diploma_projects` table exists in the shared Supabase project.
  - Related task: Add Diploma Assistant API.

- [x] 2026-07-01 - Apply AI request events migration in Supabase
  - Why: daily AI limits and per-feature AI request accounting use the new `public.ai_request_events` table.
  - Where: Supabase Dashboard -> SQL Editor.
  - Steps:
    1. Open `backend/supabase/migrations/202607010004_create_ai_request_events.sql`.
    2. Copy the full SQL.
    3. Run it in Supabase SQL Editor.
    4. Confirm that `public.ai_request_events` exists and RLS is enabled.
  - Needed value/result: `public.ai_request_events` table exists in the shared Supabase project.
  - Related task: Add usage limits and AI request accounting.

- [x] 2026-07-01 - Choose payment provider
  - Why: real subscription checkout and webhooks cannot be implemented safely until the payment provider is chosen.
  - Where: project/product decision.
  - Steps:
    1. Choose a provider such as Stripe, Paddle, Lemon Squeezy, or another available option.
    2. Confirm which plans should be paid: `student_premium`, `teacher`, or both.
    3. Confirm currency and prices.
    4. Create provider products/prices if needed.
    5. Share only the required server-side env variable names/values for backend deployment.
  - Needed value/result: selected provider and test credentials for backend integration.
  - Result: Stripe selected. Currency code: `kzt`. Prices: `student_premium` ₸5,999/month, `teacher` ₸10,999/month.
  - Related task: Add subscription/payment backend design before real payment provider integration.
