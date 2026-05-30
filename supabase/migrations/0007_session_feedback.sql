-- =============================================================================
-- 0007_session_feedback.sql
-- Optional post-session feedback. Both tutor and student may submit at most one
-- entry per booking (enforced by a unique constraint). Author and recipient can
-- each read the entry.
-- =============================================================================

create table public.session_feedback (
  id            uuid primary key default gen_random_uuid(),
  booking_id    uuid not null references public.bookings (id) on delete cascade,
  author_id     uuid not null references public.profiles (id) on delete cascade,
  recipient_id  uuid not null references public.profiles (id) on delete cascade,
  message       text,
  created_at    timestamptz not null default now(),
  unique (booking_id, author_id)
);

create index session_feedback_recipient_idx on public.session_feedback (recipient_id);

alter table public.session_feedback enable row level security;

create policy "Feedback: author or recipient reads"
  on public.session_feedback for select
  using (auth.uid() = author_id or auth.uid() = recipient_id or public.is_tutor());

create policy "Feedback: author inserts own"
  on public.session_feedback for insert
  with check (auth.uid() = author_id);

create policy "Feedback: author updates own"
  on public.session_feedback for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);
