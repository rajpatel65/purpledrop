import { useSeo } from '../hooks/useSeo';
import { ROUTE_SEO } from '../lib/route-seo';
import { Layout } from '../components/Layout';
import { Breadcrumbs } from '../components/Breadcrumbs';

const SECTIONS = [
  {
    title: 'What we do',
    body: 'purpleDrop helps companies become more visible in AI-generated answers and recommendations. Our work is provided as a professional service, in good faith, based on publicly available information about your business and your industry.',
  },
  {
    title: 'What we don\'t do',
    body: 'We don\'t guarantee rankings or positions in any AI tool, search engine or directory. No ethical professional can. Anyone who does is selling certainty they don\'t have. Results depend on factors outside our control, including how AI systems decide what to recommend.',
  },
  {
    title: 'Engagements',
    body: 'Every engagement is governed by a written statement of work agreed in advance, with a fixed price. The price on the agreement is the price you pay.',
  },
  {
    title: 'Intellectual property',
    body: 'You own everything we produce for you, once paid for in full. We own the underlying methods and materials we develop, and we reuse none of your confidential information for other clients.',
  },
  {
    title: 'Confidentiality',
    body: 'What you tell us stays with us. We\'re happy to sign NDAs on request and we treat every engagement as confidential by default.',
  },
  {
    title: 'Liability',
    body: 'Our work is provided as-is. To the fullest extent permitted by law, purpleDrop\'s total liability under this agreement is limited to the fees paid for the services giving rise to the claim. Nothing in these terms limits liability that cannot be limited by law.',
  },
];

export function TermsPage() {
  useSeo(ROUTE_SEO['/terms']);

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Terms' }]} />
      <section className="border-b border-line bg-paper py-24">
        <div className="container-page max-w-3xl">
          <p className="eyebrow">Terms</p>
          <h1 className="mt-5 font-serif text-5xl font-medium leading-[1.05] tracking-tight text-ink">
            Straightforward terms for straightforward work.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            Last updated: March 2026. These terms are short on purpose. Full details of any
            engagement live in the written agreement.
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-paper py-20">
        <div className="container-page max-w-3xl space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="font-serif text-2xl font-medium tracking-tight text-ink">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{s.body}</p>
            </div>
          ))}
          <p className="pt-6 text-sm leading-relaxed text-ink-faint">
            Questions about these terms? Email{' '}
            <a href="mailto:info@purpledrop.com" className="font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
              info@purpledrop.com
            </a>
            .
          </p>
        </div>
      </section>
    </Layout>
  );
}
