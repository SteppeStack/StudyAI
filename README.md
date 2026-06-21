# StudyAI

StudyAI is split into two independent work areas:

- `backend/` - Supabase schema/auth/RLS/migrations and the Python API for server-only features.
- `frontend/` - Next.js frontend, pages, UI, Supabase client integration.

## Team Responsibilities

Backend developer:

- Works only inside `backend/`.
- Creates and updates Supabase migrations.
- Applies migrations to the shared Supabase project.
- Owns the FastAPI service in `backend/api/` for server-only operations such as AI requests.
- Documents new tables, fields, policies, and required frontend env values.
- Does not edit frontend code unless the team agrees first.

Frontend developer:

- Works only inside `frontend/`.
- Builds pages, components, forms, and client-side Supabase integration.
- Uses the public Supabase URL and anon key provided by the backend developer.
- Does not edit database schema, RLS policies, or backend migrations unless the team agrees first.

## Shared Supabase Project

Both developers use the same Supabase cloud project.

The backend developer can share these values with the frontend developer:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

The backend developer must not share this value with frontend code:

```env
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is server-side only and must never be committed to Git.

## How We Work Together

1. The backend developer creates or updates a migration in `backend/supabase/migrations`.
2. The backend developer applies that migration in Supabase.
3. The backend developer commits and pushes the migration.
4. The frontend developer pulls the latest code.
5. The frontend developer connects UI flows to the updated Supabase tables/auth.
6. If the frontend needs a new field, table, or policy, they describe the requirement to the backend developer.
7. The backend developer adds the database change through a new migration.

This keeps the database as the source of truth and prevents hidden manual changes.

## Current Sprint

Sprint 1: Supabase Auth + profiles + RLS

Goal:

- Users can sign up with email/password.
- A `profiles` row is created automatically for every new auth user.
- Users can read and update only their own profile.
- Users cannot change protected fields such as `subscription_plan`.

## Repository Rules

- Do not commit `.env` files.
- Commit `.env.example` files only.
- Put backend changes in `backend/`.
- Put frontend changes in `frontend/`.
- Every database change should be saved as a migration.
- After changing backend behavior, update `backend/README.md` if the frontend developer needs to know something.
