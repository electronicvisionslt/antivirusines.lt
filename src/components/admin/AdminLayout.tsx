import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  FileText, FolderOpen, Users, Package, Image, LayoutDashboard, LogOut, ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Valdymo skydas', path: '/admin', icon: LayoutDashboard },
  { label: 'Straipsniai', path: '/admin/articles', icon: FileText },
  { label: 'Kategorijos', path: '/admin/categories', icon: FolderOpen },
  { label: 'Autoriai', path: '/admin/authors', icon: Users },
  { label: 'Produktai', path: '/admin/products', icon: Package },
  { label: 'Media', path: '/admin/media', icon: Image },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-border/50 bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border/40">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Grįžti į svetainę
          </Link>
          <h2 className="font-heading font-bold text-foreground mt-3">CMS</h2>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {navItems.map(item => {
            const active = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border/40">
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Atsijungti
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
