create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  subscription_plan text not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_subscription_plan_check
    check (subscription_plan in ('free', 'premium'))
);

comment on table public.profiles is 'Public user profile data linked one-to-one with Supabase Auth users.';
comment on column public.profiles.id is 'Same UUID as auth.users.id.';
comment on column public.profiles.subscription_plan is 'Current app plan. Sprint 1 supports free by default.';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();
