import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { PublicArticle, PublicCategory, PublicAuthor } from '@/types/content';
import {
  articles as mockArticles,
  categories as mockCategories,
  authors as mockAuthors,
  getArticlesByAuthor as getMockArticlesByAuthor,
} from '@/data/mockData';
import type { Json } from '@/integrations/supabase/types';

// ─── Helpers ───

function parseFaq(faq: Json | null): { q: string; a: string }[] {
  if (!Array.isArray(faq)) return [];
  return faq
    .filter((item): item is { q: string; a: string } =>
      typeof item === 'object' && item !== null && 'q' in item && 'a' in item
    );
}

function parseSections(sections: Json | null): { id: string; title: string; content: string }[] {
  if (!Array.isArray(sections)) return [];
  return sections.filter(
    (s): s is { id: string; title: string; content: string } =>
      typeof s === 'object' && s !== null && 'id' in s && 'title' in s && 'content' in s
  );
}

function generateInitials(name: string): string {
  if (!name) return '??';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function mapDbArticle(a: any, categoryPath = ''): PublicArticle {
  const author = a.authors;
  return {
    id: a.id,
    slug: a.slug,
    path: a.path,
    title: a.title,
    excerpt: a.excerpt || '',
    body: a.body || '',
    authorSlug: author?.slug || '',
    authorName: author?.name || '',
    authorInitials: author?.initials || generateInitials(author?.name || ''),
    authorBio: author?.bio || '',
    authorExpertise: author?.expertise || [],
    categoryPath,
    updatedAt: a.updated_at?.split('T')[0] || '',
    publishedAt: a.published_at?.split('T')[0] || undefined,
    readTime: a.read_time || '',
    featuredImage: a.featured_image,
    featuredImageAlt: a.featured_image_alt,
    articleType: a.article_type || 'guide',
    sections: parseSections(a.sections),
    faq: parseFaq(a.faq),
    pros: a.pros || [],
    cons: a.cons || [],
    verdict: a.verdict,
    relatedPaths: (a.related_article_ids as string[] | null) || [],
    seoTitle: a.seo_title,
    metaDescription: a.meta_description,
    canonicalUrl: a.canonical_url,
    ogTitle: a.og_title,
    ogDescription: a.og_description,
    ogImage: a.og_image,
    noindex: a.noindex || false,
    showToc: a.show_toc ?? true,
  };
}

function mockToPublic(path: string): PublicArticle | null {
  const mock = mockArticles[path];
  if (!mock) return null;
  const mockAuthor = mockAuthors[mock.authorSlug];
  return {
    slug: mock.slug,
    path: mock.path,
    title: mock.title,
    excerpt: mock.excerpt,
    authorSlug: mock.authorSlug,
    authorName: mockAuthor?.name || '',
    authorInitials: mockAuthor?.initials || '',
    authorBio: mockAuthor?.bio || '',
    authorExpertise: mockAuthor?.expertise || [],
    categoryPath: mock.categoryPath,
    updatedAt: mock.updatedAt,
    readTime: mock.readTime,
    sections: mock.sections,
    faq: mock.faq,
    pros: mock.pros,
    cons: mock.cons,
    verdict: mock.verdict,
    relatedPaths: mock.relatedPaths,
    showToc: true,
  };
}

// ─── Article by path ───

export function usePublicArticle(path: string) {
  return useQuery({
    queryKey: ['public-article', path],
    queryFn: async (): Promise<PublicArticle | null> => {
      // Try DB first — RLS already filters to published-only for anon users
      const { data: dbArticle } = await supabase
        .from('articles')
        .select('*, authors(*)')
        .eq('path', path)
        .eq('status', 'published')
        .maybeSingle();

      if (dbArticle) {
        const article = mapDbArticle(dbArticle);

        // Resolve category path for breadcrumbs
        if (dbArticle.category_id) {
          const { data: cat } = await supabase
            .from('categories')
            .select('path, name')
            .eq('id', dbArticle.category_id)
            .maybeSingle();
          if (cat) {
            article.categoryPath = cat.path;
            article.categoryTitle = cat.name;
          }
        }

        // Resolve related articles by IDs
        if (dbArticle.related_article_ids && (dbArticle.related_article_ids as string[]).length > 0) {
          const { data: relatedArticles } = await supabase
            .from('articles')
            .select('path')
            .in('id', dbArticle.related_article_ids as string[])
            .eq('status', 'published');
          article.relatedPaths = relatedArticles?.map(r => r.path) || [];
        }

        return article;
      }

      // Fallback to mock data
      return mockToPublic(path);
    },
    staleTime: 60_000,
  });
}

// ─── Category by path ───

export function usePublicCategory(path: string) {
  return useQuery({
    queryKey: ['public-category', path],
    queryFn: async (): Promise<PublicCategory | null> => {
      const { data: dbCat } = await supabase
        .from('categories')
        .select('*')
        .eq('path', path)
        .maybeSingle();

      if (dbCat) {
        // Fetch published articles in this category
        const { data: catArticles } = await supabase
          .from('articles')
          .select('*, authors(*)')
          .eq('category_id', dbCat.id)
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        const articles: PublicArticle[] = (catArticles || []).map((a: any) =>
          mapDbArticle(a, path)
        );

        return {
          id: dbCat.id,
          slug: dbCat.slug,
          path: dbCat.path,
          title: dbCat.name,
          description: dbCat.description || '',
          articles,
          faq: parseFaq(dbCat.faq),
          seoTitle: dbCat.seo_title,
          metaDescription: dbCat.meta_description,
          canonicalUrl: dbCat.canonical_url,
        };
      }

      // Fallback to mock
      const mock = mockCategories[path];
      if (!mock) return null;
      const mockArts = mock.articlePaths
        .map(p => mockToPublic(p))
        .filter(Boolean) as PublicArticle[];

      return {
        slug: mock.path.split('/').filter(Boolean).pop() || '',
        path: mock.path,
        title: mock.title,
        description: mock.description,
        articles: mockArts,
        articlePaths: mock.articlePaths,
        faq: mock.faq,
      };
    },
    staleTime: 60_000,
  });
}

// ─── Author by slug ───

export function usePublicAuthor(slug: string) {
  return useQuery({
    queryKey: ['public-author', slug],
    queryFn: async (): Promise<PublicAuthor | null> => {
      const { data: dbAuthor } = await supabase
        .from('authors')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (dbAuthor) {
        const { data: authorArticles } = await supabase
          .from('articles')
          .select('*, authors(*)')
          .eq('author_id', dbAuthor.id)
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        const articles: PublicArticle[] = (authorArticles || []).map((a: any) =>
          mapDbArticle(a)
        );

        return {
          id: dbAuthor.id,
          slug: dbAuthor.slug,
          name: dbAuthor.name,
          bio: dbAuthor.bio || '',
          expertise: dbAuthor.expertise || [],
          initials: dbAuthor.initials || generateInitials(dbAuthor.name),
          avatarUrl: dbAuthor.avatar_url,
          seoTitle: dbAuthor.seo_title,
          metaDescription: dbAuthor.meta_description,
          articles,
        };
      }

      // Fallback to mock
      const mock = mockAuthors[slug];
      if (!mock) return null;
      const mockArts = getMockArticlesByAuthor(slug).map(a => mockToPublic(a.path)).filter(Boolean) as PublicArticle[];

      return {
        slug: mock.slug,
        name: mock.name,
        bio: mock.bio,
        expertise: mock.expertise,
        initials: mock.initials,
        articles: mockArts,
      };
    },
    staleTime: 60_000,
  });
}

// ─── Homepage data ───

export function useHomepageArticles() {
  return useQuery({
    queryKey: ['homepage-articles'],
    queryFn: async () => {
      const { data } = await supabase
        .from('articles')
        .select('*, authors(*)')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(10);

      if (data && data.length > 0) {
        return data.map((a: any) => mapDbArticle(a));
      }

      // Fallback: return null to signal "use mock data"
      return null;
    },
    staleTime: 60_000,
  });
}

// ─── Public comparison products ───

export interface PublicProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  rating: number;
  pricingSummary: string;
  freeVersion: boolean;
  trialAvailable: boolean;
  bestFor: string;
  shortDescription: string;
  longDescription: string;
  pros: string[];
  cons: string[];
  verdict: string;
  affiliateUrl: string | null;
  affiliateDisclosure: string | null;
  features: Record<string, string | boolean>;
  supportedPlatforms: string[];
  logoUrl: string | null;
  heroImageUrl: string | null;
}

