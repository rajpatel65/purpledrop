import { Link } from 'react-router-dom';
import { Logo } from './Logo';

const COLUMNS = [
  {
    heading: 'Services',
    links: [
      { to: '/services', label: 'Audit, consulting and follow-through' },
      { to: '/pricing', label: 'Pricing' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/process', label: 'How we work' },
      { to: '/results', label: 'Results' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    heading: 'Reads',
    links: [
      { to: '/resources', label: 'All essays' },
      { to: '/resources/the-report-your-web-agency-sends-you', label: 'The agency report, decoded' },
      { to: '/resources/your-buyers-ask-ai-before-they-ask-you', label: 'Buyers ask AI first' },
      { to: '/resources/the-quiet-cost-of-a-beautiful-website', label: 'The cost of beauty' },
    ],
  },
  {
    heading: 'Free Tools',
    links: [
      { to: '/scorecard', label: 'Security Scorecard' },
      { to: '/calculator', label: 'Lead Value Calculator' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-cream/60">
      <div className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-soft">
              We help established companies get recommended by the AI tools their buyers
              actually consult — then keep watching what the answer says.
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-violet">
              United States · working with companies everywhere
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-ink-soft transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-faint">
            © {new Date().getFullYear()} purpleDrop. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="text-xs text-ink-faint transition-colors hover:text-ink">
              Privacy
            </Link>
            <Link to="/terms" className="text-xs text-ink-faint transition-colors hover:text-ink">
              Terms
            </Link>
            <a href="mailto:info@purpledrop.com" className="text-xs text-ink-faint transition-colors hover:text-ink">
              info@purpledrop.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
            }
