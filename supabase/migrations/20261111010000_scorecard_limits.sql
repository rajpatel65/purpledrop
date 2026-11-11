-- Hashes only, no report content or raw email/IP. Service-role-only RPC.
create table if not exists public.scorecard_rate_limits (
  bucket text primary key,
  hits integer not null default 0,
  expires_at timestamptz not null
);
alter table public.scorecard_rate_limits enable row level security;
revoke all on public.scorecard_rate_limits from anon, authenticated;
create or replace function public.claim_scorecard_scan(keys text[], caps integer[], expiry timestamptz[])
returns boolean language plpgsql security definer set search_path = public as $$
declare i integer; used integer;
begin
  if cardinality(keys) <> cardinality(caps) or cardinality(keys) <> cardinality(expiry) or cardinality(keys) > 4 then return false; end if;
  -- Serialize only claims; remote scanning and email happen outside this lock.
  perform pg_advisory_xact_lock(71468231);
  delete from scorecard_rate_limits where expires_at < now();
  for i in 1..cardinality(keys) loop
    select hits into used from scorecard_rate_limits where bucket = keys[i];
    if coalesce(used, 0) >= caps[i] then return false; end if;
  end loop;
  for i in 1..cardinality(keys) loop
    insert into scorecard_rate_limits(bucket,hits,expires_at) values(keys[i],1,expiry[i])
    on conflict(bucket) do update set hits = scorecard_rate_limits.hits + 1;
  end loop;
  return true;
end $$;
revoke all on function public.claim_scorecard_scan(text[],integer[],timestamptz[]) from public, anon, authenticated;
grant execute on function public.claim_scorecard_scan(text[],integer[],timestamptz[]) to service_role;
