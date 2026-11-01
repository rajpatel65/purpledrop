import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';
import { ROUTE_SEO } from '../lib/route-seo';
import { Layout } from '../components/Layout';
import { Breadcrumbs } from '../components/Breadcrumbs';

const SECTIONS = [
  {
    title: 'Who this covers',
    body: 'This policy covers purpledrop.com and every service provided by purpleDrop. It applies to anyone who visits the site, sends us an enquiry, or works with us. It\'s a real statement of what we do — written to be read, not to be waived.',
  },
  {
    title: 'What we collect',
    body: 'The contact form: the name, email address, company and message you choose to send. The correspondence we exchange afterwards. Aggregate analytics (below). And technical data from the server that hosts the site — such as your IP address and browser type — which is logged briefly and automatically by the hosting provider. We don\'t collect anything else, and we never buy or scrape contact details.',
  },
  {
    title: 'How we use it — and the law',
    body: 'To respond to your enquiry. To provide the services we\'ve agreed to deliver. To send you information you\'ve asked for or agreed to receive. To keep the site working and secure. And to comply with legal obligations. We don\'t sell or rent personal data. Ever. We don\'t share it for advertising, and we don\'t use it to build a profile of you.',
  },
  {
    title: 'Email marketing',
    body: 'We send marketing email only where the law allows — in the US, under the CAN-SPAM Act. Every marketing message has a clear, working unsubscribe, which we honour as fast as we can and no later than the 10 business days the law allows. Replies to your enquiry and updates about work you\'ve agreed to aren\'t marketing and are sent regardless. If you\'re in a state with additional privacy rights, we respect those too.',
  },
  {
    title: 'Analytics & cookies',
    body: 'We don\'t use analytics tools, advertising scripts, or marketing trackers of any kind. No third party collects information about your activity across different websites while you\'re on ours. The server logs technical data (IP address, browser type) briefly and automatically, then discards it.',
  },
  {
    title: 'Third parties',
    body: 'We share personal data only with a small number of processors who work on our behalf: Formspree (which receives contact form submissions), our web hosting provider (which serves the site and logs traffic briefly), and our email provider (which delivers messages). Each is bound by a data processing agreement to use your data only on our instructions, keep it secure, and never sell it. We share for no other purpose and with no one else.',
  },
  {
    title: 'Where it\'s stored',
    body: 'Form submissions are handled by Formspree and stored on their secure infrastructure in the US under a data processing agreement with appropriate safeguards. We don\'t store contact details on our own servers.',
  },
  {
    title: 'How long we keep it',
    body: 'Contact form submissions are kept only as long as needed to deal with your enquiry — typically no more than 30 days — then deleted or anonymised. If we work with you, we keep correspondence and records for the duration of the engagement and afterwards only as long as the law requires (in the US, generally six years for tax and accounting records). Analytics data is aggregate and isn\'t tied to you at all.',
  },
  {
    title: 'Your rights',
    body: 'Depending on where you live, state law (including the CCPA/CPRA in California and similar laws elsewhere) may give you rights to access, correct, delete, or receive a copy of your personal data, and to opt out of any sale or sharing of it. All of it is free, and we respond within 30 days — usually much sooner. Email privacy@purpledrop.com and we\'ll help. We never sell personal information, so there\'s no opt-out to ask you for in the first place.',
  },
  {
    title: 'Children',
    body: 'We don\'t knowingly collect personal information from anyone under 16. This is a business service. If you believe a child has sent us information, email privacy@purpledrop.com and we\'ll delete it.',
  },
  {
    title: 'Security',
    body: 'The site is served over HTTPS. Our guiding rule is to collect as little as possible — that\'s the strongest security measure of all. The processors we use keep data encrypted in transit, and we never hold more than we need.',
  },
  {
    title: 'Changes',
    body: 'If this policy changes materially, we\'ll update this page and note the date. We won\'t use your data in a way that\'s materially different from what\'s described here without telling you and, where the law requires, getting fresh consent.',
  },
];

export function PrivacyPage() {
  useSeo(ROUTE_SEO['/privacy']);

  return (
    <Layout>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Privacy' }]} />
      <section className="border-b border-line bg-paper py-24">
        <div className="container-page max-w-3xl">
          <p className="eyebrow">Privacy</p>
          <h1 className="mt-5 font-serif text-5xl font-medium leading-[1.05] tracking-tight text-ink">
            We collect almost nothing. Here's the full list.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            Last updated: August 2026. This page is written to be read, not to be waived.
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
            Questions? Email{' '}
            <a href="mailto:privacy@purpledrop.com" className="font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
              privacy@purpledrop.com
            </a>{' '}
            — or read our{' '}
            <Link to="/terms" className="font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
              terms
            </Link>
            .
          </p>
        </div>
      </section>
    </Layout>
  );
}
