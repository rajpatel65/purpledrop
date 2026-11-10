/**
 * purpleDrop — SOC2 verification-flow security tests
 * ===================================================
 * Runs the REAL function code from supabase/functions/<fn>/index.ts in a local
 * Deno sandbox with a stubbed Supabase client and captured Resend calls,
 * then drives the full security ladder:
 *
 *   A. Origin gate (403 for all three functions)
 *   B. Happy path + one-time codes
 *   C. Send rate limit (3 codes / hour / email, case-normalized)
 *   D. Correct code accepted even while under attack
 *   E. Brute-force lockout (10 fails / 15 min, silent, nothing to learn from)
 *   F. Escalating ban in send-verification (20+ fails / hour)
 *   G. Email path end-to-end (Resend receives the SAME code stored in db)
 *   H. Assessment save (JWT required, validation, lead signals)
 *
 * Run (needs deno: https://deno.com):
 *   npm run test:functions
 *   # or: deno run --allow-env --allow-read --allow-write scripts/test-soc2-functions.ts
 *
 * Exit code 0 = all checks pass. Re-run whenever a function changes.
 *
 * The function files are copied verbatim into a temp dir with only the two
 * import lines rewritten to local stubs — so this tests the DEPLOYED LOGIC,
 * not a re-implementation, and needs no network.
 */


let pass = 0, fail = 0;
function check(name: string, ok: boolean, detail = '') {
  if (ok) { pass++; console.log(`  PASS ${name}`); }
  else { fail++; console.log(`  FAIL ${name} ${detail}`); }
}

// Stubs are imported here in template strings above and re-bound below, so single source of truth.
function req(path: string, body: unknown, origin = ALLOWED, method = 'POST', extraHeaders: Record<string, string> = {}) {
  return new Request(`http://local.test${path}`, {
    method,
    headers: { ...(origin ? { Origin: origin } : {}), 'Content-Type': 'application/json', ...extraHeaders },
    body: method === 'GET' || method === 'OPTIONS' ? undefined : JSON.stringify(body),
  });
}

const ALLOWED = 'http://localhost:5173';

let db: any, insertRow: any, resetDb: any;

const codesFor = (email: string) => db.verification_codes.filter((r) => r.email === email && !r.used);

console.log('a. Materializing function copies (verbatim logic, local stubs)…');
const tmp = await Deno.makeTempDir({ prefix: 'soc2fn-' });
const FUNCS = ['send-verification', 'verify-code', 'assessment'] as const;
for (const fn of FUNCS) {
  const src = await Deno.readTextFile(
    new URL(`./../supabase/functions/${fn}/index.ts`, import.meta.url),
  );
  const rewritten = src
    .replace('https://deno.land/std@0.168.0/http/server.ts', './stub_server.ts')
    .replace('https://esm.sh/@supabase/supabase-js@2', './stub_supabase.ts');
  await Deno.writeTextFile(`${tmp}/${fn}.ts`, rewritten);
}

// The rewritten copies import './stub_server.ts' / './stub_supabase.ts'
const stubServer = await Deno.readTextFile(new URL('./__soc2_stubs__/stub_server.ts', import.meta.url));
const stubSupabase = await Deno.readTextFile(new URL('./__soc2_stubs__/stub_supabase.ts', import.meta.url));
await Deno.writeTextFile(`${tmp}/stub_server.ts`, stubServer);
await Deno.writeTextFile(`${tmp}/stub_supabase.ts`, stubSupabase);

// Bind stubs from the SAME module instances the copies use.
const { HANDLERS } = await import(`${tmp}/stub_server.ts`);
({ db, insertRow, resetDb } = await import(`${tmp}/stub_supabase.ts`));

// Order matters: [send, verify, assess] — matches section labels below.
await import(`${tmp}/send-verification.ts`);
await import(`${tmp}/verify-code.ts`);
await import(`${tmp}/assessment.ts`);

const [send, verify, assess] = HANDLERS;
if (!send || !verify || !assess) { console.error('FAIL handlers not registered'); Deno.exit(1); }

Deno.env.set('SUPABASE_URL', 'http://fake.supabase.co');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'fake-key');
Deno.env.set('RESEND_API_KEY', 're_fake');
const originalFetch = globalThis.fetch;
globalThis.fetch = (async () => new Response('{}', { status: 200 })) as typeof fetch;

