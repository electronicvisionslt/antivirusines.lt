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
      className="group block rounded-xl border border-border/60 bg-card glow-border glow-border-hover transition-all duration-300 overflow-hidden active:scale-[0.98]"
    >
      <div className="h-36 bg-secondary/50 flex items-center justify-center relative overflow-hidden">
        {article.featuredImage ? (
          <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover" />
        ) : (
          <>
            <div className="absolute inset-0 gradient-mesh opacity-60" />
            <span className="text-3xl opacity-20 relative z-10">🛡️</span>
          </>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-heading font-semibold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{article.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground/70">
          <div className="flex items-center gap-3">
            {article.authorName && (
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center border border-primary/20">
                  {article.authorInitials}
                </span>
                {article.authorName}
              </span>
            )}
          </div>
          {article.readTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
