create table if not exists public.diploma_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  topic text not null,
  faculty text,
  research_area text,
  supervisor text,
  deadline date,
  research_type text not null default 'mixed',
  status text not null default 'draft',
  progress integer not null default 0,
  research_goal text,
  objectives text,
  chapter_statuses jsonb not null default '{
    "introduction": "notStarted",
    "literature": "notStarted",
    "methodology": "notStarted",
    "results": "notStarted",
    "discussion": "notStarted",
    "conclusion": "notStarted"
  }'::jsonb,
  generated_structure text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint diploma_projects_topic_not_blank check (char_length(btrim(topic)) > 0),
  constraint diploma_projects_research_type_check check (research_type in ('mixed', 'quantitative', 'qualitative', 'theoretical')),
  constraint diploma_projects_status_check check (status in ('draft', 'structured', 'in_progress', 'reviewed', 'completed', 'archived')),
  constraint diploma_projects_progress_check check (progress >= 0 and progress <= 100)
);

create index if not exists diploma_projects_user_id_updated_at_idx
on public.diploma_projects (user_id, updated_at desc);

create index if not exists diploma_projects_user_id_deadline_idx
on public.diploma_projects (user_id, deadline asc);

drop trigger if exists set_diploma_projects_updated_at on public.diploma_projects;

create trigger set_diploma_projects_updated_at
before update on public.diploma_projects
for each row
execute function public.set_updated_at();

alter table public.diploma_projects enable row level security;

drop policy if exists "diploma_projects_select_own" on public.diploma_projects;
drop policy if exists "diploma_projects_insert_own" on public.diploma_projects;
drop policy if exists "diploma_projects_update_own" on public.diploma_projects;
drop policy if exists "diploma_projects_delete_own" on public.diploma_projects;

create policy "diploma_projects_select_own"
on public.diploma_projects
for select
to authenticated
using (auth.uid() = user_id);

create policy "diploma_projects_insert_own"
on public.diploma_projects
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "diploma_projects_update_own"
on public.diploma_projects
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "diploma_projects_delete_own"
on public.diploma_projects
for delete
to authenticated
using (auth.uid() = user_id);

revoke all on public.diploma_projects from anon;
revoke all on public.diploma_projects from authenticated;
grant select, insert, update, delete on public.diploma_projects to authenticated;

comment on table public.diploma_projects is 'Per-user diploma/thesis workspace, chapter progress, and AI-generated structure.';
