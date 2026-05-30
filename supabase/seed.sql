-- =============================================================================
-- seed.sql
-- Seeds the pricing matrix with PLACEHOLDER values of 0 (ZAR cents) for every
-- (level, duration) combination. The tutor updates these from the dashboard.
--
-- Run after migrations:  supabase db reset  (local)  or via the SQL editor.
-- =============================================================================

insert into public.pricing_config (level, duration_minutes, price_zar)
values
  ('beginner',     30, 0),
  ('beginner',     60, 0),
  ('beginner',     90, 0),
  ('intermediate', 30, 0),
  ('intermediate', 60, 0),
  ('intermediate', 90, 0),
  ('advanced',     30, 0),
  ('advanced',     60, 0),
  ('advanced',     90, 0)
on conflict (level, duration_minutes) do nothing;

-- Ensure the singleton settings row exists with placeholder defaults.
insert into public.app_settings (id, subscriber_discount_pct, default_sessions_per_month)
values (1, 0, null)
on conflict (id) do nothing;
