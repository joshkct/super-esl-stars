-- =============================================================================
-- 0004_bookings.sql
-- Session bookings. Students create and read their own bookings; the tutor can
-- read and manage all bookings (confirm/decline, add video link, cancel).
-- =============================================================================

create table public.bookings (
  id                      uuid primary key default gen_random_uuid(),
  student_id              uuid not null references public.profiles (id) on delete cascade,
  availability_id         uuid references public.availability (id) on delete set null,
  session_length_minutes  integer not null check (session_length_minutes in (30, 60, 90)),
  pricing_tier            public.english_level not null,
  status                  public.booking_status not null default 'pending',
  video_link              text,
  cancellation_reason     text,
  cancelled_by            uuid references public.profiles (id),
  cancelled_at            timestamptz,
  created_at              timestamptz not null default now()
);

create index bookings_student_idx on public.bookings (student_id);
create index bookings_status_idx on public.bookings (status);

alter table public.bookings enable row level security;

create policy "Bookings: student reads own"
  on public.bookings for select
  using (auth.uid() = student_id);

create policy "Bookings: tutor reads all"
  on public.bookings for select
  using (public.is_tutor());

-- Students request sessions for themselves.
create policy "Bookings: student inserts own"
  on public.bookings for insert
  with check (auth.uid() = student_id);

-- Students may update their own booking (e.g. to cancel).
create policy "Bookings: student updates own"
  on public.bookings for update
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

-- Tutor manages every booking.
create policy "Bookings: tutor updates all"
  on public.bookings for update
  using (public.is_tutor())
  with check (public.is_tutor());
