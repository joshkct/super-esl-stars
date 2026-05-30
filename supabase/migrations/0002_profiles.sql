-- =============================================================================
-- 0002_profiles.sql
-- Extends auth.users with application profile data. RLS: a user reads/updates
-- their own row; the tutor can read and update every profile (e.g. to set
-- english_level). Inserts are handled by the handle_new_user() trigger.
-- =============================================================================

create table public.profiles (
  id                  uuid primary key references auth.users (id) on delete cascade,
  full_name           text not null default '',
  email               text not null,
  role                public.user_role not null default 'student',
  language_preference text not null default 'en',
  english_level       public.english_level,
  consent_given       boolean not null default false,
  consent_at          timestamptz,
  avatar_url          text,
  created_at          timestamptz not null default now()
);

create index profiles_role_idx on public.profiles (role);

-- ----------------------------------------------------------------------------
-- Helper: is_tutor()
-- SECURITY DEFINER so it can read profiles without triggering recursive RLS.
-- Used by policies across the schema to grant the tutor full access.
-- ----------------------------------------------------------------------------
create or replace function public.is_tutor()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'tutor'
  );
$$;

-- ----------------------------------------------------------------------------
-- Trigger: handle_new_user()
-- Creates a profile row whenever a new auth.users record is inserted, pulling
-- metadata captured at sign-up (full name, language, POPIA/GDPR consent).
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    email,
    role,
    language_preference,
    consent_given,
    consent_at
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email,
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'student'),
    coalesce(new.raw_user_meta_data ->> 'language_preference', 'en'),
    coalesce((new.raw_user_meta_data ->> 'consent_given')::boolean, false),
    case
      when (new.raw_user_meta_data ->> 'consent_given')::boolean is true
      then now()
      else null
    end
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

create policy "Profiles: users read own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles: tutor reads all"
  on public.profiles for select
  using (public.is_tutor());

create policy "Profiles: users update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Profiles: tutor updates all"
  on public.profiles for update
  using (public.is_tutor())
  with check (public.is_tutor());
