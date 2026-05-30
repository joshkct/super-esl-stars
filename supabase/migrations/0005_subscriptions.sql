-- =============================================================================
-- 0005_subscriptions.sql
-- Student subscription plans. sessions_per_month is nullable (configured later
-- by the tutor). Students read their own subscription; the tutor manages all.
-- =============================================================================

create table public.subscriptions (
  id                  uuid primary key default gen_random_uuid(),
  student_id          uuid not null references public.profiles (id) on delete cascade,
  plan_name           text not null,
  sessions_per_month  integer check (sessions_per_month is null or sessions_per_month >= 0),
  status              public.subscription_status not null default 'active',
  start_date          date not null default current_date,
  end_date            date,
  created_at          timestamptz not null default now()
);

create index subscriptions_student_idx on public.subscriptions (student_id);

alter table public.subscriptions enable row level security;

create policy "Subscriptions: student reads own"
  on public.subscriptions for select
  using (auth.uid() = student_id);

create policy "Subscriptions: tutor reads all"
  on public.subscriptions for select
  using (public.is_tutor());

-- Only the tutor configures subscriptions.
create policy "Subscriptions: tutor inserts"
  on public.subscriptions for insert
  with check (public.is_tutor());

create policy "Subscriptions: tutor updates"
  on public.subscriptions for update
  using (public.is_tutor())
  with check (public.is_tutor());

create policy "Subscriptions: tutor deletes"
  on public.subscriptions for delete
  using (public.is_tutor());
