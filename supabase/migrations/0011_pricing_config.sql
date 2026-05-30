-- =============================================================================
-- 0011_pricing_config.sql
-- Price matrix keyed by (level, duration). price_zar is stored in ZAR CENTS.
-- Publicly readable (so the landing page can show pricing); tutor-writable.
-- Seeded with zeros in /supabase/seed.sql for the tutor to update later.
-- =============================================================================

create table public.pricing_config (
  id                uuid primary key default gen_random_uuid(),
  level             public.english_level not null,
  duration_minutes  integer not null check (duration_minutes in (30, 60, 90)),
  price_zar         integer not null default 0 check (price_zar >= 0), -- ZAR cents
  unique (level, duration_minutes)
);

alter table public.pricing_config enable row level security;

-- Anyone can read pricing (public pricing overview on the landing page).
create policy "Pricing: public read"
  on public.pricing_config for select
  to anon, authenticated
  using (true);

create policy "Pricing: tutor inserts"
  on public.pricing_config for insert
  with check (public.is_tutor());

create policy "Pricing: tutor updates"
  on public.pricing_config for update
  using (public.is_tutor())
  with check (public.is_tutor());
