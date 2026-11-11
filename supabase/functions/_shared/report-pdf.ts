import { PDFDocument, StandardFonts, rgb } from 'npm:pdf-lib@1.17.1';
import type { Report } from './website-scan.ts';

// Shared by the public scorecard and local audit. No remote fonts or assets.
export async function renderScorecard(report: Report): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`purpleDrop Security Scorecard - ${report.domain}`);
  pdf.setAuthor('purpleDrop');
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const ink = rgb(0.10,0.09,0.08), purple = rgb(0.43,0.16,0.85), muted = rgb(0.36,0.34,0.30);
  const clean = (text: string) => text.replace(/[^\x20-\x7E\n]/g, '?');
  let page = pdf.addPage([595.28,841.89]); let y = 0;
  const text = (value: string, size = 10, font = regular, color = ink, gap = 5) => {
    const words = clean(value).split(/\s+/).flatMap(word => { const parts: string[] = []; let part = ''; for (const char of word) { if (font.widthOfTextAtSize(part + char, size) > 480) { parts.push(part); part = ''; } part += char; } if (part) parts.push(part); return parts; }); let line = '';
    for (const word of words) {
      const proposed = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(proposed, size) > 495 && line) {
        page.drawText(line,{x:50,y,size,font,color}); y -= size + gap; line = word;
      } else line = proposed;
    }
    if (line) { page.drawText(line,{x:50,y,size,font,color}); y -= size + gap; }
  };
  const start = (number: number, label: string) => {
    page.drawRectangle({x:0,y:0,width:595.28,height:841.89,color:rgb(0.98,0.965,0.937)});
    page.drawText('purpleDrop',{x:50,y:787,size:23,font:bold,color:purple});
    page.drawText('SECURITY SCORECARD',{x:360,y:792,size:10,font:bold,color:muted});
    page.drawLine({start:{x:50,y:765},end:{x:545,y:765},thickness:1,color:rgb(0.87,0.84,0.80)});
    page.drawText(`purpledrop.com  |  info@purpledrop.com`,{x:50,y:33,size:9,font:regular,color:muted});
    page.drawText(`${number} / 4`,{x:513,y:33,size:9,font:regular,color:muted});
    y = 731; text(label,12,bold,purple); y -= 12;
  };
  start(1,'ONE-TIME PUBLIC WEBSITE CHECK');
  text(report.domain,30,serif); y -= 5;
  text(`Checked ${report.scannedAt.replace('T',' ').replace(/\.\d+Z$/,' UTC')}`,10,regular,muted);
  text(`Homepage: ${report.finalUrl}`,10,regular,muted); y -= 22;
  text('Know what needs a closer look.',24,serif); y -= 5;
  text('Six checks of the public homepage response and DNS. These findings are a starting point for a developer review, not a security certification.',12,regular,muted); y -= 22;
  for (const check of report.checks) {
    text(`${check.status === 'pass' ? 'OBSERVED' : check.status === 'review' ? 'REVIEW' : 'UNVERIFIED'}  |  ${check.title}`,12,bold,check.status === 'pass' ? ink : purple); y -= 10;
  }
  y -= 8;
  text('How to read this report',14,bold); y -= 3;
  text('OBSERVED: the tested condition was seen in this response. REVIEW: a setting or record needs context before deciding whether to change it. UNVERIFIED: the check was incomplete or needs information this scan cannot collect.',10,regular,muted);
  y -= 15;
  text('Important limits',14,bold); y -= 3;
  text('No login, port scan, exploitation or full-site crawl. Bot protection, redirects, geography and temporary DNS or network errors can affect results. No credentials or cookie values are collected. An automated security check does not measure AI recommendations or ranking.',10,regular,muted);
  for (let i = 0; i < 3; i++) {
    page = pdf.addPage([595.28,841.89]); start(i+2,`FINDINGS ${i*2+1}-${i*2+2}`);
    for (const check of report.checks.slice(i*2,i*2+2)) {
      text(check.title,23,serif); y -= 4;
      text(check.status === 'pass' ? 'OBSERVED' : check.status === 'review' ? 'REVIEW' : 'UNVERIFIED',10,bold,purple); y -= 10;
      for (const evidence of check.evidence) { text(evidence,10,regular,muted,4); y -= 5; }
      y -= 4; text('Next step',11,bold); text(check.action,10,regular,ink,4); y -= 30;
    }
    if (y < 60) throw new Error('Report exceeded page layout bounds');
  }
  return pdf.save();
}