function mapDbProduct(p: any): PublicProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand || '',
    rating: Number(p.rating) || 0,
    pricingSummary: p.pricing_summary || '',
    freeVersion: p.free_version || false,
    trialAvailable: p.trial_available || false,
    bestFor: p.best_for || '',
    shortDescription: p.short_description || '',
    pros: p.pros || [],
    cons: p.cons || [],
    verdict: p.verdict || '',
    affiliateUrl: p.affiliate_url,
    affiliateDisclosure: p.affiliate_disclosure,
    features: (p.features as Record<string, string | boolean>) || {},
    supportedPlatforms: p.supported_platforms || [],
    logoUrl: p.logo_url || null,
    heroImageUrl: p.hero_image_url || null,
  };
}

export function useComparisonProducts(category = 'antivirus') {
  return useQuery({
    queryKey: ['comparison-products', category],
    queryFn: async (): Promise<PublicProduct[]> => {
      // product_category and is_active are DB columns added via migration;
      // generated types may lag — cast the builder to bypass strict checking
      const query = supabase.from('products').select('*') as any;
      const { data } = await query
        .eq('product_category', category)
        .eq('is_active', true)
        .order('rating', { ascending: false });
      return (data || []).map((p: any) => mapDbProduct(p));
    },
    staleTime: 60_000,
  });
}

export function useArticleProducts(articleId: string | undefined) {
  return useQuery({
    queryKey: ['article-products', articleId],
    queryFn: async (): Promise<PublicProduct[]> => {
      if (!articleId) return [];
      // sort_order may not be in generated types — use targeted cast
      const { data: links } = await supabase
        .from('article_products')
        .select('product_id, sort_order')
        .eq('article_id', articleId)
        .order('sort_order', { ascending: true });
      if (!links || links.length === 0) return [];
      const productIds = links.map(l => l.product_id);
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);
      if (!products) return [];
      // Preserve sort_order: primary product (sort_order 0) comes first
      const orderMap = new Map(links.map((l, i) => [l.product_id, l.sort_order ?? i]));
      return products
        .map((p: any) => mapDbProduct(p))
        .sort((a, b) => (orderMap.get(a.id) ?? 99) - (orderMap.get(b.id) ?? 99));
    },
    enabled: !!articleId,
    staleTime: 60_000,
  });
}
