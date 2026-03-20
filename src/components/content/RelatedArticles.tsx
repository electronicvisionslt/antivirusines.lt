import { articles } from '@/data/mockData';
import ArticleCard from './ArticleCard';

const RelatedArticles = ({ paths }: { paths: string[] }) => {
  const related = paths.map(p => articles[p]).filter(Boolean);
  if (related.length === 0) return null;

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