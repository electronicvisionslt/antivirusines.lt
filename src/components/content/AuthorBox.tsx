import { Link } from 'react-router-dom';

interface AuthorData {
  slug: string;
  name: string;
  initials: string;
  bio: string;
  expertise: string[];
}

const AuthorBox = ({ author, compact = false }: { author: AuthorData; compact?: boolean }) => {
  if (compact) {
    return (
      <Link to={`/autoriai/${author.slug}`} className="inline-flex items-center gap-2 hover:text-primary transition-colors duration-200">
        <span className="w-7 h-7 rounded-full bg-primary/8 border border-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">{author.initials}</span>
        <span className="text-sm font-medium">{author.name}</span>
      </Link>
    );
  }

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border border-border/50 bg-card">
      <Link to={`/autoriai/${author.slug}`} className="shrink-0 w-12 h-12 rounded-full bg-primary/8 border border-primary/10 text-primary text-base font-bold flex items-center justify-center hover:bg-primary/12 transition-colors duration-200">
        {author.initials}
      </Link>
      <div>
        <Link to={`/autoriai/${author.slug}`} className="font-heading font-semibold text-foreground hover:text-primary transition-colors duration-200">{author.name}</Link>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{author.bio}</p>
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {author.expertise.map(e => (
            <span key={e} className="text-[11px] px-2 py-0.5 rounded-full bg-muted border border-border/40 text-muted-foreground">{e}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorBox;
