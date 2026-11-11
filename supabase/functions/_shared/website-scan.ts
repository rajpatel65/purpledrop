export type Finding = { title: string; status: 'pass' | 'review' | 'unknown'; evidence: string[]; action: string };
export type Report = { domain: string; scannedAt: string; finalUrl: string; checks: Finding[] };

export function normalizeDomain(input: string): string {
  const url = new URL(input.includes('://') ? input : `https://${input}`);
  const host = url.hostname.toLowerCase().replace(/\.$/, '');
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.port ||
    host.length > 253 || !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(host) ||
    /\.(local|localhost|internal|test|invalid|example|onion|arpa)$/.test(host)) throw new Error('Enter a public website domain, without a port or login.');
  return host;
}

// Accept only globally routable addresses; reject all IPv6 special-use ranges
// by admitting only global-unicast 2000::/3 (and excluding documentation).
export function publicIP(ip: string): boolean {
  if (ip.includes(':')) return /^[23][0-9a-f]{0,3}:/i.test(ip) && !/^2001:(db8|0*0|0*2|1[0-9a-f]|2[0-9a-f]):/i.test(ip) && !/^2002:/i.test(ip);
  const p = ip.split('.').map(Number);
  if (p.length !== 4 || p.some(x => !Number.isInteger(x) || x < 0 || x > 255)) return false;
  const [a,b,c] = p;
  return !(a === 0 || a === 10 || a === 127 || a >= 224 || (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && (b === 168 || b === 0 || (b === 2))) ||
    (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) || (a === 203 && b === 0 && c === 113));
}

