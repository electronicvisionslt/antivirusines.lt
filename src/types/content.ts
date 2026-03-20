/**
 * Normalized public content types used by both DB and mock data.
 * These decouple public templates from the data source.
 */

export interface PublicArticle {
  id?: string;
  slug: string;
  path: string;
  title: string;
  excerpt: string;
  body?: string;
  authorSlug: string;
  authorName?: string;
  authorInitials?: string;
  authorBio?: string;
  authorExpertise?: string[];
  categoryPath: string;
  updatedAt: string;
  publishedAt?: string;
  readTime: string;
  featuredImage?: string | null;
  featuredImageAlt?: string | null;
  articleType?: string;
  sections: { id: string; title: string; content: string }[];
  faq: { q: string; a: string }[];
  pros?: string[];
  cons?: string[];
  verdict?: string | null;
  relatedPaths?: string[];
  seoTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  noindex?: boolean;
  showToc?: boolean;
}

export interface PublicCategory {
  id?: string;
  slug: string;
  path: string;
  title: string;
  description: string;
  articlePaths?: string[];
  articles?: PublicArticle[];
  faq: { q: string; a: string }[];
  seoTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  noindex?: boolean;
}

export interface PublicAuthor {
  id?: string;
  slug: string;
  name: string;
  bio: string;
  expertise: string[];
  initials: string;
  avatarUrl?: string | null;
  seoTitle?: string | null;
  metaDescription?: string | null;
  articles?: PublicArticle[];
}

export interface SeoMeta {
  title: string;
  description?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noindex?: boolean;
}
