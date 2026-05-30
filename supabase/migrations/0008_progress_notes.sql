-- =============================================================================
-- 0008_progress_notes.sql
-- Tutor's private notes on each student. Tutor has full write access; the
-- student may read notes about themselves.
-- =============================================================================

create table public.progress_notes (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.profiles (id) on delete cascade,
  tutor_id    uuid not null references public.profiles (id) on delete cascade,
  note        text not null,
  created_at  timestamptz not null default now()
);

create index progress_notes_student_idx on public.progress_notes (student_id);

alter table public.progress_notes enable row level security;

create policy "Progress notes: student reads own"
  on public.progress_notes for select
  using (auth.uid() = student_id);

create policy "Progress notes: tutor reads all"
  on public.progress_notes for select
  using (public.is_tutor());

create policy "Progress notes: tutor inserts"
  on public.progress_notes for insert
  with check (public.is_tutor());

create policy "Progress notes: tutor updates"
  on public.progress_notes for update
  using (public.is_tutor())
  with check (public.is_tutor());

create policy "Progress notes: tutor deletes"
  on public.progress_notes for delete
  using (public.is_tutor());
