import { Link, useLocation } from 'react-router-dom';
import { Shield, Search, Menu, X, ChevronDown } from 'lucide-react';
import { navLinks } from '@/data/mockData';
import { useState, useRef, useEffect } from 'react';

const SiteHeader = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/60">
      <div className="container flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <span className="font-heading font-bold text-base tracking-tight text-foreground">
            antivirusines<span className="text-gradient-primary">.lt</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5" ref={dropdownRef}>
          {navLinks.map(link => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            const hasChildren = link.children && link.children.length > 0;
            const isDropdownOpen = openDropdown === link.path;

            if (hasChildren) {
              return (
                <div key={link.path} className="relative">
                  <button
                    onClick={() => setOpenDropdown(isDropdownOpen ? null : link.path)}
                    className={`relative flex items-center gap-1 px-3 py-1.5 text-[13px] font-medium rounded-md transition-all duration-200 ${
                      isActive
                        ? 'text-primary bg-primary/8'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    {link.label}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-primary/50 rounded-full" />
                    )}
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-56 rounded-lg border border-border/60 bg-card shadow-lg py-1 animate-fade-in z-50">
                      {link.children!.map(child => {
                        const childActive = location.pathname === child.path;
                        return (
                          <div key={child.path}>
                            {child.divider && <div className="my-1 mx-3 h-px bg-border/60" />}
                            {child.children ? (
                              <>
                                <span className="block px-4 pt-2 pb-1 text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-foreground/60">
                                  {child.label}
                                </span>
                                {child.children.map(sub => {
                                  const subActive = location.pathname === sub.path;
                                  return (
                                    <Link
                                      key={sub.path}
                                      to={sub.path}
                                      onClick={() => setOpenDropdown(null)}
                                      className={`block px-4 py-1.5 pl-6 text-[13px] font-medium transition-colors duration-150 ${
                                        subActive ? 'text-primary bg-primary/8' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                                      }`}
                                    >
                                      {sub.label}
                                    </Link>
                                  );
                                })}
                              </>
                            ) : (
                              <Link
                                to={child.path}
                                onClick={() => setOpenDropdown(null)}
                                className={`block px-4 py-2 text-[13px] font-medium transition-colors duration-150 ${
                                  childActive ? 'text-primary bg-primary/8' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                                }`}
                              >
                                {child.label}
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-1.5 text-[13px] font-medium rounded-md transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-primary/8'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-primary/50 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200" aria-label="Paieška">
            <Search className="w-4.5 h-4.5" />
          </button>
          <button
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Meniu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-border/60 bg-card animate-fade-in">
          <div className="container py-2 space-y-0.5">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              const hasChildren = link.children && link.children.length > 0;

              if (hasChildren) {
                return (
                  <div key={link.path}>
                    <span
                      className={`block px-4 py-2.5 text-sm font-semibold rounded-md ${
                        isActive
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {link.label}
                    </span>
                    <div className="pl-4 space-y-0.5">
                      {link.children!.map(child => {
                        const childActive = location.pathname === child.path;
                        if (child.children) {
                          return (
                            <div key={child.path}>
                              {child.divider && <div className="my-1 mx-3 h-px bg-border/60" />}
                              <span className="block px-4 pt-2 pb-1 text-[11px] font-heading font-semibold uppercase tracking-wider text-muted-foreground/60">
                                {child.label}
                              </span>
                              {child.children.map(sub => {
                                const subActive = location.pathname === sub.path;
                                return (
                                  <Link key={sub.path} to={sub.path} onClick={() => setMobileOpen(false)}
                                    className={`block px-4 py-2 pl-8 text-[13px] font-medium rounded-md transition-all duration-200 ${
                                      subActive ? 'text-primary bg-primary/8' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                                    }`}>
                                    {sub.label}
                                  </Link>
                                );
                              })}
                            </div>
                          );
                        }
                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={() => setMobileOpen(false)}
                            className={`block px-4 py-2 text-[13px] font-medium rounded-md transition-all duration-200 ${
                              childActive
                                ? 'text-primary bg-primary/8'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                            }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                    isActive
                      ? 'text-primary bg-primary/8'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
};

export default SiteHeader;
