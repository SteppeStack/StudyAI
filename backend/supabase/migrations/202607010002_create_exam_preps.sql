create table if not exists public.exam_preps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  subject text not null,
  exam_date date,
  prep_mode text not null default 'studyPlan',
  status text not null default 'draft',
  progress integer not null default 0,
  readiness_score integer not null default 0,
  topics text not null,
  current_knowledge text,
  generated_content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint exam_preps_title_not_blank check (char_length(btrim(title)) > 0),
  constraint exam_preps_subject_not_blank check (char_length(btrim(subject)) > 0),
  constraint exam_preps_topics_not_blank check (char_length(btrim(topics)) > 0),
  constraint exam_preps_mode_check check (prep_mode in ('studyPlan', 'flashcards', 'practiceQuiz', 'weakTopics')),
  constraint exam_preps_status_check check (status in ('draft', 'generated', 'in_progress', 'completed', 'archived')),
  constraint exam_preps_progress_check check (progress >= 0 and progress <= 100),
  constraint exam_preps_readiness_score_check check (readiness_score >= 0 and readiness_score <= 100)
);

create index if not exists exam_preps_user_id_updated_at_idx
on public.exam_preps (user_id, updated_at desc);

create index if not exists exam_preps_user_id_exam_date_idx
on public.exam_preps (user_id, exam_date asc);

drop trigger if exists set_exam_preps_updated_at on public.exam_preps;

create trigger set_exam_preps_updated_at
before update on public.exam_preps
for each row
execute function public.set_updated_at();

alter table public.exam_preps enable row level security;

drop policy if exists "exam_preps_select_own" on public.exam_preps;
drop policy if exists "exam_preps_insert_own" on public.exam_preps;
drop policy if exists "exam_preps_update_own" on public.exam_preps;
drop policy if exists "exam_preps_delete_own" on public.exam_preps;

create policy "exam_preps_select_own"
on public.exam_preps
for select
to authenticated
using (auth.uid() = user_id);

create policy "exam_preps_insert_own"
on public.exam_preps
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "exam_preps_update_own"
on public.exam_preps
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "exam_preps_delete_own"
on public.exam_preps
for delete
to authenticated
using (auth.uid() = user_id);

revoke all on public.exam_preps from anon;
revoke all on public.exam_preps from authenticated;
grant select, insert, update, delete on public.exam_preps to authenticated;

comment on table public.exam_preps is 'Per-user exam preparation plans and AI-generated study materials.';
