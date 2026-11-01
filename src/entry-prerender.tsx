import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';
import { ROUTE_SEO, essaySeo } from './lib/route-seo';
import { ESSAYS } from './lib/essays';

/**
 * SSR entry used by scripts/prerender.mjs only. Renders a route to HTML with
 * a router that never navigates (StaticRouter). Must stay free of
 * browser-only code paths — pages guard window/localStorage already.
 */
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
}

// Re-exported for the prerender script so it can build its route list from
// the same sources without a second vite pass.
export { ROUTE_SEO, essaySeo, ESSAYS };
