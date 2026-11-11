import { scanWebsite } from '../supabase/functions/_shared/website-scan.ts';
import { renderScorecard } from '../supabase/functions/_shared/report-pdf.ts';
const report = await scanWebsite(Deno.args[0] || 'purpledrop.com');
console.log(JSON.stringify(report,null,2));
await Deno.writeFile('/tmp/purpledrop-scorecard-preview.pdf', await renderScorecard(report));
