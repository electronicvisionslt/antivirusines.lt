import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import type { PublicArticle } from '@/types/content';

interface Props {
  article: PublicArticle;
}

const ArticleCard = ({ article }: Props) => {
  return (
    <Link
      to={article.path}
      className="group block rounded-lg border border-border/50 bg-card glow-border glow-border-hover transition-all duration-300 overflow-hidden active:scale-[0.98]"
    >
      <div className="h-32 bg-muted/40 flex items-center justify-center relative overflow-hidden">
        {article.featuredImage ? (
          <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 gradient-mesh" />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading font-semibold text-foreground text-sm leading-snug mb-1.5 group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{article.excerpt}</p>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground/60">
          <div className="flex items-center gap-2">
            {article.authorName && (
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-primary/8 text-primary text-[8px] font-bold flex items-center justify-center">
                  {article.authorInitials}
                </span>
                {article.authorName}
              </span>
            )}
          </div>
          {article.readTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
