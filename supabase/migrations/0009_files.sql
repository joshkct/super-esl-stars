-- =============================================================================
-- 0009_files.sql
-- Shared files (homework, resources). Both tutor and students upload. A user
-- can read files they uploaded or that were shared with them; the tutor reads
-- all. Files themselves live in the `files` Supabase Storage bucket.
-- =============================================================================

create table public.files (
  id            uuid primary key default gen_random_uuid(),
  uploader_id   uuid not null references public.profiles (id) on delete cascade,
  recipient_id  uuid not null references public.profiles (id) on delete cascade,
  booking_id    uuid references public.bookings (id) on delete set null,
  file_name     text not null,
  file_url      text not null,
  file_type     text not null,
  created_at    timestamptz not null default now()
);

create index files_recipient_idx on public.files (recipient_id);
create index files_uploader_idx on public.files (uploader_id);

alter table public.files enable row level security;

create policy "Files: uploader or recipient reads"
  on public.files for select
  using (auth.uid() = uploader_id or auth.uid() = recipient_id or public.is_tutor());

create policy "Files: user inserts as uploader"
  on public.files for insert
  with check (auth.uid() = uploader_id);

create policy "Files: uploader deletes own"
  on public.files for delete
  using (auth.uid() = uploader_id or public.is_tutor());