console.log('A. Origin gate (all three functions)');
for (const [name, fn] of [['send', send], ['verify', verify], ['assess', assess]] as const) {
  const noOrigin = await fn(req('/x', { email: 'a@x.io' }, ''));
  const evil = await fn(req('/x', { email: 'a@x.io' }, 'https://evil.example'));
  const pre = await fn(req('/x', {}, ALLOWED, 'OPTIONS'));
  const pre2 = await fn(req('/x', {}, '', 'OPTIONS'));
  check(`${name}: no Origin -> 403`, noOrigin.status === 403);
  check(`${name}: evil Origin -> 403`, evil.status === 403);
  check(`${name}: OPTIONS allowed-origin -> 200`, pre.status === 200);
  check(`${name}: OPTIONS no Origin -> ok (no gate)`, pre2.status === 200);
}

console.log('B. Happy path with mocked email provider');
resetDb();
const rB = await send(req('/send', { email: 'Good@Example.COM' }));
check('send -> 200', rB.status === 200, `got ${rB.status}`);
const stored = codesFor('good@example.com')[0];
check('code stored normalized (lowercased)', !!stored, 'no row found');
check('code is 6 digits', /^\d{6}$/.test(stored?.code ?? ''));
const codeA = stored.code as string;
const rv = await verify(req('/verify', { email: 'Good@Example.COM', code: codeA }));
const verifiedBody = await rv.json();
check('verify correct code -> 200 verified', rv.status === 200 && verifiedBody.verified === true);
check('verification issues auth session', verifiedBody.session?.access_token === 'test-access-token');
check('profile uses auth user id, not verification code id', db.profiles[0]?.id === 'auth-user-1');
check('code marked used', db.verification_codes.filter((r) => r.email === 'good@example.com').every((r) => r.used));
const reUse = await verify(req('/verify', { email: 'a@x.io', code: codeA }));
check('cannot use someone else\'s code', reUse.status !== 200);

console.log('C. Send rate limit (max 3 codes / hour / email)');
resetDb();
await send(req('/send', { email: 'c@x.io' }));
await send(req('/send', { email: 'c@x.io' }));
await send(req('/send', { email: 'c@x.io' }));
const c4 = await send(req('/send', { email: 'c@x.io' }));
check('4th send within hour -> 429', c4.status === 429, `got ${c4.status}`);
const cEmail = await send(req('/send', { email: 'C@X.io' }));
check('case-normalized emails share the quota (4th, same inbox) -> 429', cEmail.status === 429, `got ${cEmail.status}`);

console.log('D. Correct code accepted even while under attack');
resetDb();
await send(req('/send', { email: 'd@x.io' }));
const codeD = codesFor('d@x.io')[0].code as string;
for (let i = 0; i < 3; i++) {
  const r = await verify(req('/verify', { email: 'd@x.io', code: '000000' }));
  check(`attack guess ${i + 1} -> 400`, r.status === 400);
}
const dOk = await verify(req('/verify', { email: 'd@x.io', code: codeD }));
check('correct code accepted after 3 failed guesses -> 200', dOk.status === 200, `got ${dOk.status}`);
check('code cannot be replayed after use', (await verify(req('/verify', { email: 'd@x.io', code: codeD }))).status !== 200);

console.log('E. Brute-force lockout (10 fails / 15 min, silent)');
resetDb();
await send(req('/send', { email: 'e@x.io' }));
const codeE = codesFor('e@x.io')[0].code as string;
for (let i = 0; i < 10; i++) {
  const r = await verify(req('/verify', { email: 'e@x.io', code: '000000' }));
  if (r.status !== 400) check(`guess ${i + 1} -> 400`, false, `got ${r.status}`);
}
check('10 guesses -> all 400 (silent, no lock yet)', true);
const attempts = db.verification_codes.filter((r) => r.email?.startsWith('attempt:e@x.io'));
check('10 attempt rows recorded', attempts.length === 10, `got ${attempts.length}`);
const e11 = await verify(req('/verify', { email: 'e@x.io', code: '000000' }));
check('11th bad guess -> 429 (locked)', e11.status === 429, `got ${e11.status}`);
const lockedNoLeak = (await e11.json()).error;
check('429 message reveals nothing about codes', typeof lockedNoLeak === 'string' && !/\d{6}/.test(lockedNoLeak));
const attemptsAfter = db.verification_codes.filter((r) => r.email?.startsWith('attempt:e@x.io')).length;
check('locked state: no new attempt rows are written', attemptsAfter === 10, `got ${attemptsAfter}`);
const eOk = await verify(req('/verify', { email: 'e@x.io', code: codeE }));
check('REAL user with CORRECT code still verified while locked', eOk.status === 200, `got ${eOk.status}`);

