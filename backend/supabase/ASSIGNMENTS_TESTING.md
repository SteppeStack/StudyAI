# Assignments Testing

Apply this migration in Supabase SQL Editor:

```text
backend/supabase/migrations/202606270001_create_assignments.sql
```

It creates:

- table: `public.assignments`;
- per-user RLS policies;
- assignment status, priority, help type, and progress constraints.

## API Checks

After the Python API is running, open:

```text
http://127.0.0.1:8000/docs
```

Authorize with a Supabase access token, then check:

```http
POST /api/v1/assignments
GET /api/v1/assignments
GET /api/v1/assignments/{assignment_id}
PATCH /api/v1/assignments/{assignment_id}
POST /api/v1/assignments/{assignment_id}/generate
DELETE /api/v1/assignments/{assignment_id}
```

Expected behavior:

- assignments are saved per account;
- users can only access their own assignments;
- AI generation stores the result in the assignment row;
- AI generation increments monthly usage;
- assignment actions appear in dashboard activity events.
