import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { generateSlug } from '@/lib/slug';
import { toast } from 'sonner';
import { Save, Loader2, Plus, X } from 'lucide-react';

const AuthorEditor = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '', slug: '', bio: '', avatar_url: '', initials: '',
    seo_title: '', meta_description: '',
  });
  const [expertise, setExpertise] = useState<string[]>([]);

  useEffect(() => {
    if (!isNew && id) {
      supabase.from('authors').select('*').eq('id', id).single().then(({ data }) => {
        if (data) {
          setForm({
            name: data.name, slug: data.slug, bio: data.bio ?? '',
            avatar_url: data.avatar_url ?? '', initials: data.initials ?? '',
            seo_title: data.seo_title ?? '', meta_description: data.meta_description ?? '',
          });
          setExpertise((data.expertise as string[]) ?? []);
        }
      });
    }
  }, [id, isNew]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleNameChange = (name: string) => {
    set('name', name);
    if (isNew) {
      set('slug', generateSlug(name));
      const parts = name.split(' ');
      set('initials', parts.map(p => p[0]?.toUpperCase() || '').join('').slice(0, 2));
    }
  };

  const save = async () => {
    if (!form.name.trim()) { toast.error('Įveskite vardą'); return; }
    setSaving(true);
    const payload = { ...form, expertise };
    let error;
    if (isNew) {
      const res = await supabase.from('authors').insert(payload).select('id').single();
      error = res.error;
      if (!error && res.data) navigate(`/admin/authors/${res.data.id}`, { replace: true });
    } else {
      error = (await supabase.from('authors').update(payload).eq('id', id!)).error;
    }
    setSaving(false);
    if (error) toast.error(error.message); else toast.success('Išsaugota!');
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold text-foreground">{isNew ? 'Naujas autorius' : 'Redaguoti autorių'}</h1>
        <Button size="sm" onClick={save} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />} Išsaugoti
        </Button>
      </div>
      <div className="space-y-4 max-w-2xl">
        <div><Label>Vardas</Label><Input value={form.name} onChange={e => handleNameChange(e.target.value)} className="mt-1" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Slug</Label><Input value={form.slug} onChange={e => set('slug', e.target.value)} className="mt-1" /></div>
          <div><Label>Inicialai</Label><Input value={form.initials} onChange={e => set('initials', e.target.value)} className="mt-1" maxLength={3} /></div>
        </div>
        <div><Label>Biografija</Label><Textarea value={form.bio} onChange={e => set('bio', e.target.value)} className="mt-1" rows={4} /></div>
        <div><Label>Avataro URL</Label><Input value={form.avatar_url} onChange={e => set('avatar_url', e.target.value)} className="mt-1" /></div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Ekspertizė</Label>
            <Button variant="ghost" size="sm" onClick={() => setExpertise([...expertise, ''])}><Plus className="w-4 h-4" /></Button>
          </div>
          {expertise.map((e, i) => (
            <div key={i} className="flex gap-1 mb-1">
              <Input value={e} onChange={ev => { const n = [...expertise]; n[i] = ev.target.value; setExpertise(n); }} />
              <Button variant="ghost" size="icon" onClick={() => setExpertise(expertise.filter((_, j) => j !== i))}><X className="w-4 h-4" /></Button>
            </div>
          ))}
        </div>
        <div><Label>SEO pavadinimas</Label><Input value={form.seo_title} onChange={e => set('seo_title', e.target.value)} className="mt-1" maxLength={60} /></div>
        <div><Label>Meta aprašymas</Label><Textarea value={form.meta_description} onChange={e => set('meta_description', e.target.value)} className="mt-1" rows={2} maxLength={160} /></div>
      </div>
    </AdminLayout>
  );
};

export default AuthorEditor;
