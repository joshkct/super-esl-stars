-- =============================================================================
-- 0006_invoices.sql
-- Invoices. amount_zar is stored as INTEGER ZAR CENTS to avoid float errors.
-- Students read their own invoices; the tutor manages all invoices.
-- Writes are performed server-side (service role) when generating invoices.
-- =============================================================================

create table public.invoices (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.profiles (id) on delete cascade,
  booking_id  uuid references public.bookings (id) on delete set null,
  amount_zar  integer not null check (amount_zar >= 0), -- stored in ZAR cents
  status      public.invoice_status not null default 'draft',
  pdf_url     text,
  issued_at   timestamptz,
  due_date    date,
  created_at  timestamptz not null default now()
);

create index invoices_student_idx on public.invoices (student_id);
create index invoices_status_idx on public.invoices (status);

alter table public.invoices enable row level security;

create policy "Invoices: student reads own"
  on public.invoices for select
  using (auth.uid() = student_id);

create policy "Invoices: tutor reads all"
  on public.invoices for select
  using (public.is_tutor());

create policy "Invoices: tutor inserts"
  on public.invoices for insert
  with check (public.is_tutor());

create policy "Invoices: tutor updates"
  on public.invoices for update
  using (public.is_tutor())
  with check (public.is_tutor());
