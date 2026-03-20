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
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// ─── Article by path ───

export function usePublicArticle(path: string) {
  return useQuery({
    queryKey: ['public-article', path],
    queryFn: async (): Promise<PublicArticle | null> => {
      // Try DB first
      const { data: dbArticle } = await supabase
        .from('articles')
        .select('*, authors(*)')
        .eq('path', path)
        .eq('status', 'published')
        .maybeSingle();

      if (dbArticle) {
        const author = dbArticle.authors as any;
        return {
          id: dbArticle.id,
          slug: dbArticle.slug,
          path: dbArticle.path,
          title: dbArticle.title,
          excerpt: dbArticle.excerpt || '',
          body: dbArticle.body || '',
          authorSlug: author?.slug || '',
          authorName: author?.name || '',
          authorInitials: author?.initials || generateInitials(author?.name || ''),
          authorBio: author?.bio || '',
          authorExpertise: author?.expertise || [],
          categoryPath: '',
          updatedAt: dbArticle.updated_at?.split('T')[0] || '',
          publishedAt: dbArticle.published_at?.split('T')[0] || undefined,
          readTime: dbArticle.read_time || '',
          featuredImage: dbArticle.featured_image,
          featuredImageAlt: dbArticle.featured_image_alt,
          articleType: dbArticle.article_type || 'guide',
          sections: parseSections(dbArticle.sections),
          faq: parseFaq(dbArticle.faq),
          pros: dbArticle.pros || [],
          cons: dbArticle.cons || [],
          verdict: dbArticle.verdict,
          relatedPaths: [],
          seoTitle: dbArticle.seo_title,
          metaDescription: dbArticle.meta_description,
          canonicalUrl: dbArticle.canonical_url,
          ogTitle: dbArticle.og_title,
          ogDescription: dbArticle.og_description,
          ogImage: dbArticle.og_image,
          noindex: dbArticle.noindex || false,
          showToc: dbArticle.show_toc ?? true,
        };
      }

      // Fallback to mock data
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

        const articles: PublicArticle[] = (catArticles || []).map((a: any) => {
          const author = a.authors;
          return {
            id: a.id,
            slug: a.slug,
            path: a.path,
            title: a.title,
            excerpt: a.excerpt || '',
            authorSlug: author?.slug || '',
            authorName: author?.name || '',
            authorInitials: author?.initials || generateInitials(author?.name || ''),
            categoryPath: path,
            updatedAt: a.updated_at?.split('T')[0] || '',
            readTime: a.read_time || '',
            sections: [],
            faq: [],
          };
        });

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
        .map(p => mockArticles[p])
        .filter(Boolean)
        .map(a => {
          const author = mockAuthors[a.authorSlug];
          return {
            slug: a.slug,
            path: a.path,
            title: a.title,
            excerpt: a.excerpt,
            authorSlug: a.authorSlug,
            authorName: author?.name || '',
            authorInitials: author?.initials || '',
            categoryPath: a.categoryPath,
            updatedAt: a.updatedAt,
            readTime: a.readTime,
            sections: [],
            faq: [],
          };
        });

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
          .select('*')
          .eq('author_id', dbAuthor.id)
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        const articles: PublicArticle[] = (authorArticles || []).map((a: any) => ({
          id: a.id,
          slug: a.slug,
          path: a.path,
          title: a.title,
          excerpt: a.excerpt || '',
          authorSlug: dbAuthor.slug,
          authorName: dbAuthor.name,
          authorInitials: dbAuthor.initials || generateInitials(dbAuthor.name),
          categoryPath: '',
          updatedAt: a.updated_at?.split('T')[0] || '',
          readTime: a.read_time || '',
          sections: [],
          faq: [],
        }));

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
      const mockArts = getMockArticlesByAuthor(slug).map(a => ({
        slug: a.slug,
        path: a.path,
        title: a.title,
        excerpt: a.excerpt,
        authorSlug: a.authorSlug,
        authorName: mock.name,
        authorInitials: mock.initials,
        categoryPath: a.categoryPath,
        updatedAt: a.updatedAt,
        readTime: a.readTime,
        sections: [],
        faq: [],
      }));

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
        return data.map((a: any) => {
          const author = a.authors;
          return {
            id: a.id,
            slug: a.slug,
            path: a.path,
            title: a.title,
            excerpt: a.excerpt || '',
            authorSlug: author?.slug || '',
            authorName: author?.name || '',
            authorInitials: author?.initials || generateInitials(author?.name || ''),
            categoryPath: '',
            updatedAt: a.updated_at?.split('T')[0] || '',
            readTime: a.read_time || '',
            featuredImage: a.featured_image,
            sections: [],
            faq: [],
          } as PublicArticle;
        });
      }

      // Fallback: return mock articles
      return null;
    },
    staleTime: 60_000,
  });
}
