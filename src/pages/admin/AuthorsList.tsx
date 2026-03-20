import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const AuthorsList = () => {
  const [items, setItems] = useState<{ id: string; name: string; slug: string }[]>([]);

  const load = async () => {
    const { data } = await supabase.from('authors').select('id, name, slug').order('name');
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Ištrinti autorių?')) return;
    await supabase.from('authors').delete().eq('id', id);
    toast.success('Autorius ištrintas');
    load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Autoriai</h1>
        <Button asChild size="sm"><Link to="/admin/authors/new"><Plus className="w-4 h-4 mr-1" /> Naujas</Link></Button>
      </div>
      {items.length === 0 ? (
        <p className="text-muted-foreground">Nėra autorių.</p>
      ) : (
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border/40 bg-secondary/30">
              <th className="text-left p-3 font-medium">Vardas</th>
              <th className="text-left p-3 font-medium hidden sm:table-cell">Slug</th>
              <th className="text-right p-3 font-medium">Veiksmai</th>
            </tr></thead>
            <tbody>
              {items.map(a => (
                <tr key={a.id} className="border-b border-border/30 hover:bg-secondary/10">
                  <td className="p-3 text-foreground font-medium">{a.name}</td>
                  <td className="p-3 text-muted-foreground hidden sm:table-cell">{a.slug}</td>
                  <td className="p-3 text-right space-x-1">
                    <Button variant="ghost" size="icon" asChild><Link to={`/admin/authors/${a.id}`}><Pencil className="w-4 h-4" /></Link></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
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

export default AuthorsList;
