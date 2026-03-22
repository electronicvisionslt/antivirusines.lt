import { useEffect, useRef } from 'react';
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

/**
 * Manages document <head> meta tags with full cleanup on unmount and route change.
 * Tracks all tags created/modified so stale values never persist.
 */
export function usePageMeta(meta: SeoMeta) {
  const createdElements = useRef<HTMLElement[]>([]);
  const prevValues = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const canonicalUrl = getCanonicalUrl(meta.canonicalUrl);

    // Clean up anything from previous render
    cleanup();

    // ── Title ──
    const prevTitle = document.title;
    if (meta.title) {
      document.title = meta.title.includes(SITE_NAME) ? meta.title : `${meta.title} | ${SITE_NAME}`;
    } else {
      document.title = SITE_NAME;
    }

    // ── Meta tags ──
    const managedMetas: { attr: 'name' | 'property'; key: string; content: string | undefined }[] = [
      { attr: 'name', key: 'description', content: meta.description || DEFAULT_DESCRIPTION },
      { attr: 'property', key: 'og:title', content: meta.ogTitle || meta.title },
      { attr: 'property', key: 'og:description', content: meta.ogDescription || meta.description || DEFAULT_DESCRIPTION },
      { attr: 'property', key: 'og:image', content: meta.ogImage || undefined },
      { attr: 'property', key: 'og:type', content: 'article' },
      { attr: 'property', key: 'og:site_name', content: SITE_NAME },
      { attr: 'property', key: 'og:url', content: canonicalUrl },
      { attr: 'name', key: 'robots', content: meta.noindex ? 'noindex, nofollow' : 'index, follow' },
    ];

    for (const { attr, key, content } of managedMetas) {
      const selector = `meta[${attr}="${key}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement | null;

      if (content) {
        if (el) {
          // Save previous value for restoration
          prevValues.current.set(selector, el.content);
          el.content = content;
        } else {
          el = document.createElement('meta');
          el.setAttribute(attr, key);
          el.content = content;
          document.head.appendChild(el);
          createdElements.current.push(el);
        }
      } else if (el) {
        // No content for this tag — remove if we created it, restore if it was pre-existing
        if (createdElements.current.includes(el)) {
          el.remove();
          createdElements.current = createdElements.current.filter(e => e !== el);
        } else {
          prevValues.current.set(selector, el.content);
          el.content = '';
        }
      }
    }

    // ── Canonical ──
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonicalUrl) {
      if (canonical) {
        prevValues.current.set('link[rel="canonical"]', canonical.href);
        canonical.href = canonicalUrl;
      } else {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = canonicalUrl;
        document.head.appendChild(canonical);
        createdElements.current.push(canonical);
      }
    } else if (canonical && createdElements.current.includes(canonical)) {
      canonical.remove();
      createdElements.current = createdElements.current.filter(e => e !== canonical);
    }

    // ── Hreflang (self-referencing lt + x-default) ──
    for (const hl of ['lt', 'x-default']) {
      const selector = `link[rel="alternate"][hreflang="${hl}"]`;
      let el = document.querySelector(selector) as HTMLLinkElement | null;
      if (canonicalUrl) {
        if (el) {
          prevValues.current.set(selector, el.href);
          el.href = canonicalUrl;
        } else {
          el = document.createElement('link');
          el.rel = 'alternate';
          el.hreflang = hl;
          el.href = canonicalUrl;
          document.head.appendChild(el);
          createdElements.current.push(el);
        }
      }
    }

    // ── JSON-LD (WebSite fallback) ──
    const jsonLdId = 'ld-page-meta';
    let ldScript = document.getElementById(jsonLdId) as HTMLScriptElement | null;
    const ldData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: 'lt',
      description: meta.description || DEFAULT_DESCRIPTION,
    };
    if (ldScript) {
      prevValues.current.set(`#${jsonLdId}`, ldScript.textContent || '');
      ldScript.textContent = JSON.stringify(ldData);
    } else {
      ldScript = document.createElement('script');
      ldScript.type = 'application/ld+json';
      ldScript.id = jsonLdId;
      ldScript.textContent = JSON.stringify(ldData);
      document.head.appendChild(ldScript);
      createdElements.current.push(ldScript);
    }

    // ── Cleanup function ──
    return () => {
      document.title = prevTitle;
      cleanup();
    };
  }, [meta.title, meta.description, meta.ogTitle, meta.ogDescription, meta.ogImage, meta.canonicalUrl, meta.noindex]);

  function cleanup() {
    // Remove elements we created
    for (const el of createdElements.current) {
      el.remove();
    }
    createdElements.current = [];

    // Restore previous values
    for (const [selector, value] of prevValues.current) {
      const el = document.querySelector(selector) as HTMLElement | null;
      if (el) {
        if (el instanceof HTMLMetaElement) el.content = value;
        if (el instanceof HTMLLinkElement) el.href = value;
      }
    }
    prevValues.current.clear();
  }
}
