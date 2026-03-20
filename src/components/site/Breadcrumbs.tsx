import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path: string;
}

interface Props {
  path: string;
  /** Pre-resolved breadcrumb items. When provided, skips slug-based guessing. */
  items?: BreadcrumbItem[];
}

/**
 * Builds breadcrumbs from explicit items or falls back to path-segment parsing.
 */
function buildCrumbs(path: string, items?: BreadcrumbItem[]): BreadcrumbItem[] {
  if (items && items.length > 0) return items;

  // Fallback: split path into segments and use slug as label
  const crumbs: BreadcrumbItem[] = [{ label: 'Pradžia', path: '/' }];
  const segments = path.split('/').filter(Boolean);
  let currentPath = '';
  for (const seg of segments) {
    currentPath += '/' + seg;
    crumbs.push({ label: seg, path: currentPath });
  }
  return crumbs;
}

const Breadcrumbs = ({ path, items }: Props) => {
  const crumbs = buildCrumbs(path, items);

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6">
      <ol className="flex flex-wrap items-center gap-1.5" itemScope itemType="https://schema.org/BreadcrumbList">
        {crumbs.map((crumb, i) => (
          <li key={crumb.path} className="flex items-center gap-1.5" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            {i > 0 && <ChevronRight className="w-3 h-3 shrink-0 text-muted-foreground/40" />}
            {i < crumbs.length - 1 ? (
              <Link to={crumb.path} className="hover:text-primary transition-colors duration-200 truncate max-w-[200px]" itemProp="item">
                <span itemProp="name">{crumb.label}</span>
              </Link>
            ) : (
              <span className="text-foreground/70 font-medium truncate max-w-[200px]" itemProp="name">{crumb.label}</span>
            )}
            <meta itemProp="position" content={String(i + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
