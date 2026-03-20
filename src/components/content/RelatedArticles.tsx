import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { articles as mockArticles, authors as mockAuthors } from '@/data/mockData';
import ArticleCard from './ArticleCard';
import type { PublicArticle } from '@/types/content';

const RelatedArticles = ({ paths }: { paths: string[] }) => {
  const { data: related } = useQuery({
    queryKey: ['related-articles', paths],
    queryFn: async (): Promise<PublicArticle[]> => {
      if (paths.length === 0) return [];

      // Try DB
      const { data } = await supabase
        .from('articles')
        .select('*, authors(*)')
        .in('path', paths)
        .eq('status', 'published');

      if (data && data.length > 0) {
        return data.map((a: any) => {
          const author = a.authors;
          return {
            slug: a.slug,
            path: a.path,
            title: a.title,
            excerpt: a.excerpt || '',
            authorSlug: author?.slug || '',
            authorName: author?.name || '',
            authorInitials: author?.initials || '',
            categoryPath: '',
            updatedAt: a.updated_at?.split('T')[0] || '',
            readTime: a.read_time || '',
            featuredImage: a.featured_image,
            sections: [],
            faq: [],
          };
        });
      }

      // Fallback to mock
      return paths
        .map(p => {
          const mock = mockArticles[p];
          if (!mock) return null;
          const author = mockAuthors[mock.authorSlug];
          return {
            slug: mock.slug,
            path: mock.path,
            title: mock.title,
            excerpt: mock.excerpt,
            authorSlug: mock.authorSlug,
            authorName: author?.name || '',
            authorInitials: author?.initials || '',
            categoryPath: mock.categoryPath,
            updatedAt: mock.updatedAt,
            readTime: mock.readTime,
            sections: [],
            faq: [],
          } as PublicArticle;
        })
        .filter(Boolean) as PublicArticle[];
    },
    staleTime: 60_000,
  });

  if (!related || related.length === 0) return null;

  return (
    <section className="my-10">
      <h2 className="font-heading text-2xl font-bold text-foreground mb-5">Susiję straipsniai</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {related.map(a => (
          <ArticleCard key={a.path} article={a} />
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;