console.log('F. Escalating ban in send-verification (20+ fails / hour)');
resetDb();
for (let i = 0; i < 21; i++) {
  insertRow('verification_codes', {
    email: 'attempt:' + 'f@x.io',
    code: 'attempt',
    expires_at: new Date(Date.now() - 1000).toISOString(),
  });
}
const f1 = await send(req('/send', { email: 'f@x.io' }));
check('blocked email -> 429', f1.status === 429, `got ${f1.status}`);
check('no code row created for blocked email', codesFor('f@x.io').length === 0);
const fMsg = (await f1.json()).error;
check('block message honest about cause', /blocked/i.test(fMsg));
const fOther = await send(req('/send', { email: 'f2@x.io' }));
check('other inboxes unaffected by one attacker', fOther.status === 200, `got ${fOther.status}`);

console.log('G. Email path: code actually sent (Resend), integrated end-to-end');
resetDb();
Deno.env.set('RESEND_API_KEY', 're_test_key');
const outbound: Array<{ url: string; to: string[] | undefined; body: string }> = [];
const realFetch = globalThis.fetch;
globalThis.fetch = (async (input: Request | URL | string, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input instanceof Request ? input.url : input.toString();
  if (url.startsWith('https://api.resend.com/emails')) {
    const body = init?.body as string;
    outbound.push({ url, to: JSON.parse(body).to, body });
    return new Response(JSON.stringify({ id: 'email-1' }), { status: 200, headers: { 'content-type': 'application/json' } });
  }
  return realFetch(input as never, init);
}) as typeof fetch;
const gSend = await send(req('/send', { email: 'g@x.io' }));
check('send -> 200', gSend.status === 200, `got ${gSend.status}`);
check('code row stored for g@x.io', codesFor('g@x.io').length === 1);
const sentEmail = outbound[outbound.length - 1];
check('Resend call happened', !!sentEmail, 'no outbound captured');
check('sent to the right address', JSON.stringify(sentEmail?.to) === '["g@x.io"]');
const emailCode = codesFor('g@x.io')[0].code as string;
check('email body contains the SAME code stored in db', sentEmail?.body.includes(emailCode), `expected ${emailCode}`);
check('email from address is purpleDrop security', sentEmail?.body.includes('security@purpledrop.com'));
check('email says expires in 10 minutes', /expires in 10 minutes/i.test(sentEmail?.body ?? ''));
const gVerify = await verify(req('/verify', { email: 'g@x.io', code: emailCode }));
check('full loop: emailed code verifies', gVerify.status === 200, `got ${gVerify.status}`);
globalThis.fetch = realFetch;
Deno.env.delete('RESEND_API_KEY');

console.log('G2. Email delivery failures do not claim success');
resetDb();
const missingKey = await send(req('/send', { email: 'missing@x.io' }));
check('missing email provider -> 503', missingKey.status === 503);
check('missing provider does not store a code', codesFor('missing@x.io').length === 0);
Deno.env.set('RESEND_API_KEY', 're_fake');
globalThis.fetch = (async () => new Response('rejected', { status: 403 })) as typeof fetch;
const rejected = await send(req('/send', { email: 'reject@x.io' }));
check('rejected email -> 502', rejected.status === 502);
check('undelivered code cannot be used', codesFor('reject@x.io').length === 0);
globalThis.fetch = originalFetch;

console.log('H. Assessment function');
{
  resetDb();
  const a401 = await assess(req('/assess', { answers: { Q1: 'yes' } }, ALLOWED, 'POST'));
  check('no Authorization -> 401', a401.status === 401, `got ${a401.status}`);
  const aHelp = await assess(req('/assess', { answers: { Q1: 'yes' } }, ALLOWED, 'POST', { Authorization: 'Bearer test-token' }));
  check('authorized POST happy path -> 200', aHelp.status === 200, `got ${aHelp.status} ${(await aHelp.json()).error ?? ''}`);
  check('session saved', db.assessment_sessions.length === 1);
  const aNoAnswers = await assess(req('/assess', {}, ALLOWED, 'POST', { Authorization: 'Bearer t' }));
  check('answers required -> 400', aNoAnswers.status === 400);
  const aBadStatus = await assess(req('/assess', { answers: { Q1: 'yes' }, status: 'zzz' }, ALLOWED, 'POST', { Authorization: 'Bearer t' }));
  check('invalid status -> 400', aBadStatus.status === 400, `got ${aBadStatus.status}`);
  const aGood = await assess(req('/assess', { answers: { Q1: 'yes', Q2: 'no' }, status: 'completed' }, ALLOWED, 'POST', { Authorization: 'Bearer t' }));
  check('completed status accepted -> 200', aGood.status === 200, `got ${aGood.status}`);
  check('lead signal stored for a "no" answer', db.lead_signals.some((l) => l.answer === 'no'));
}

console.log(`\n=== RESULT: ${pass} passed, ${fail} failed ===`);
Deno.exit(fail === 0 ? 0 : 1);
