-- Fix advisor warnings: pin search_path on set_updated_at, and prevent
-- handle_new_user (a trigger-only function) from being directly callable
-- via the public PostgREST RPC endpoint by anon/authenticated roles.
-- Revoking EXECUTE here does not affect the trigger itself: trigger firing
-- is not subject to the invoking session's function ACL.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
