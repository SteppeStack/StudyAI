alter table public.profiles
add column if not exists account_role text not null default 'student';

alter table public.profiles
add constraint profiles_account_role_check
check (account_role in ('student', 'teacher'));

comment on column public.profiles.account_role is 'Account role assigned by backend. The browser client cannot update it.';
