import { Link } from 'react-router-dom';
import { Author } from '@/data/mockData';

const AuthorBox = ({ author, compact = false }: { author: Author; compact?: boolean }) => {
  if (compact) {
    return (
      <Link to={`/autoriai/${author.slug}`} className="inline-flex items-center gap-2 hover:text-primary transition-colors">
        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{author.initials}</span>
        <span className="text-sm font-medium">{author.name}</span>
      </Link>
    );
  }

  return (
    <div className="flex items-start gap-4 p-5 rounded-lg border bg-card">
      <Link to={`/autoriai/${author.slug}`} className="shrink-0 w-14 h-14 rounded-full bg-primary/10 text-primary text-lg font-bold flex items-center justify-center hover:bg-primary/20 transition-colors">
        {author.initials}
      </Link>
      <div>
        <Link to={`/autoriai/${author.slug}`} className="font-semibold text-foreground hover:text-primary transition-colors">{author.name}</Link>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{author.bio}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {author.expertise.map(e => (
            <span key={e} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{e}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorBox;
