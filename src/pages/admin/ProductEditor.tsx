import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateSlug } from '@/lib/slug';
import { toast } from 'sonner';
import { Save, Loader2, Plus, X } from 'lucide-react';

const ProductEditor = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '', slug: '', brand: '', short_description: '', long_description: '',
    logo_url: '', hero_image_url: '', pricing_summary: '', best_for: '',
    verdict: '', rating: '0', affiliate_url: '', affiliate_disclosure: '',
    free_version: false, trial_available: false,
    seo_title: '', meta_description: '', canonical_url: '',
    product_category: 'antivirus', is_active: true,
  });
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);

  useEffect(() => {
    if (!isNew && id) {
      supabase.from('products').select('*').eq('id', id).single().then(({ data }) => {
        if (data) {
          setForm({
            name: data.name, slug: data.slug, brand: data.brand ?? '',
            short_description: data.short_description ?? '', long_description: data.long_description ?? '',
            logo_url: data.logo_url ?? '', hero_image_url: data.hero_image_url ?? '',
            pricing_summary: data.pricing_summary ?? '', best_for: data.best_for ?? '',
            verdict: data.verdict ?? '', rating: String(data.rating ?? 0),
            affiliate_url: data.affiliate_url ?? '', affiliate_disclosure: data.affiliate_disclosure ?? '',
            free_version: data.free_version ?? false, trial_available: data.trial_available ?? false,
            seo_title: data.seo_title ?? '', meta_description: data.meta_description ?? '',
            canonical_url: data.canonical_url ?? '',
            product_category: (data as any).product_category ?? 'antivirus',
            is_active: (data as any).is_active ?? true,
          });
          setPros((data.pros as string[]) ?? []);
          setCons((data.cons as string[]) ?? []);
          setPlatforms((data.supported_platforms as string[]) ?? []);
        }
      });
    }
  }, [id, isNew]);

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name.trim()) { toast.error('Įveskite pavadinimą'); return; }
    setSaving(true);
    const payload = {
      ...form, rating: parseFloat(form.rating) || 0,
      pros, cons, supported_platforms: platforms,
    };
    let error;
    if (isNew) {
      const res = await supabase.from('products').insert(payload).select('id').single();
      error = res.error;
      if (!error && res.data) navigate(`/admin/products/${res.data.id}`, { replace: true });
    } else {
      error = (await supabase.from('products').update(payload).eq('id', id!)).error;
    }
    setSaving(false);
    if (error) toast.error(error.message); else toast.success('Išsaugota!');
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-xl font-bold text-foreground">{isNew ? 'Naujas produktas' : 'Redaguoti produktą'}</h1>
        <Button size="sm" onClick={save} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />} Išsaugoti
        </Button>
      </div>
      <Tabs defaultValue="info">
        <TabsList className="mb-4">
          <TabsTrigger value="info">Informacija</TabsTrigger>
          <TabsTrigger value="review">Apžvalga</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4 max-w-2xl">
          <div><Label>Pavadinimas</Label><Input value={form.name} onChange={e => { set('name', e.target.value); if (isNew) set('slug', generateSlug(e.target.value)); }} className="mt-1" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Slug</Label><Input value={form.slug} onChange={e => set('slug', e.target.value)} className="mt-1" /></div>
            <div><Label>Gamintojas</Label><Input value={form.brand} onChange={e => set('brand', e.target.value)} className="mt-1" /></div>
          </div>
          <div><Label>Trumpas aprašymas</Label><Textarea value={form.short_description} onChange={e => set('short_description', e.target.value)} className="mt-1" rows={2} /></div>
          <div><Label>Pilnas aprašymas</Label><Textarea value={form.long_description} onChange={e => set('long_description', e.target.value)} className="mt-1" rows={6} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Logo URL</Label><Input value={form.logo_url} onChange={e => set('logo_url', e.target.value)} className="mt-1" /></div>
            <div><Label>Hero nuotrauka URL</Label><Input value={form.hero_image_url} onChange={e => set('hero_image_url', e.target.value)} className="mt-1" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Kainodara</Label><Input value={form.pricing_summary} onChange={e => set('pricing_summary', e.target.value)} className="mt-1" /></div>
            <div><Label>Reitingas</Label><Input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => set('rating', e.target.value)} className="mt-1" /></div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2"><Switch checked={form.free_version} onCheckedChange={v => set('free_version', v)} /><Label>Nemokama versija</Label></div>
            <div className="flex items-center gap-2"><Switch checked={form.trial_available} onCheckedChange={v => set('trial_available', v)} /><Label>Bandomasis laikotarpis</Label></div>
            <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => set('is_active', v)} /><Label>Aktyvus</Label></div>
          </div>
          <div>
            <Label>Produkto kategorija</Label>
            <Select value={form.product_category} onValueChange={v => set('product_category', v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="antivirus">Antivirusinės</SelectItem>
                <SelectItem value="parental-control">Tėvų kontrolė</SelectItem>
                <SelectItem value="password-manager">Slaptažodžių tvarkyklė</SelectItem>
                <SelectItem value="vpn">VPN</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2"><Label>Platformos</Label><Button variant="ghost" size="sm" onClick={() => setPlatforms([...platforms, ''])}><Plus className="w-4 h-4" /></Button></div>
            {platforms.map((p, i) => (
              <div key={i} className="flex gap-1 mb-1">
                <Input value={p} onChange={e => { const n = [...platforms]; n[i] = e.target.value; setPlatforms(n); }} />
                <Button variant="ghost" size="icon" onClick={() => setPlatforms(platforms.filter((_, j) => j !== i))}><X className="w-4 h-4" /></Button>
              </div>
            ))}
          </div>
          <div><Label>Affiliate URL</Label><Input value={form.affiliate_url} onChange={e => set('affiliate_url', e.target.value)} className="mt-1" /></div>
          <div><Label>Affiliate atskleidimas</Label><Textarea value={form.affiliate_disclosure} onChange={e => set('affiliate_disclosure', e.target.value)} className="mt-1" rows={2} /></div>
        </TabsContent>

        <TabsContent value="review" className="space-y-4 max-w-2xl">
          <div><Label>Geriausia kam</Label><Input value={form.best_for} onChange={e => set('best_for', e.target.value)} className="mt-1" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2"><Label>Privalumai</Label><Button variant="ghost" size="sm" onClick={() => setPros([...pros, ''])}><Plus className="w-4 h-4" /></Button></div>
              {pros.map((p, i) => (<div key={i} className="flex gap-1 mb-1"><Input value={p} onChange={e => { const n = [...pros]; n[i] = e.target.value; setPros(n); }} /><Button variant="ghost" size="icon" onClick={() => setPros(pros.filter((_, j) => j !== i))}><X className="w-4 h-4" /></Button></div>))}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2"><Label>Trūkumai</Label><Button variant="ghost" size="sm" onClick={() => setCons([...cons, ''])}><Plus className="w-4 h-4" /></Button></div>
              {cons.map((c, i) => (<div key={i} className="flex gap-1 mb-1"><Input value={c} onChange={e => { const n = [...cons]; n[i] = e.target.value; setCons(n); }} /><Button variant="ghost" size="icon" onClick={() => setCons(cons.filter((_, j) => j !== i))}><X className="w-4 h-4" /></Button></div>))}
            </div>
          </div>
          <div><Label>Verdiktas</Label><Textarea value={form.verdict} onChange={e => set('verdict', e.target.value)} className="mt-1" rows={3} /></div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4 max-w-2xl">
          <div><Label>SEO pavadinimas</Label><Input value={form.seo_title} onChange={e => set('seo_title', e.target.value)} className="mt-1" maxLength={60} /></div>
          <div><Label>Meta aprašymas</Label><Textarea value={form.meta_description} onChange={e => set('meta_description', e.target.value)} className="mt-1" rows={2} maxLength={160} /></div>
          <div><Label>Canonical URL</Label><Input value={form.canonical_url} onChange={e => set('canonical_url', e.target.value)} className="mt-1" /></div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default ProductEditor;
