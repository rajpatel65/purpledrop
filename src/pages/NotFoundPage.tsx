import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';
import { ROUTE_SEO } from '../lib/route-seo';
import { Layout } from '../components/Layout';
import { FadeIn } from '../components/FadeIn';

export function NotFoundPage() {
  useSeo(ROUTE_SEO['/not-found']);

  return (
    <Layout>
      <section className="border-b border-line bg-paper py-32">
        <div className="container-page text-center">
          <FadeIn>
            <p className="font-serif text-8xl font-medium text-violet">404</p>
            <h1 className="mt-6 font-serif text-4xl font-medium tracking-tight text-ink">
              We could not find that page.
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink-soft">
              The link may be old or the address may be wrong. Go home or see the services
              to choose your next step.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link to="/" className="btn-primary">
                Go to homepage
              </Link>
              <Link to="/services" className="btn-outline">
                See what we do
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
}
