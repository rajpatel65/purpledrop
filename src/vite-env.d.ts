/// <reference types="vite/client" />

// Set by scripts/prerender.mjs in prerendered HTML (see main.tsx hydrate branch).
interface Window {
  __PRERENDERED__?: boolean;
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SUPABASE_FUNCTIONS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}