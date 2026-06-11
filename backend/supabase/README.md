# StudyAI Backend: Sprint 1

This folder contains the Supabase backend setup for Sprint 1:

- Email/password authentication through Supabase Auth
- `profiles` table linked to `auth.users`
- Automatic profile creation after signup
- Row Level Security so users can only read and update their own profile

## What You Need To Create Yourself

You need to create the Supabase project manually:

1. Open Supabase.
2. Create a new project.
3. Save the project password somewhere safe.
4. Open **Authentication > Providers**.
5. Enable **Email**.

You do not need to write SQL by hand. The SQL is already in the migration files.

## Apply in Supabase Dashboard

1. Open your Supabase project.
2. Open **SQL Editor**.
3. Open each migration file from `backend/supabase/migrations`.
4. Copy and run them in this exact order:
   - `202606120001_create_profiles.sql`
   - `202606120002_create_auth_profile_trigger.sql`
   - `202606120003_enable_profiles_rls.sql`

## Values You Need To Copy From Supabase

After creating the Supabase project, copy these values from **Project Settings > API**:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key
```

Later, for server-side backend operations only, you may also need:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Do not expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code.

## Apply with Supabase CLI

If the Supabase CLI is installed and linked to your project:

```bash
supabase db push
```

For now, using the Supabase Dashboard SQL Editor is simpler.

## Sprint 1 Acceptance Check

Sprint 1 is done when:

- A user can sign up with email/password.
- A row is automatically inserted into `public.profiles`.
- The logged-in user can select their own profile.
- The logged-in user cannot select another user's profile.
- The logged-in user can update editable profile fields.
- The logged-in user cannot change their own `subscription_plan` through the public client.
