create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  course text,
  document_type text not null default 'essay',
  status text not null default 'draft',
  language text not null default 'en',
  tone text not null default 'academic',
  progress integer not null default 0,
  instructions text not null,
  source_text text,
  generated_content text,
  word_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint documents_title_not_blank check (char_length(btrim(title)) > 0),
  constraint documents_instructions_not_blank check (char_length(btrim(instructions)) > 0),
  constraint documents_type_check check (document_type in ('essay', 'summary', 'research', 'report', 'outline', 'notes', 'custom')),
  constraint documents_status_check check (status in ('draft', 'generated', 'reviewed', 'archived')),
  constraint documents_language_check check (language in ('en', 'ru', 'kz')),
  constraint documents_tone_check check (tone in ('academic', 'simple', 'formal', 'concise', 'persuasive')),
  constraint documents_progress_check check (progress >= 0 and progress <= 100),
  constraint documents_word_count_check check (word_count >= 0)
);

create index if not exists documents_user_id_updated_at_idx
on public.documents (user_id, updated_at desc);

create index if not exists documents_user_id_status_idx
on public.documents (user_id, status);

drop trigger if exists set_documents_updated_at on public.documents;

create trigger set_documents_updated_at
before update on public.documents
for each row
execute function public.set_updated_at();

alter table public.documents enable row level security;

drop policy if exists "documents_select_own" on public.documents;
drop policy if exists "documents_insert_own" on public.documents;
drop policy if exists "documents_update_own" on public.documents;
drop policy if exists "documents_delete_own" on public.documents;

create policy "documents_select_own"
on public.documents
for select
to authenticated
using (auth.uid() = user_id);

create policy "documents_insert_own"
on public.documents
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "documents_update_own"
on public.documents
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "documents_delete_own"
on public.documents
for delete
to authenticated
using (auth.uid() = user_id);

revoke all on public.documents from anon;
revoke all on public.documents from authenticated;
grant select, insert, update, delete on public.documents to authenticated;

comment on table public.documents is 'Per-user document generator workspace and AI writing results.';
