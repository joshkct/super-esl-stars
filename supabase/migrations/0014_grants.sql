-- =============================================================================
-- 0014_grants.sql
-- Table/sequence privileges for the PostgREST API roles.
--
-- Row Level Security (enabled on every table) decides WHICH ROWS a role can
-- touch, but Postgres still requires table-level GRANTs to permit access at
-- all. Migrations applied by the CLI run as `postgres`, which does not inherit
-- Supabase's default API grants, so we grant them explicitly here.
--
--   authenticated -> full DML (RLS restricts to own rows / tutor-all)
--   anon          -> select + insert only (public pricing, contact form);
--                    RLS limits this to the few tables/rows that allow it.
-- =============================================================================

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete
  on all tables in schema public to authenticated;

grant select, insert
  on all tables in schema public to anon;

grant usage, select
  on all sequences in schema public to anon, authenticated;

-- Apply the same grants to any tables/sequences created later by this role.
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public
  grant select, insert on tables to anon;
alter default privileges in schema public
  grant usage, select on sequences to anon, authenticated;
