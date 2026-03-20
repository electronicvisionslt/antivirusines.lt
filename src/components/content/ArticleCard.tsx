import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { Article, authors } from '@/data/mockData';

const ArticleCard = ({ article }: { article: Article }) => {
  const author = authors[article.authorSlug];

  return (
    <Link
      to={article.path}
      className="group block bg-card rounded-lg border shadow-sm hover:shadow-md transition-[box-shadow,transform] duration-200 overflow-hidden active:scale-[0.98]"
    >
      <div className={`h-40 ${article.heroColor} flex items-center justify-center`}>
        <span className="text-4xl opacity-30">🛡️</span>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            {author && (
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">{author.initials}</span>
                {author.name}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {article.readTime}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
