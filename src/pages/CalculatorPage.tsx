import { useSeo } from '../hooks/useSeo';
import { ROUTE_SEO } from '../lib/route-seo';
import { Layout } from '../components/Layout';
import { CtaBand } from '../components/CtaBand';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { LeadValueCalculator } from '../components/HomeCalculator';

export function CalculatorPage() {
  useSeo(ROUTE_SEO['/calculator']);
  return <Layout>
    <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Lead Value Calculator' }]} />
    <section className="border-b border-line bg-paper py-20">
      <div className="container-page max-w-4xl">
        <p className="eyebrow">Free planning tool</p>
        <h1 className="mt-5 font-serif text-5xl font-medium leading-tight tracking-tight text-ink sm:text-6xl">What could a few more leads be worth?</h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-soft">Use your monthly leads, close rate and average job value to explore a scenario you choose. There are no assumed AI traffic losses, recapture rates or conversion boosts.</p>
        <div className="mt-10"><LeadValueCalculator full /></div>
      </div>
    </section>
    <CtaBand title="First estimate value. Then measure the source."
      body="A calculator cannot tell you whether AI recommends your business. A separate review can inspect public evidence and explain what still needs access or measurement."
      primaryLabel="Request a free 30-minute call" />
  </Layout>;
}
