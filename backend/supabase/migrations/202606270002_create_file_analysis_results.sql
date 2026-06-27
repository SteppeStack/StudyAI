create table if not exists public.file_analysis_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  file_id uuid not null references public.user_files(id) on delete cascade,
  action text not null,
  question text,
  response_mode text not null default 'normal',
  result text not null,
  source_size_bytes bigint not null default 0,
  input_chars_used integer,
  was_truncated boolean not null default false,
  model_used text,
  fallback_used boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint file_analysis_results_action_check check (
    action in ('summarize', 'key_points', 'flashcards', 'quiz', 'ask', 'create_notes')
  ),
  constraint file_analysis_results_response_mode_check check (
    response_mode in ('short', 'normal', 'detailed')
  ),
  constraint file_analysis_results_result_not_blank check (char_length(btrim(result)) > 0),
  constraint file_analysis_results_unique_request unique (
    user_id,
    file_id,
    action,
    response_mode,
    question
  )
);

create unique index if not exists file_analysis_results_unique_null_question_idx
on public.file_analysis_results (user_id, file_id, action, response_mode)
where question is null;

create index if not exists file_analysis_results_user_id_created_at_idx
on public.file_analysis_results (user_id, created_at desc);

drop trigger if exists set_file_analysis_results_updated_at on public.file_analysis_results;

create trigger set_file_analysis_results_updated_at
before update on public.file_analysis_results
for each row
execute function public.set_updated_at();

alter table public.file_analysis_results enable row level security;

drop policy if exists "file_analysis_results_select_own" on public.file_analysis_results;
drop policy if exists "file_analysis_results_insert_own" on public.file_analysis_results;
drop policy if exists "file_analysis_results_update_own" on public.file_analysis_results;
drop policy if exists "file_analysis_results_delete_own" on public.file_analysis_results;

create policy "file_analysis_results_select_own"
on public.file_analysis_results
for select
to authenticated
using (auth.uid() = user_id);

create policy "file_analysis_results_insert_own"
on public.file_analysis_results
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "file_analysis_results_update_own"
on public.file_analysis_results
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "file_analysis_results_delete_own"
on public.file_analysis_results
for delete
to authenticated
using (auth.uid() = user_id);

revoke all on public.file_analysis_results from anon;
revoke all on public.file_analysis_results from authenticated;
grant select, insert, update, delete on public.file_analysis_results to authenticated;

comment on table public.file_analysis_results is 'Cached Gemini results for repeated file analysis requests.';
