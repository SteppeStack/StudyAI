# StudyAI Backend

This folder contains the backend side of StudyAI.

For now, the backend is built only with Supabase:

- Supabase Auth
- PostgreSQL
- Row Level Security
- SQL migrations

There is no custom Express, Nest, or FastAPI server in Sprint 1.

The repository now also contains a minimal FastAPI service in `backend/api/`. It is reserved for server-only features in later sprints and does not replace Supabase in Sprint 1.

## Folder Structure

```text
backend/
  .env.example
  README.md
  api/
    README.md
    app/
    tests/
  supabase/
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

## Sprint 2: AI Tutor Data Model

Sprint 2 migrations create:

```text
public.ai_conversations
public.ai_messages
```

The browser client can create a conversation and insert only `user` messages for its own conversations. It cannot insert messages with the `assistant` or `system` role. A future Python API endpoint will call the AI provider and write assistant messages server-side.

Run these migrations in Supabase SQL Editor after the Sprint 1 migrations, in this exact order:

```text
202606220001_create_ai_conversations.sql
202606220002_create_ai_messages.sql
202606220003_enable_ai_tutor_rls.sql
```

Manual Thunder Client checks are documented in:

```text
backend/supabase/AI_TUTOR_TESTING.md
```
