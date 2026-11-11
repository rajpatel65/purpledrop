import { useEffect } from 'react';

export interface SeoProps {
  title: string;
  description: string;
  path?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}

const BASE_URL = 'https://purpledrop.com';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function useSeo({ title, description, path = '/', type = 'website', noindex = false }: SeoProps) {
  useEffect(() => {
    document.title = title;
    if (noindex) {
      upsertMeta('name', 'robots', 'noindex, nofollow');
    } else {
      document.head.querySelector('meta[name="robots"]')?.remove();
    }
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', BASE_URL + path);
    upsertMeta('property', 'og:image', BASE_URL + '/og-image.svg');
    upsertMeta('property', 'og:site_name', 'purpleDrop');
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', BASE_URL + '/og-image.svg');

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = BASE_URL + path;
  }, [title, description, path, type, noindex]);
}
