import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';
import { ROUTE_SEO } from '../lib/route-seo';
import { Layout } from '../components/Layout';
import { Breadcrumbs } from '../components/Breadcrumbs';

const SECTIONS = [
  {
    "title": "What this policy covers",
    "body": "This policy covers purpledrop.com, enquiries and the tools on this website. It explains what information you provide and how the website uses it."
  },
  {
    "title": "Contact requests",
    "body": "The contact form sends the name, email, company, selected service and message you enter. Supabase processes the request and Resend delivers it to our business inbox. We use this information to respond and discuss any work you request. Do not include passwords, payment details or sensitive customer information."
  },
  {
    "title": "Website checks and verification",
    "body": "The Security Scorecard asks for a website address, email and permission to run a one-time public check. A verification email confirms access to that email address, not ownership of the website. Verification records and service logs are separate from the results shown in your browser. Clearing the on-screen results does not mean all service records have been deleted."
  },
  {
    "title": "Calculator and browser storage",
    "body": "The lead value calculator uses the numbers you enter in your browser and does not submit them as a lead. The homepage can save your selected navigation preference in this browser. The legacy assessment also uses browser storage and service records to support progress."
  },
  {
    "title": "Service providers",
    "body": "The website uses hosting services, Supabase for form and tool processing, Resend for email delivery and our email provider for correspondence. Where enabled, Cloudflare Turnstile checks for automated requests. These services process information needed for their part of the website. Their own privacy terms also apply."
  },
  {
    "title": "Marketing",
    "body": "Requesting a verification code does not sign you up for a sales sequence. We use enquiry details to reply to your request. We do not sell your personal information."
  },
  {
    "title": "Retention and requests",
    "body": "To ask what information we hold about you, request a correction or request deletion, email info@purpledrop.com. We will explain what can be removed and what must be kept for agreed work or legal obligations. Service logs, inbox records and assessment records may have different retention periods."
  },
  {
    "title": "Security and limitations",
    "body": "The website uses HTTPS. No website, public check or provider can guarantee complete security. Send only the information needed for your enquiry. A Security Scorecard result is not a certification or a full security review."
  },
  {
    "title": "Changes",
    "body": "We will update this page when the website or our use of information changes. Contact info@purpledrop.com with questions."
  }
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
            What you share with us, and how we use it.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            Draft for review: November 2026. Confirm retention periods and provider terms before publication.
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
            <a href="mailto:info@purpledrop.com" className="font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
              info@purpledrop.com
            </a>{' '}
            - or read our{' '}
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
