import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ProcessPage } from './pages/ProcessPage';
import { ResultsPage } from './pages/ResultsPage';
import { PricingPage } from './pages/PricingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ResourcePostPage } from './pages/ResourcePostPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ScorecardPage } from './pages/ScorecardPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { Soc2AssessmentPage } from './pages/Soc2AssessmentPage';
import { NotFoundPage } from './pages/NotFoundPage';

/**
 * Static imports (no lazy/Suspense at this level) so the prerender pass can
 * render every route to real HTML for bots that don't execute JS
 * (AI crawlers, social scrapers). HeroScene stays lazy inside HomePage.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/process" element={<ProcessPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/resources/:slug" element={<ResourcePostPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/scorecard" element={<ScorecardPage />} />
      <Route path="/calculator" element={<CalculatorPage />} />
      <Route path="/soc2" element={<Soc2AssessmentPage />} />
      <Route path="/soc2/results" element={<Soc2AssessmentPage />} />
      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
