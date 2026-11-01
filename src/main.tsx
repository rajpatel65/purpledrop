import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import App from './App';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

/**
 * When the route was prerendered (dist/<route>/index.html), hydrate the
 * existing HTML instead of re-rendering from an empty div — preserves
 * crawlable content and avoids a full client re-render. Falls back to a
 * normal client render otherwise (e.g. SPA fallback for unknown paths).
 */
if (window.__PRERENDERED__) {
  hydrateRoot(
    container,
    <StrictMode>
      <BrowserRouter>
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
} else {
  createRoot(container).render(
    <StrictMode>
      <BrowserRouter>
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
}
