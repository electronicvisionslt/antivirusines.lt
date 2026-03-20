import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { FileText, FolderOpen, Users, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Stats {
  articles: number;
  categories: number;
  authors: number;
  products: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({ articles: 0, categories: 0, authors: 0, products: 0 });

  useEffect(() => {
    const load = async () => {
      const [a, c, au, p] = await Promise.all([
        supabase.from('articles').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('authors').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        articles: a.count ?? 0,
        categories: c.count ?? 0,
        authors: au.count ?? 0,
        products: p.count ?? 0,
      });
    };
    load();
  }, []);

  const cards = [
    { label: 'Straipsniai', count: stats.articles, icon: FileText, path: '/admin/articles', color: 'text-primary' },
    { label: 'Kategorijos', count: stats.categories, icon: FolderOpen, path: '/admin/categories', color: 'text-blue-400' },
    { label: 'Autoriai', count: stats.authors, icon: Users, path: '/admin/authors', color: 'text-amber-400' },
    { label: 'Produktai', count: stats.products, icon: Package, path: '/admin/products', color: 'text-purple-400' },
  ];

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">Valdymo skydas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <Link
            key={c.path}
            to={c.path}
            className="rounded-xl border border-border/50 bg-card p-5 hover:border-primary/30 transition-colors"
          >
            <c.icon className={`w-5 h-5 ${c.color} mb-3`} />
            <p className="text-2xl font-bold text-foreground tabular-nums">{c.count}</p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
