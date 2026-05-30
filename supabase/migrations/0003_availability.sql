-- =============================================================================
-- 0003_availability.sql
-- Tutor availability slots. The tutor manages all slots; students may read
-- open (non-blocked) slots in order to request a booking.
-- =============================================================================

create table public.availability (
  id          uuid primary key default gen_random_uuid(),
  date        date not null,
  start_time  time not null,
  end_time    time not null,
  is_blocked  boolean not null default false,
  created_at  timestamptz not null default now(),
  constraint availability_time_order check (end_time > start_time)
);

create index availability_date_idx on public.availability (date);

alter table public.availability enable row level security;

-- Students (any authenticated user) can view open slots to book them.
create policy "Availability: authenticated read open slots"
  on public.availability for select
  to authenticated
  using (is_blocked = false or public.is_tutor());

-- Only the tutor can create, update, or remove availability.
create policy "Availability: tutor inserts"
  on public.availability for insert
  with check (public.is_tutor());

create policy "Availability: tutor updates"
  on public.availability for update
  using (public.is_tutor())
  with check (public.is_tutor());

create policy "Availability: tutor deletes"
  on public.availability for delete
  using (public.is_tutor());
