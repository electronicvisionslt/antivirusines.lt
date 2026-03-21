import { Link } from 'react-router-dom';
import { ChevronRight, Shield, Users, Key, Bug } from 'lucide-react';

const iconMap: Record<string, any> = {
  '/antivirusines-programos': Shield,
  '/tevu-kontrole': Users,
  '/slaptazodziu-saugumas': Key,
  '/virusai/kompiuterinis-virusas': Bug,
};

interface CategoryCardProps {
  path: string;
  title: string;
  description: string;
}

const CategoryCard = ({ path, title, description }: CategoryCardProps) => {
  const Icon = iconMap[path] || Shield;

  return (
    <Link
      to={path}
      className="group flex items-start gap-3.5 p-4 rounded-lg border border-border/50 bg-card glow-border glow-border-hover transition-all duration-300 active:scale-[0.98]"
    >
      <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/8 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-heading font-semibold text-foreground text-sm mb-0.5 group-hover:text-primary transition-colors duration-200">{title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 shrink-0 mt-0.5 transition-all duration-200" />
    </Link>
  );
};

export default CategoryCard;
