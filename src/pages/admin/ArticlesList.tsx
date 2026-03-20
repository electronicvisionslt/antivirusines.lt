import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ArticleRow {
  id: string;
  title: string;
  slug: string;
  path: string;
  status: string;
  updated_at: string;
  authors?: { name: string } | null;
  categories?: { name: string } | null;
}

const ArticlesList = () => {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase
      .from('articles')
      .select('id, title, slug, path, status, updated_at, authors:author_id(name), categories:category_id(name)')
      .order('updated_at', { ascending: false });
    setArticles((data as unknown as ArticleRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Ar tikrai norite ištrinti šį straipsnį?')) return;
    await supabase.from('articles').delete().eq('id', id);
    toast.success('Straipsnis ištrintas');
    load();
  };

  const statusColor = (s: string) => {
    if (s === 'published') return 'default';
    if (s === 'draft') return 'secondary';
    return 'outline';
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Straipsniai</h1>
        <Button asChild size="sm">
          <Link to="/admin/articles/new"><Plus className="w-4 h-4 mr-1" /> Naujas</Link>
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Kraunama...</p>
      ) : articles.length === 0 ? (
        <p className="text-muted-foreground">Nėra straipsnių. Sukurkite pirmą!</p>
      ) : (
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-secondary/30">
                <th className="text-left p-3 font-medium text-foreground">Pavadinimas</th>
                <th className="text-left p-3 font-medium text-foreground hidden md:table-cell">Kategorija</th>
                <th className="text-left p-3 font-medium text-foreground hidden sm:table-cell">Statusas</th>
                <th className="text-right p-3 font-medium text-foreground">Veiksmai</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(a => (
                <tr key={a.id} className="border-b border-border/30 hover:bg-secondary/10">
                  <td className="p-3">
                    <p className="font-medium text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.path}</p>
                  </td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground">
                    {(a.categories as unknown as { name: string })?.name ?? '—'}
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    <Badge variant={statusColor(a.status)}>{a.status}</Badge>
                  </td>
                  <td className="p-3 text-right space-x-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/admin/articles/${a.id}`}><Pencil className="w-4 h-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default ArticlesList;
