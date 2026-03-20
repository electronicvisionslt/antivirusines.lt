import { useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { usePublicArticle, usePublicCategory } from '@/hooks/usePublicData';
import ArticlePage from './ArticlePage';
import CategoryPage from './CategoryPage';
import NotFound from './NotFound';

/**
 * Dynamic content resolver. Checks DB + mock for article or category match.
 * Used as catch-all route for CMS-created content.
 */
const DynamicPage = () => {
  const { pathname } = useLocation();
  const cleanPath = pathname.replace(/\/$/, '');

  const { data: article, isLoading: articleLoading } = usePublicArticle(cleanPath);
  const { data: category, isLoading: categoryLoading } = usePublicCategory(cleanPath);

  const isLoading = articleLoading || categoryLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  // Article takes priority over category if both match (shouldn't happen, but safe)
  if (article) {
    return <ArticlePage article={article} />;
  }

  if (category) {
    return <CategoryPage category={category} />;
  }

  return <NotFound />;
};

export default DynamicPage;
