# StudyAI Backend

This folder contains the backend side of StudyAI.

For now, the backend is built only with Supabase:

- Supabase Auth
- PostgreSQL
- Row Level Security
- SQL migrations

There is no custom Express, Nest, or FastAPI server in Sprint 1.

## Folder Structure

```text
backend/
  .env.example
  README.md
  supabase/
    README.md
    migrations/
```

## What Goes Here

Use this folder for:

- database tables;
- auth-related SQL;
- RLS policies;
- triggers;
- Supabase functions later, if needed;
- backend documentation.

Do not put frontend pages, React components, or UI files here.

## How To Add Backend Changes

For every database change:

1. Create a new SQL file in `backend/supabase/migrations`.
2. Use a timestamp prefix, for example:

```text
202606130001_create_documents.sql
```

3. Apply the SQL in Supabase Dashboard SQL Editor.
4. Test the change.
5. Commit the migration file.
6. Tell the frontend developer what changed.

## What To Tell The Frontend Developer

When a backend change affects frontend work, share:

- table name;
- field names;
- allowed operations: select, insert, update, delete;
- required auth state;
- example request or Supabase client usage;
- any new environment variable names.

Do not share `SUPABASE_SERVICE_ROLE_KEY`.

## Sprint 1

Sprint 1 files are in:

```text
backend/supabase/migrations/
```

They create:

- `public.profiles`;
- profile auto-creation after signup;
- RLS policies for reading/updating only the current user's profile.

Detailed Supabase setup instructions are in:

```text
backend/supabase/README.md
```
