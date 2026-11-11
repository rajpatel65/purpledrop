import { normalizeDomain, scanWebsite } from './website-scan.ts';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const digest = async (value: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))).map(x => x.toString(16).padStart(2,'0')).join('');
const reply = (data: unknown, status: number, headers: Record<string,string>) => new Response(JSON.stringify(data), {status,headers:{...headers,'Content-Type':'application/json','Cache-Control':'no-store, private','Pragma':'no-cache'}});
async function db(path: string, data?: unknown, method = 'POST') {
 const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
 const res = await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/${path}`, {method,headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'return=representation'},...(data ? {body:JSON.stringify(data)} : {}),signal:AbortSignal.timeout(8000)});
 if (!res.ok) throw new Error('Database unavailable');
 const text = await res.text(); return text ? JSON.parse(text) : null;
}
async function limit(keys: string[], caps: number[], windows: number[]) {
 const now = Date.now();
 const result = await db('rpc/claim_scorecard_scan',{keys:keys.map((key,i)=>`${key}:${Math.floor(now/windows[i])}`),caps,expiry:windows.map(ms=>new Date((Math.floor(now/ms)+1)*ms).toISOString())});
 return result === true;
}
async function mail(payload: unknown) {
 const res = await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${Deno.env.get('RESEND_API_KEY')}`,'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});
 if (!res.ok) throw new Error('Email delivery failed');
}
export async function scorecardFlow(req: Request, body: Record<string,unknown>, cors: Record<string,string>, action: 'request'|'verify'|'scan') {
 const ip = await digest((req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim());
 const hour = 3600000, day = 86400000;
 if (action === 'request') {
   const email = String(body.email || '').trim().toLowerCase();
   if (email.length > 254 || !EMAIL.test(email) || body.consent !== true) return reply({error:'A valid email and scan consent are required.'},400,cors);
   let domain: string; try {domain=normalizeDomain(String(body.domain || ''));} catch {return reply({error:'Enter a valid public website domain.'},400,cors);}
   const emailHash=await digest(email);
   // A three-failure challenge blocks both email and source IP for 15 minutes,
   // including a fresh code request. Atomic verification prevents parallel guesses.
   const blocked=await db('rpc/scorecard_is_blocked',{address:email,source_ip:ip});
   if (blocked === true) return reply({error:'Three failed attempts. Wait 15 minutes before trying again.'},429,cors);
   if (!await limit([`bot-ip:${ip}`,'bot-global'],[20,1000],[hour,day])) return reply({error:'Too many requests. Please try again later.'},429,cors);
   const turnstileSecret=Deno.env.get('TURNSTILE_SECRET_KEY');
   if (turnstileSecret) {
     if (typeof body.turnstile_token !== 'string' || body.turnstile_token.length > 2048) return reply({error:'Complete the bot check before requesting a code.'},403,cors);
     const check=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:turnstileSecret,response:body.turnstile_token}),signal:AbortSignal.timeout(8000)});
     const verdict=await check.json();
     if(!check.ok || !verdict.success || verdict.action!=='scorecard' || !['purpledrop.com','www.purpledrop.com','purpledrop.pages.dev','purpledrop-newsite.pages.dev','localhost'].includes(verdict.hostname)) return reply({error:'Bot check failed or expired. Please try again.'},403,cors);
   }
   if (!await limit([`code-email:${emailHash}`,`code-ip:${ip}`,'code-global'],[3,5,50],[hour,hour,day])) return reply({error:'Too many code requests. Please try again later.'},429,cors);
   const id=crypto.randomUUID(); const random=new Uint32Array(1); do {crypto.getRandomValues(random);} while(random[0]>=4294800000);
   const code=String(100000+random[0]%900000);
   await db('scorecard_challenges',{id,email,domain,ip_hash:ip,code_hash:await digest(`${id}:${code}`),expires_at:new Date(Date.now()+600000).toISOString()});
   try {await mail({from:'purpleDrop Security <security@purpledrop.com>',to:[email],subject:'Your purpleDrop verification code',text:`Your purpleDrop verification code is ${code}. It expires in 10 minutes. Three incorrect attempts will temporarily block verification. If you did not request this, ignore this email.`});}
   catch {await db(`scorecard_challenges?id=eq.${id}`,undefined,'DELETE'); return reply({error:'Could not send the code. Please try again later.'},502,cors);}
   // Clean up day-old challenges on the next code request; no results are stored.
   await db(`scorecard_challenges?created_at=lt.${encodeURIComponent(new Date(Date.now()-day).toISOString())}`,undefined,'DELETE').catch(()=>{});
   return reply({success:true,challenge_id:id,expires_in:600},200,cors);
 }
 const id=String(body.challenge_id || '');
 if (!UUID.test(id)) return reply({error:'Request a new verification code.'},400,cors);
 if (action === 'verify') {
   if (!await limit([`verify-ip:${ip}`,'verify-global'],[30,500],[900000,day])) return reply({error:'Too many verification requests. Please try later.'},429,cors);
   // Count every provided guess, including malformed ones, against the challenge.
   const code=String(body.code || '').slice(0,20);
   const token=crypto.randomUUID()+crypto.randomUUID();
   const result=await db('rpc/verify_scorecard_challenge',{challenge:id,candidate:await digest(`${id}:${code}`),token:await digest(token),source_ip:ip});
   if (result!=='verified') return reply({error:result==='blocked'?'Three failed attempts. Wait 15 minutes before trying again.':result==='invalid'?'Incorrect code. Try again.':'Code expired or already used. Request a new code.',blocked:result==='blocked'},result==='blocked'?429:400,cors);
   return reply({success:true,scan_token:token,expires_in:600},200,cors);
 }
 const token=String(body.scan_token || '');
 if (token.length !== 72) return reply({error:'A fresh verified check is required.'},401,cors);
 const source=await db('rpc/consume_scorecard_token',{challenge:id,token:await digest(token),source_ip:ip});
 if (!source) return reply({error:'This check was used or expired. Request a fresh code and rerun.'},401,cors);
 if (!await limit([`scan-email:${await digest(source.email)}`,`scan-domain:${await digest(source.domain)}`,`scan-ip:${ip}`,'scan-global'],[3,5,10,100],[day,hour,hour,day])) return reply({error:'Scan limit reached. Please try again later.'},429,cors);
 const report=await scanWebsite(source.domain);
 // Lead capture is separate from the results response; no report is emailed.
 // Failure is surfaced in logs, not represented as a failed technical scan.
 try {await mail({from:'purpleDrop Leads <security@purpledrop.com>',to:['rpatel7@gmail.com'],reply_to:source.email,subject:`[purpleDrop] Security Scorecard request: ${source.domain}`,text:`Verified scorecard lead\nDomain: ${source.domain}\nEmail: ${source.email}\nConsent: true\nChecked: ${report.scannedAt}`});}
 catch {console.error('Scorecard lead notification failed'); return reply({error:'The check ran but lead delivery failed. Please contact info@purpledrop.com.'},502,cors);}
 return reply({success:true,report,expires_at:new Date(Date.now()+600000).toISOString()},200,cors);
}
