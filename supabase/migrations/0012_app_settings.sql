-- =============================================================================
-- 0012_app_settings.sql
-- Singleton table holding tutor-configurable platform settings:
--   * subscriber_discount_pct   - % discount applied to subscriber rates
--   * default_sessions_per_month - default monthly quota for new subscriptions
-- Both are intentionally left at sensible defaults / null for the tutor to set
-- from the dashboard later. Publicly readable (booking flow needs the discount);
-- tutor-writable only.
-- =============================================================================

create table public.app_settings (
  id                          integer primary key default 1,
  subscriber_discount_pct     integer not null default 0
                                check (subscriber_discount_pct between 0 and 100),
  default_sessions_per_month  integer check (default_sessions_per_month is null
                                or default_sessions_per_month >= 0),
  updated_at                  timestamptz not null default now(),
  constraint app_settings_singleton check (id = 1)
);

-- Ensure the singleton row always exists.
insert into public.app_settings (id) values (1) on conflict (id) do nothing;

alter table public.app_settings enable row level security;

create policy "Settings: public read"
  on public.app_settings for select
  to anon, authenticated
  using (true);

create policy "Settings: tutor updates"
  on public.app_settings for update
  using (public.is_tutor())
  with check (public.is_tutor());
