import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { site } from '@/lib/site';

interface Meta {
  title?: string;
  description?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
}

export interface ResolvedMeta {
  title: string;
  description: string;
  robots: string;
  url: string;
  type: 'website' | 'article';
}

function resolveMeta({ title, description = site.description, noindex = false, type = 'website' }: Meta, pathname: string): ResolvedMeta {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return {
    title: title ? `${title} · ${site.name}` : `${site.name} — ${site.tagline}`,
    description,
    robots: noindex ? 'noindex, follow' : 'index, follow',
    url: `${site.url}${base}${pathname === '/' ? '/' : pathname}`,
    type,
  };
}

/* Build-time prerendering runs no effects, so the meta for the page being rendered
   is recorded here during render and read back by entry-server.tsx. */
let ssrMeta: ResolvedMeta | null = null;
export const takeSsrMeta = () => {
  const m = ssrMeta;
  ssrMeta = null;
  return m;
};

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
export function useDocumentMeta(meta: Meta) {
  const { pathname } = useLocation();
  const { title, description, noindex, type } = meta;
  if (import.meta.env.SSR) ssrMeta = resolveMeta(meta, pathname);

  useEffect(() => {
    const m = resolveMeta({ title, description, noindex, type }, pathname);
    document.title = m.title;
    setMeta('meta[name="description"]', 'name', 'description', m.description);
    setMeta('meta[name="robots"]', 'name', 'robots', m.robots);
    setMeta('meta[property="og:title"]', 'property', 'og:title', m.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', m.description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', m.url);
    setMeta('meta[property="og:type"]', 'property', 'og:type', m.type);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', m.title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', m.description);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = m.url;
  }, [title, description, noindex, type, pathname]);
}
