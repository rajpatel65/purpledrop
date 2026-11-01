export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // Escape characters that could terminate the <script> tag or break the JSON
  // early, so the schema stays inert JSON-LD even if the data ever becomes
  // dynamic (e.g. CMS-fed content) — prevents JSON/script-context injection.
  const safeJson = JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}
