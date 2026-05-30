-- =============================================================================
-- 0001_init.sql
-- Extensions, enums, RLS helper functions, and the new-user trigger.
-- =============================================================================

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ----------------------------------------------------------------------------
-- Enumerated types
-- ----------------------------------------------------------------------------
create type public.user_role as enum ('student', 'tutor');
create type public.english_level as enum ('beginner', 'intermediate', 'advanced');
create type public.booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
create type public.subscription_status as enum ('active', 'cancelled', 'expired');
create type public.invoice_status as enum ('draft', 'sent', 'paid');

-- NOTE: The is_tutor() helper and the handle_new_user() trigger both depend on
-- public.profiles, so they are defined in 0002_profiles.sql after that table
-- exists (SQL functions are validated at creation time).
