create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  subject text,
  help_type text not null default 'solution_plan',
  deadline date,
  priority text not null default 'medium',
  status text not null default 'draft',
  progress integer not null default 0,
  description text not null,
  student_answer text,
  generated_solution_plan text,
  generated_key_points text,
  ai_feedback text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint assignments_title_not_blank check (char_length(btrim(title)) > 0),
  constraint assignments_description_not_blank check (char_length(btrim(description)) > 0),
  constraint assignments_help_type_check check (help_type in ('solution_plan', 'key_points', 'answer_check')),
  constraint assignments_priority_check check (priority in ('low', 'medium', 'high', 'urgent')),
  constraint assignments_status_check check (status in ('draft', 'in_progress', 'submitted', 'checked', 'completed')),
  constraint assignments_progress_check check (progress >= 0 and progress <= 100)
);

create index if not exists assignments_user_id_updated_at_idx
on public.assignments (user_id, updated_at desc);

create index if not exists assignments_user_id_deadline_idx
on public.assignments (user_id, deadline asc);

drop trigger if exists set_assignments_updated_at on public.assignments;

create trigger set_assignments_updated_at
before update on public.assignments
for each row
execute function public.set_updated_at();

alter table public.assignments enable row level security;

drop policy if exists "assignments_select_own" on public.assignments;
drop policy if exists "assignments_insert_own" on public.assignments;
drop policy if exists "assignments_update_own" on public.assignments;
drop policy if exists "assignments_delete_own" on public.assignments;

create policy "assignments_select_own"
on public.assignments
for select
to authenticated
using (auth.uid() = user_id);

create policy "assignments_insert_own"
on public.assignments
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "assignments_update_own"
on public.assignments
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "assignments_delete_own"
on public.assignments
for delete
to authenticated
using (auth.uid() = user_id);

revoke all on public.assignments from anon;
revoke all on public.assignments from authenticated;
grant select, insert, update, delete on public.assignments to authenticated;

comment on table public.assignments is 'Per-user assignment workspace and AI helper results.';
