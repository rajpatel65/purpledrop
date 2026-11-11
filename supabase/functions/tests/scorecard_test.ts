import { normalizeDomain, publicIP } from '../_shared/website-scan.ts';
import { scorecardFlow } from '../_shared/scorecard-flow.ts';
const assert = (ok: unknown, label: string) => { if (!ok) throw new Error(label); };
Deno.test('normalizes public domains and rejects local/credential/port URLs', () => {
  assert(normalizeDomain('HTTPS://WWW.Example.com/path') === 'www.example.com', 'normalize');
  for (const value of ['localhost','127.0.0.1','http://2130706433','http://[::1]','https://user:pass@example.com','example.com:8080','file:///etc/passwd','metadata.google.internal','bad..com','-bad.com']) {
    let rejected = false; try { normalizeDomain(value); } catch { rejected = true; } assert(rejected,value);
  }
});
Deno.test('excludes private, reserved, metadata and mapped IP addresses', () => {
  for (const ip of ['0.0.0.0','10.1.2.3','127.0.0.1','169.254.169.254','172.16.2.1','192.168.0.1','100.100.100.200','198.18.1.1','224.1.2.3','::1','::ffff:127.0.0.1','fc00::1','fe80::1','2001:db8::1','2002:7f00::']) assert(!publicIP(ip),ip);
  for (const ip of ['1.1.1.1','8.8.8.8','104.21.10.12','2606:4700::1111']) assert(publicIP(ip),ip);
});
Deno.test('scorecard refuses missing consent and malformed tokens without outbound work', async () => {
 let calls=0; const original=globalThis.fetch; globalThis.fetch=(()=>{calls++;throw new Error('must not fetch');}) as typeof fetch;
 try {
  const req=new Request('https://test.test',{method:'POST',headers:{'x-forwarded-for':'1.1.1.1'}});
  assert((await scorecardFlow(req,{email:'a@b.com',domain:'example.com'}, {}, 'request')).status===400,'consent');
  assert((await scorecardFlow(req,{challenge_id:'bad'}, {}, 'verify')).status===400,'challenge');
  assert((await scorecardFlow(req,{challenge_id:crypto.randomUUID(),scan_token:'bad'}, {}, 'scan')).status===401,'token');
  assert(calls===0,'no work');
 }finally {globalThis.fetch=original;}
});
Deno.test('results responses cannot be retrieved with invalid or consumed tokens', async()=>{
 const original=globalThis.fetch; globalThis.fetch=(()=>Promise.resolve(new Response('null',{status:200}))) as typeof fetch;
 try {const res=await scorecardFlow(new Request('https://test.test'),{challenge_id:crypto.randomUUID(),scan_token:crypto.randomUUID()+crypto.randomUUID()},{},'scan');assert(res.status===401,'reject');assert(res.headers.get('Cache-Control')?.includes('no-store'),'no cache');}
 finally{globalThis.fetch=original;}
});
Deno.test('bounded HTTP parser preserves headers and handles chunked HTML', async () => {
 const {parseHttpResponse}=await import('../_shared/website-scan.ts');
 const res=parseHttpResponse(new TextEncoder().encode('HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nTransfer-Encoding: chunked\r\nSet-Cookie: a=secret; Secure\r\nSet-Cookie: b=secret; HttpOnly\r\n\r\n4\r\nWiki\r\n5\r\npedia\r\n0\r\n\r\n'));
 assert(res.status===200 && res.body==='Wikipedia','chunked');
 assert(res.headers.getSetCookie().length===2,'cookies');
 let rejected=false;try{parseHttpResponse(new TextEncoder().encode('not HTTP'));}catch{rejected=true;}assert(rejected,'bad headers');
});
