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
import { Save, Loader2 } from 'lucide-react';

const CategoryEditor = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '', slug: '', path: '', description: '',
    seo_title: '', meta_description: '', canonical_url: '',
  });

  useEffect(() => {
    if (!isNew && id) {
      supabase.from('categories').select('*').eq('id', id).single().then(({ data }) => {
        if (data) setForm({
          name: data.name, slug: data.slug, path: data.path,
          description: data.description ?? '', seo_title: data.seo_title ?? '',
          meta_description: data.meta_description ?? '', canonical_url: data.canonical_url ?? '',
        });
      });
    }
  }, [id, isNew]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleNameChange = (name: string) => {
    set('name', name);
    if (isNew) {
      const slug = generateSlug(name);
      set('slug', slug);
      set('path', `/${slug}`);
    }
  };

  const save = async () => {
    if (!form.name.trim()) { toast.error('Įveskite pavadinimą'); return; }
    setSaving(true);
    const payload = { ...form };
    let error;
    if (isNew) {
      const res = await supabase.from('categories').insert(payload).select('id').single();
      error = res.error;
      if (!error && res.data) navigate(`/admin/categories/${res.data.id}`, { replace: true });
    } else {
      error = (await supabase.from('categories').update(payload).eq('id', id!)).error;
    }
    setSaving(false);
    if (error) toast.error(error.message); else toast.success('Išsaugota!');
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold text-foreground">{isNew ? 'Nauja kategorija' : 'Redaguoti kategoriją'}</h1>
        <Button size="sm" onClick={save} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />} Išsaugoti
        </Button>
      </div>
      <div className="space-y-4 max-w-2xl">
        <div><Label>Pavadinimas</Label><Input value={form.name} onChange={e => handleNameChange(e.target.value)} className="mt-1" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Slug</Label><Input value={form.slug} onChange={e => set('slug', e.target.value)} className="mt-1" /></div>
          <div><Label>Kelias</Label><Input value={form.path} onChange={e => set('path', e.target.value)} className="mt-1" /></div>
        </div>
        <div><Label>Aprašymas</Label><Textarea value={form.description} onChange={e => set('description', e.target.value)} className="mt-1" rows={3} /></div>
        <div><Label>SEO pavadinimas</Label><Input value={form.seo_title} onChange={e => set('seo_title', e.target.value)} className="mt-1" maxLength={60} /></div>
        <div><Label>Meta aprašymas</Label><Textarea value={form.meta_description} onChange={e => set('meta_description', e.target.value)} className="mt-1" rows={2} maxLength={160} /></div>
        <div><Label>Canonical URL</Label><Input value={form.canonical_url} onChange={e => set('canonical_url', e.target.value)} className="mt-1" /></div>
      </div>
    </AdminLayout>
  );
};

export default CategoryEditor;
