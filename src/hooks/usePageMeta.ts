import { Helmet } from 'react-helmet-async';
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
  const canonicalUrl = getCanonicalUrl(meta.canonicalUrl);
  const title = meta.title
    ? meta.title.includes(SITE_NAME)
      ? meta.title
      : `${meta.title} | ${SITE_NAME}`
    : SITE_NAME;

  const ldData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'lt',
    description: meta.description || DEFAULT_DESCRIPTION,
  };

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={meta.description || DEFAULT_DESCRIPTION} />
      <meta property="og:title" content={meta.ogTitle || meta.title || SITE_NAME} />
      <meta property="og:description" content={meta.ogDescription || meta.description || DEFAULT_DESCRIPTION} />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="robots" content={meta.noindex ? 'noindex, nofollow' : 'index, follow'} />
      {meta.ogImage ? <meta property="og:image" content={meta.ogImage} /> : null}
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="lt" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      <script type="application/ld+json">{JSON.stringify(ldData)}</script>
    </Helmet>
  );
}
