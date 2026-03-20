import { Link, useLocation } from 'react-router-dom';
import { Shield, Search, Menu, X } from 'lucide-react';
import { navLinks } from '@/data/mockData';
import { useState } from 'react';

const SiteHeader = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
            <Shield className="w-4.5 h-4.5 text-primary" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight text-foreground">
            antivirusines<span className="text-gradient-primary">.lt</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                location.pathname.startsWith(link.path)
                  ? 'text-primary bg-primary/8'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}
            >
              {link.label}
              {location.pathname.startsWith(link.path) && (
                <span className="absolute bottom-0 left-3.5 right-3.5 h-px bg-primary/40" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-200 active:scale-[0.95]" aria-label="Paieška">
            <Search className="w-4.5 h-4.5" />
          </button>
          <button
            className="md:hidden p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-200 active:scale-[0.95]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Meniu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-border/50 glass animate-fade-in">
          <div className="container py-3 space-y-0.5">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  location.pathname.startsWith(link.path)
                    ? 'text-primary bg-primary/8'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default SiteHeader;