// Exercises the actual client module without network access or browser secrets.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
import ts from 'typescript';

async function client(env, response = {}) {
  const calls = [];
  const sessions = [];
  const storage = new Map();
  let source = readFileSync(new URL('../src/lib/soc2-api.ts', import.meta.url), 'utf8');
  source = source.replace(/^import .*;$/gm, '').replaceAll('import.meta.env', 'ENV');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  runInNewContext(js, {
    exports, ENV: { DEV: false, ...env },
    supabase: env.VITE_SUPABASE_URL ? { auth: {
      getSession: async () => ({ data: { session: null } }),
      setSession: async session => { sessions.push(session); return { error: null }; },
    } } : null,
    SOC2_SECTIONS: [{ id: 'cc1' }], SOC2_QUESTIONS: [],
    getQuestionsBySection: () => [], getOverallStats: () => ({}), getSectionProgress: () => ({}),
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) },
    fetch: async (url, options) => { calls.push({ url, ...options }); return { ok: true, json: async () => response }; },
    console, Date, Math,
  });
  return { api: exports.soc2Api, calls, sessions, storage };
}

const missing = await client({});
await assert.rejects(missing.api.sendVerificationCode('test@example.com'), /not configured/);
assert.equal(missing.calls.length, 0);
assert.equal(missing.storage.size, 0);
console.log('PASS missing production config never pretends to email a code');

const env = { VITE_SUPABASE_URL: 'https://test.supabase.co', VITE_SUPABASE_ANON_KEY: 'test-public-key' };
const send = await client(env);
await send.api.sendVerificationCode('test@example.com');
assert.equal(send.calls[0].url, 'https://test.supabase.co/functions/v1/send-verification');
assert.equal(send.calls[0].headers.apikey, 'test-public-key');
assert.equal(send.calls[0].headers.Authorization, undefined);
console.log('PASS derived functions URL and pre-login API headers');

const session = { access_token: 'test-access', refresh_token: 'test-refresh' };
const verify = await client(env, { success: true, session });
await verify.api.verifyCode('test@example.com', '123456');
assert.equal(verify.sessions.length, 1);
assert.equal(verify.sessions[0].access_token, session.access_token);
console.log('PASS verification saves the authenticated session');

const invalid = await client(env, { success: true });
await assert.rejects(invalid.api.verifyCode('test@example.com', '123456'), /did not create a session/);
console.log('PASS missing auth session is not treated as verification success');

const explicit = await client({ ...env, VITE_SUPABASE_FUNCTIONS_URL: 'https://test.supabase.co/functions/v1/' });
await explicit.api.sendVerificationCode('test@example.com');
assert.equal(explicit.calls[0].url, 'https://test.supabase.co/functions/v1/send-verification');
console.log('PASS explicit URL avoids duplicate slash');
