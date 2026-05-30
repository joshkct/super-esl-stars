-- =============================================================================
-- 0013_storage.sql
-- Storage buckets and access policies.
--   * avatars  - public bucket for profile pictures
--   * files    - private bucket for shared resources/homework
--   * invoices - private bucket for generated invoice PDFs
--
-- Object paths are namespaced by the owner's user id as the first folder
-- segment (e.g. `<uid>/<filename>`), which the policies use for access control.
-- =============================================================================

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('files', 'files', false),
  ('invoices', 'invoices', false)
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- avatars (public read; owner manages own folder)
-- ----------------------------------------------------------------------------
create policy "Avatars: public read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Avatars: owner writes own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Avatars: owner updates own folder"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ----------------------------------------------------------------------------
-- files (private; owner of folder or tutor may read/write)
-- ----------------------------------------------------------------------------
create policy "Files bucket: owner or tutor reads"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'files'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_tutor())
  );

create policy "Files bucket: authenticated uploads to own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'files'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_tutor())
  );

-- ----------------------------------------------------------------------------
-- invoices (private; student owner or tutor may read. Writes via service role.)
-- ----------------------------------------------------------------------------
create policy "Invoices bucket: owner or tutor reads"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'invoices'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_tutor())
  );
