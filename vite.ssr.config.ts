import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Config for the prerender SSR bundle only (vite build --ssr via
 * scripts/prerender.mjs pipeline). Intentionally minimal: no manualChunks
 * (client-only concern, breaks SSR externalization), sourcemaps off.
 */
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    sourcemap: false,
    ssr: 'src/entry-prerender.tsx',
    outDir: 'dist/.ssr',
    emptyOutDir: true,
  },
});
