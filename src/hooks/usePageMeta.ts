import { useEffect } from 'react';
import type { SeoMeta } from '@/types/content';

const SITE_NAME = 'antivirusines.lt';
const SITE_URL = 'https://antivirusines.lt';
const DEFAULT_DESCRIPTION = 'Nepriklausomos antivirusinių programų apžvalgos, saugumo gidai ir patarimai lietuvių kalba.';

function ensureTrailingSlash(pathname: string) {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

function getCanonicalUrl(explicitCanonical?: string) {
  if (explicitCanonical) {
    try {
      const url = new URL(explicitCanonical, SITE_URL);
      url.pathname = ensureTrailingSlash(url.pathname);
      return url.toString();
    } catch {
      return explicitCanonical;
    }
  }

  if (typeof window === 'undefined') {
    return SITE_URL;
  }

  const url = new URL(window.location.href);
  url.protocol = 'https:';
  url.host = new URL(SITE_URL).host;
  url.pathname = ensureTrailingSlash(url.pathname);
  url.search = '';
  url.hash = '';
  return url.toString();
}

export function usePageMeta(meta: SeoMeta) {
  useEffect(() => {
    const canonicalUrl = getCanonicalUrl(meta.canonicalUrl);
    const title = meta.title
      ? meta.title.includes(SITE_NAME)
        ? meta.title
        : `${meta.title} | ${SITE_NAME}`
      : SITE_NAME;

    document.title = title;

    const upsertMeta = (attr: 'name' | 'property', key: string, content?: string) => {
      const selector = `meta[${attr}="${key}"]`;
      let el = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!content) {
        el?.remove();
        return;
      }
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const upsertLink = (selector: string, attrs: Record<string, string>) => {
      let el = document.head.querySelector(selector) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        document.head.appendChild(el);
      }
      Object.entries(attrs).forEach(([key, value]) => {
        el!.setAttribute(key, value);
      });
    };

    upsertMeta('name', 'description', meta.description || DEFAULT_DESCRIPTION);
    upsertMeta('name', 'robots', meta.noindex ? 'noindex, nofollow' : 'index, follow');
    upsertMeta('property', 'og:title', meta.ogTitle || meta.title || SITE_NAME);
    upsertMeta('property', 'og:description', meta.ogDescription || meta.description || DEFAULT_DESCRIPTION);
    upsertMeta('property', 'og:type', 'article');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', meta.ogImage || undefined);

    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });
    upsertLink('link[rel="alternate"][hreflang="lt"]', { rel: 'alternate', hreflang: 'lt', href: canonicalUrl });
    upsertLink('link[rel="alternate"][hreflang="x-default"]', { rel: 'alternate', hreflang: 'x-default', href: canonicalUrl });

    const ldData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: 'lt',
      description: meta.description || DEFAULT_DESCRIPTION,
    };

    let script = document.head.querySelector('script[data-seo="json-ld"]') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'json-ld');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(ldData);

  }, [meta.title, meta.description, meta.ogTitle, meta.ogDescription, meta.ogImage, meta.canonicalUrl, meta.noindex]);
}
