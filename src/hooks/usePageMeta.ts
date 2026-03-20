import { useEffect } from 'react';
import type { SeoMeta } from '@/types/content';

const SITE_NAME = 'antivirusines.lt';
const DEFAULT_DESCRIPTION = 'Nepriklausomos antivirusinių programų apžvalgos, saugumo gidai ir patarimai lietuvių kalba.';

/**
 * Sets document <head> meta tags reactively.
 * Cleans up on unmount to avoid stale tags.
 */
export function usePageMeta(meta: SeoMeta) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = meta.title ? `${meta.title} | ${SITE_NAME}` : SITE_NAME;

    const setMeta = (name: string, content: string | undefined, isProperty = false) => {
      if (!content) return;
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('description', meta.description || DEFAULT_DESCRIPTION);
    setMeta('og:title', meta.ogTitle || meta.title, true);
    setMeta('og:description', meta.ogDescription || meta.description || DEFAULT_DESCRIPTION, true);
    if (meta.ogImage) setMeta('og:image', meta.ogImage, true);
    setMeta('og:type', 'article', true);
    setMeta('og:site_name', SITE_NAME, true);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (meta.canonicalUrl) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = meta.canonicalUrl;
    } else if (canonical) {
      canonical.remove();
    }

    // Noindex
    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (meta.noindex) {
      if (!robots) {
        robots = document.createElement('meta');
        robots.name = 'robots';
        document.head.appendChild(robots);
      }
      robots.content = 'noindex, nofollow';
    } else if (robots) {
      robots.content = 'index, follow';
    }

    return () => {
      document.title = prevTitle;
    };
  }, [meta.title, meta.description, meta.ogTitle, meta.ogDescription, meta.ogImage, meta.canonicalUrl, meta.noindex]);
}
