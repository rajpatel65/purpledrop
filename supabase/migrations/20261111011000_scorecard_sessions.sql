create table if not exists public.scorecard_challenges (
 id uuid primary key, email text not null, domain text not null, ip_hash text not null,
 code_hash text not null, expires_at timestamptz not null, attempts integer not null default 0, blocked_until timestamptz,
 verified boolean not null default false, token_hash text, consumed boolean not null default false,
 created_at timestamptz not null default now()
);
alter table public.scorecard_challenges enable row level security;
revoke all on public.scorecard_challenges from anon, authenticated;
create index if not exists scorecard_challenge_cleanup on public.scorecard_challenges(created_at);
create or replace function public.verify_scorecard_challenge(challenge uuid, candidate text, token text, source_ip text)
returns text language plpgsql security definer set search_path = public as $$
declare c scorecard_challenges%rowtype;
begin
 select * into c from scorecard_challenges where id=challenge for update;
 if not found or c.expires_at <= now() or c.verified or c.ip_hash <> source_ip then return 'expired'; end if;
 if c.attempts >= 3 then return 'blocked'; end if;
 if c.code_hash <> candidate then
   update scorecard_challenges set attempts=attempts+1, blocked_until=case when attempts+1 >= 3 then now()+interval '15 minutes' else null end where id=challenge;
   if c.attempts + 1 >= 3 then return 'blocked'; end if;
   return 'invalid';
 end if;
 update scorecard_challenges set verified=true, token_hash=token, code_hash='', expires_at=now()+interval '10 minutes' where id=challenge;
 return 'verified';
end $$;
create or replace function public.consume_scorecard_token(challenge uuid, token text, source_ip text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare c scorecard_challenges%rowtype;
begin
 update scorecard_challenges set consumed=true where id=challenge and token_hash=token and ip_hash=source_ip and verified and not consumed and expires_at>now() returning * into c;
 if not found then return null; end if;
 return jsonb_build_object('email',c.email,'domain',c.domain);
end $$;
revoke all on function public.verify_scorecard_challenge(uuid,text,text,text) from public, anon, authenticated;
revoke all on function public.consume_scorecard_token(uuid,text,text) from public, anon, authenticated;
grant execute on function public.verify_scorecard_challenge(uuid,text,text,text) to service_role;
grant execute on function public.consume_scorecard_token(uuid,text,text) to service_role;

create or replace function public.scorecard_is_blocked(address text, source_ip text)
returns boolean language sql security definer set search_path = public as $$
 select exists(select 1 from scorecard_challenges where (email=address or ip_hash=source_ip) and attempts>=3 and blocked_until>now());
$$;
revoke all on function public.scorecard_is_blocked(text,text) from public, anon, authenticated;
grant execute on function public.scorecard_is_blocked(text,text) to service_role;
