-- =============================================================================
-- 0010_contact_submissions.sql
-- Public contact form messages. Anyone (anon) may submit; only the tutor may
-- read them.
-- =============================================================================

create table public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  message     text not null,
  created_at  timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

-- Allow both anonymous and authenticated visitors to submit the contact form.
create policy "Contact: public insert"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (true);

create policy "Contact: tutor reads all"
  on public.contact_submissions for select
  using (public.is_tutor());
