insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'study-files',
  'study-files',
  false,
  26214400,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/png',
    'image/jpeg',
    'image/webp'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.user_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  bucket_id text not null default 'study-files',
  storage_path text not null unique,
  original_name text not null,
  content_type text,
  file_type text not null,
  size_bytes bigint not null,
  status text not null default 'uploaded',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_files_original_name_not_blank check (char_length(btrim(original_name)) > 0),
  constraint user_files_storage_path_not_blank check (char_length(btrim(storage_path)) > 0),
  constraint user_files_size_check check (size_bytes > 0),
  constraint user_files_status_check check (status in ('uploaded', 'processing', 'ready', 'failed')),
  constraint user_files_type_check check (file_type in ('pdf', 'doc', 'docx', 'txt', 'image', 'other'))
);

create index if not exists user_files_user_id_created_at_idx
on public.user_files (user_id, created_at desc);

drop trigger if exists set_user_files_updated_at on public.user_files;

create trigger set_user_files_updated_at
before update on public.user_files
for each row
execute function public.set_updated_at();

alter table public.user_files enable row level security;

drop policy if exists "user_files_select_own" on public.user_files;
drop policy if exists "user_files_insert_own" on public.user_files;
drop policy if exists "user_files_update_own" on public.user_files;
drop policy if exists "user_files_delete_own" on public.user_files;

create policy "user_files_select_own"
on public.user_files
for select
to authenticated
using (auth.uid() = user_id);

create policy "user_files_insert_own"
on public.user_files
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "user_files_update_own"
on public.user_files
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "user_files_delete_own"
on public.user_files
for delete
to authenticated
using (auth.uid() = user_id);

revoke all on public.user_files from anon;
revoke all on public.user_files from authenticated;
grant select, insert, update, delete on public.user_files to authenticated;

drop policy if exists "study_files_select_own_folder" on storage.objects;
drop policy if exists "study_files_insert_own_folder" on storage.objects;
drop policy if exists "study_files_update_own_folder" on storage.objects;
drop policy if exists "study_files_delete_own_folder" on storage.objects;

create policy "study_files_select_own_folder"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'study-files'
  and name like auth.uid()::text || '/%'
);

create policy "study_files_insert_own_folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'study-files'
  and name like auth.uid()::text || '/%'
);

create policy "study_files_update_own_folder"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'study-files'
  and name like auth.uid()::text || '/%'
)
with check (
  bucket_id = 'study-files'
  and name like auth.uid()::text || '/%'
);

create policy "study_files_delete_own_folder"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'study-files'
  and name like auth.uid()::text || '/%'
);

comment on table public.user_files is 'Per-user uploaded academic files stored in Supabase Storage.';
