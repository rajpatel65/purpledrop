import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { JsonLd } from './JsonLd';
import { StickyMobileCTA } from './StickyMobileCTA';
import { organizationSchema, websiteSchema } from '../lib/schema';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
      >
        Skip to content
      </a>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