type DNS = { ok: boolean; records: string[] };
export async function dns(name: string, type: string): Promise<DNS> {
  try {
    const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`, {
      headers: { accept: 'application/dns-json' }, signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { ok: false, records: [] };
    const data = await res.json();
    const codes: Record<string, number> = { A: 1, AAAA: 28, TXT: 16, MX: 15, CAA: 257 };
    return { ok: data.Status === 0 || data.Status === 3, records: (data.Answer || []).filter((r: {type: number}) => r.type === codes[type]).map((r: {data: string}) => r.data) };
  } catch { return { ok: false, records: [] }; }
}

async function assertPublic(host: string) {
  normalizeDomain(host);
  // Validate both the public resolver and the runtime resolver before every hop.
  const [a, aaaa, system] = await Promise.all([dns(host, 'A'), dns(host, 'AAAA'),
    Promise.all([Deno.resolveDns(host, 'A').catch(() => []), Deno.resolveDns(host, 'AAAA').catch(() => [])]).then(x => x.flat())]);
  const ips = [...a.records, ...aaaa.records, ...system];
  if (!ips.length || ips.some(ip => !publicIP(ip))) throw new Error('Website did not resolve exclusively to public addresses.');
}

type Page = { url: string; status: number; headers: Headers; body: string; redirected: boolean };
async function publicFetch(input: string): Promise<Page> {
  let url = new URL(input);
  for (let hop = 0; hop < 6; hop++) {
    if (!['https:', 'http:'].includes(url.protocol) || url.port || url.username || url.password) throw new Error('Unsafe redirect destination.');
    await assertPublic(url.hostname);
    const res = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'PurpleDrop-Scorecard/1.0 (+https://purpledrop.com/scorecard)' }, signal: AbortSignal.timeout(7000) });
    if ([301,302,303,307,308].includes(res.status) && res.headers.has('location')) {
      await res.body?.cancel();
      url = new URL(res.headers.get('location')!, url);
      continue;
    }
    // Read only the first 256 KiB. This is a homepage response check, not a crawl.
    let body = ''; let bytes = 0;
    const reader = res.body?.getReader();
    if (reader) {
      const decoder = new TextDecoder();
      try { while (bytes < 262144) { const chunk = await reader.read(); if (chunk.done) break; bytes += chunk.value.length; body += decoder.decode(chunk.value.slice(0, Math.max(0, 262144 - (bytes - chunk.value.length))), { stream: true }); } }
      finally { await reader.cancel().catch(() => {}); }
    }
    return { url: url.href, status: res.status, headers: res.headers, body, redirected: hop > 0 };
  }
  throw new Error('Too many redirects.');
}

export async function scanWebsite(domain: string): Promise<Report> {
  domain = normalizeDomain(domain);
  const emailDomain = domain.startsWith('www.') ? domain.slice(4) : domain;
  const [httpsResult, httpResult, txt, dmarc, mx, caa] = await Promise.all([
    publicFetch(`https://${domain}`).then(value => ({ value, error: '' })).catch(() => ({ value: null, error: 'HTTPS request could not be completed with normal certificate validation.' })),
    publicFetch(`http://${domain}`).catch(() => null), dns(emailDomain, 'TXT'), dns(`_dmarc.${emailDomain}`, 'TXT'), dns(emailDomain, 'MX'), dns(domain, 'CAA'),
  ]);
  const page = httpsResult.value;
  const usable = !!page && page.url.startsWith('https:') && page.status >= 200 && page.status < 400;
  const checks: Finding[] = [];
  checks.push({ title: 'SSL/TLS certificate', status: usable ? 'pass' : 'unknown', evidence: page ? [`HTTPS request returned HTTP ${page.status}.`, `Final URL: ${page.url}`, 'Certificate trust and hostname were checked by the HTTPS client. Expiry date, TLS versions and cipher configuration were not inspected.'] : [httpsResult.error], action: usable ? 'Keep certificate auto-renewal enabled. Check expiry and TLS configuration separately.' : 'Check the site in a browser and inspect the certificate. A bot block or network timeout can also prevent this check.' });
  const headerNames = ['Content-Security-Policy', 'Strict-Transport-Security', 'X-Frame-Options', 'X-Content-Type-Options', 'Permissions-Policy'];
  const missing = page ? headerNames.filter(h => !page.headers.has(h)) : [];
  checks.push({ title: 'Security headers', status: !usable ? 'unknown' : missing.length ? 'review' : 'pass', evidence: !page ? ['No HTTPS response available.'] : headerNames.map(h => `${h}: ${(page.headers.get(h) || 'not observed').slice(0, 250)}`), action: 'Review header values with your developer. Presence alone does not prove a safe policy. CSP frame-ancestors can replace X-Frame-Options; not every site needs every header.' });
  const spf = txt.records.filter(r => /v=spf1/i.test(r));
  const dm = dmarc.records.filter(r => /v=DMARC1/i.test(r));
  checks.push({ title: 'Email authentication', status: !txt.ok || !dmarc.ok ? 'unknown' : 'review', evidence: [`Email records queried for ${emailDomain}.`, `SPF: ${spf.join('; ').slice(0, 450) || (txt.ok ? 'not observed' : 'DNS lookup failed')}`, `DMARC: ${dm.join('; ').slice(0, 450) || (dmarc.ok ? 'not observed' : 'DNS lookup failed')}`, 'DKIM: unverified. A selector from a real sent email is required; guessing selectors cannot prove DKIM is missing.'], action: 'Check SPF against the services you send from. Verify DKIM on a real message and review DMARC alignment and policy before moving to enforcement. DNS records alone do not prove deliverability.' });
  const cookies = page ? (page.headers.getSetCookie ? page.headers.getSetCookie() : [page.headers.get('set-cookie')].filter(Boolean) as string[]) : [];
  const weak = cookies.filter(c => !/;\s*secure(?:;|$)/i.test(c) || !/;\s*httponly(?:;|$)/i.test(c) || !/;\s*samesite=(lax|strict|none)(?:;|$)/i.test(c));
  checks.push({ title: 'Cookie security', status: !usable ? 'unknown' : weak.length ? 'review' : cookies.length ? 'pass' : 'unknown', evidence: !cookies.length ? ['No Set-Cookie header observed on the initial homepage response. JavaScript, login and consent-triggered cookies were not tested.'] : cookies.slice(0, 12).map(c => { const name = c.split('=')[0].slice(0,60); return `${name}: Secure ${/;\s*secure(?:;|$)/i.test(c) ? 'yes' : 'not observed'}; HttpOnly ${/;\s*httponly(?:;|$)/i.test(c) ? 'yes' : 'not observed'}; SameSite ${c.match(/;\s*samesite=([^;]+)/i)?.[1] || 'not observed'}`; }), action: 'Review session cookies first. JavaScript-readable preference cookies may intentionally omit HttpOnly. Cookie values are never included in this report.' });
  const insecure = [...new Set((page?.body.match(/(?:src|href)\s*=\s*["']http:\/\/[^"'\s>]+/gi) || []).map(x => x.replace(/^[^=]+=\s*["']/, '')))].slice(0, 8);
  const redirectOK = httpResult?.url.startsWith('https:') && httpResult.redirected;
  checks.push({ title: 'HTTPS enforcement', status: !httpResult ? 'unknown' : !redirectOK || insecure.length ? 'review' : 'pass', evidence: [httpResult ? `HTTP entry ended at ${httpResult.url} (HTTP ${httpResult.status}).` : 'HTTP request could not be completed.', ...insecure.map(u => `HTTP reference in homepage HTML: ${u}`), 'Static HTML only. HTTP links are review candidates, not automatically mixed content; scripts and styles need priority. Runtime resources were not loaded.'], action: 'Redirect HTTP to HTTPS and inspect insecure resource URLs. Use browser developer tools to confirm mixed-content requests, including resources loaded by scripts.' });
  checks.push({ title: 'DNS configuration', status: !mx.ok || !txt.ok || !caa.ok ? 'unknown' : !mx.records.length || !caa.records.length ? 'review' : 'pass', evidence: [`MX (${emailDomain}): ${mx.records.join('; ').slice(0,450) || (mx.ok ? 'not observed' : 'lookup failed')}`, `TXT: ${txt.ok ? `${txt.records.length} record(s) observed` : 'lookup failed'}`, `CAA: ${caa.records.join('; ').slice(0,450) || (caa.ok ? 'not observed' : 'lookup failed')}`], action: 'Confirm mail routing matches your provider. CAA is optional; its absence is not a vulnerability. Non-mail domains may not need MX. This check does not audit all DNS or DNSSEC.' });
  return { domain, scannedAt: new Date().toISOString(), finalUrl: page?.url || `https://${domain}`, checks };
}
