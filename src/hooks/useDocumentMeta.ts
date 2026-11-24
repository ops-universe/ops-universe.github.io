import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { site } from '@/lib/site';

interface Meta {
  title?: string;
  description?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Per-route <title>, description, canonical URL and Open Graph / Twitter tags. */
export function useDocumentMeta({ title, description = site.description, noindex = false, type = 'website' }: Meta) {
  const { pathname } = useLocation();
  useEffect(() => {
    const fullTitle = title ? `${title} · ${site.name}` : `${site.name} — ${site.tagline}`;
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    const url = `${site.url}${base}${pathname === '/' ? '/' : pathname}`;
    document.title = fullTitle;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex, follow' : 'index, follow');
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setMeta('meta[property="og:type"]', 'property', 'og:type', type);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, noindex, type, pathname]);
}
