alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.monthly_usage enable row level security;
alter table public.activity_events enable row level security;

drop policy if exists "plans_select_public" on public.plans;
drop policy if exists "subscriptions_select_own" on public.subscriptions;
drop policy if exists "monthly_usage_select_own" on public.monthly_usage;
drop policy if exists "activity_events_select_own" on public.activity_events;

create policy "plans_select_public"
on public.plans
for select
to anon, authenticated
using (is_active = true);

create policy "subscriptions_select_own"
on public.subscriptions
for select
to authenticated
using (auth.uid() = user_id);

create policy "monthly_usage_select_own"
on public.monthly_usage
for select
to authenticated
using (auth.uid() = user_id);

create policy "activity_events_select_own"
on public.activity_events
for select
to authenticated
using (auth.uid() = user_id);

revoke all on public.plans from anon;
revoke all on public.plans from authenticated;
revoke all on public.subscriptions from anon;
revoke all on public.subscriptions from authenticated;
revoke all on public.monthly_usage from anon;
revoke all on public.monthly_usage from authenticated;
revoke all on public.activity_events from anon;
revoke all on public.activity_events from authenticated;

grant select on public.plans to anon, authenticated;
grant select on public.subscriptions to authenticated;
grant select on public.monthly_usage to authenticated;
grant select on public.activity_events to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do nothing;

  insert into public.subscriptions (user_id, plan_id, status)
  values (new.id, 'free', 'active')
  on conflict (user_id) where status in ('active', 'trialing') do nothing;

  insert into public.monthly_usage (user_id, period_start)
  values (new.id, date_trunc('month', current_date)::date)
  on conflict (user_id, period_start) do nothing;

  return new;
end;
$$;
