import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateSlug } from '@/lib/slug';
import { toast } from 'sonner';
import { Save, Eye, Loader2, Plus, X } from 'lucide-react';

interface FaqItem { q: string; a: string; }
interface SectionItem { id: string; title: string; content: string; }

const ArticleEditor = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);
  const [allProducts, setAllProducts] = useState<{ id: string; name: string }[]>([]);
  const [linkedProductIds, setLinkedProductIds] = useState<string[]>([]);
  const [primaryProductId, setPrimaryProductId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '', slug: '', path: '', excerpt: '', body: '',
    featured_image: '', featured_image_alt: '', article_type: 'guide',
    category_id: '', author_id: '', status: 'draft' as string,
    read_time: '', verdict: '', show_toc: true, noindex: false,
    seo_title: '', meta_description: '', canonical_url: '',
    og_title: '', og_description: '', og_image: '',
  });
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [sections, setSections] = useState<SectionItem[]>([]);

  useEffect(() => {
    const loadRefs = async () => {
      const [c, a, p] = await Promise.all([
        supabase.from('categories').select('id, name').order('name'),
        supabase.from('authors').select('id, name').order('name'),
        supabase.from('products').select('id, name').order('name'),
      ]);
      setCategories(c.data ?? []);
      setAuthors(a.data ?? []);
      setAllProducts(p.data ?? []);
    };
    loadRefs();

    if (!isNew && id) {
      supabase.from('articles').select('*').eq('id', id).single().then(({ data }) => {
        if (data) {
          setForm({
            title: data.title, slug: data.slug, path: data.path, excerpt: data.excerpt ?? '',
            body: data.body ?? '', featured_image: data.featured_image ?? '',
            featured_image_alt: data.featured_image_alt ?? '', article_type: data.article_type ?? 'guide',
            category_id: data.category_id ?? '', author_id: data.author_id ?? '',
            status: data.status, read_time: data.read_time ?? '', verdict: data.verdict ?? '',
            show_toc: data.show_toc ?? true, noindex: data.noindex ?? false,
            seo_title: data.seo_title ?? '', meta_description: data.meta_description ?? '',
            canonical_url: data.canonical_url ?? '', og_title: data.og_title ?? '',
            og_description: data.og_description ?? '', og_image: data.og_image ?? '',
          });
          setPros((data.pros as string[]) ?? []);
          setCons((data.cons as string[]) ?? []);
          setFaq((data.faq as unknown as FaqItem[]) ?? []);
          setSections((data.sections as unknown as SectionItem[]) ?? []);
        }
      });
      // Load linked products with sort_order
      supabase.from('article_products').select('product_id, sort_order').eq('article_id', id).order('sort_order', { ascending: true }).then(({ data: links }) => {
        const ids = (links || []).map((l: any) => l.product_id);
        setLinkedProductIds(ids);
        // Primary = sort_order 0 (first)
        if (ids.length > 0) setPrimaryProductId(ids[0]);
      });
    }
  }, [id, isNew]);

  const set = (key: string, val: string | boolean) => setForm(f => ({ ...f, [key]: val }));

  const handleTitleChange = (title: string) => {
    set('title', title);
    if (isNew) {
      const slug = generateSlug(title);
      set('slug', slug);
    }
  };

  const save = async (publishAction?: 'publish' | 'unpublish') => {
    if (!form.title.trim()) { toast.error('Įveskite pavadinimą'); return; }
    if (!form.slug.trim()) { toast.error('Slug laukas privalomas'); return; }
    setSaving(true);

    let status: 'draft' | 'published' | 'archived' = form.status as 'draft' | 'published' | 'archived';
    if (publishAction === 'publish') status = 'published';
    if (publishAction === 'unpublish') status = 'draft';

    const path = form.path || `/${form.slug}`;

    // Only set published_at when first publishing
    let published_at: string | null = null;
    if (status === 'published') {
      if (publishAction === 'publish') {
        // Explicitly publishing — set timestamp
        published_at = new Date().toISOString();
      }
      // If already published and just saving, don't change published_at
      // (it will keep its current DB value since we omit it from the update)
    }

    const payload: Record<string, unknown> = {
      title: form.title, slug: form.slug, path, excerpt: form.excerpt, body: form.body,
      featured_image: form.featured_image || null, featured_image_alt: form.featured_image_alt || null,
      article_type: form.article_type, category_id: form.category_id || null,
      author_id: form.author_id || null, status, read_time: form.read_time,
      verdict: form.verdict || null, show_toc: form.show_toc, noindex: form.noindex,
      seo_title: form.seo_title || null, meta_description: form.meta_description || null,
      canonical_url: form.canonical_url || null, og_title: form.og_title || null,
      og_description: form.og_description || null, og_image: form.og_image || null,
      pros, cons, faq: JSON.parse(JSON.stringify(faq)),
      sections: JSON.parse(JSON.stringify(sections)),
    };

    // Only include published_at when explicitly changing publish state
    if (publishAction === 'publish') {
      payload.published_at = published_at;
    } else if (publishAction === 'unpublish') {
      payload.published_at = null;
    }

    let error;
    let articleId = id;
    if (isNew) {
      const res = await supabase.from('articles').insert(payload as any).select('id').single();
      error = res.error;
      if (!error && res.data) {
        articleId = (res.data as any).id;
        navigate(`/admin/articles/${articleId}`, { replace: true });
      }
    } else {
      const res = await supabase.from('articles').update(payload as any).eq('id', id!);
      error = res.error;
    }

    // Save product links with explicit primary (sort_order 0)
    if (!error && articleId) {
      await supabase.from('article_products').delete().eq('article_id', articleId);
      if (linkedProductIds.length > 0) {
        // Primary product gets sort_order 0, rest get 1+
        const ordered = primaryProductId && linkedProductIds.includes(primaryProductId)
          ? [primaryProductId, ...linkedProductIds.filter(id => id !== primaryProductId)]
          : linkedProductIds;
        await supabase.from('article_products').insert(
          ordered.map((pid, index) => ({ article_id: articleId!, product_id: pid, sort_order: index } as any))
        );
      }
    }

    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success('Išsaugota!');
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h1 className="font-heading text-xl font-bold text-foreground">
          {isNew ? 'Naujas straipsnis' : 'Redaguoti straipsnį'}
        </h1>
        <div className="flex gap-2">
          {form.status === 'published' ? (
            <Button variant="outline" size="sm" onClick={() => save('unpublish')} disabled={saving}>
              Atšaukti publikavimą
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => save('publish')} disabled={saving}>
              <Eye className="w-4 h-4 mr-1" /> Publikuoti
            </Button>
          )}
          <Button size="sm" onClick={() => save()} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
            Išsaugoti
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content">
        <TabsList className="mb-4">
          <TabsTrigger value="content">Turinys</TabsTrigger>
          <TabsTrigger value="details">Detalės</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="faq">DUK</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div>
            <Label>Pavadinimas</Label>
            <Input value={form.title} onChange={e => handleTitleChange(e.target.value)} className="mt-1" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Slug</Label>
              <Input value={form.slug} onChange={e => set('slug', e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Kelias (path)</Label>
              <Input value={form.path} onChange={e => set('path', e.target.value)} placeholder="/kategorija/slug" className="mt-1" />
            </div>
          </div>
          <div>
            <Label>Santrauka</Label>
            <Textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} className="mt-1" rows={2} />
          </div>
          <div>
            <Label>Turinys (body)</Label>
            <Textarea value={form.body} onChange={e => set('body', e.target.value)} className="mt-1 font-mono text-sm" rows={12} />
          </div>

          {/* Sections */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Skiltys</Label>
              <Button variant="ghost" size="sm" onClick={() => setSections([...sections, { id: generateSlug(`section-${sections.length + 1}`), title: '', content: '' }])}>
                <Plus className="w-4 h-4 mr-1" /> Pridėti
              </Button>
            </div>
            {sections.map((s, i) => (
              <div key={i} className="border border-border/40 rounded-lg p-3 mb-2 space-y-2">
                <div className="flex gap-2">
                  <Input placeholder="ID" value={s.id} onChange={e => { const n = [...sections]; n[i].id = e.target.value; setSections(n); }} className="w-32" />
                  <Input placeholder="Antraštė" value={s.title} onChange={e => { const n = [...sections]; n[i].title = e.target.value; setSections(n); }} className="flex-1" />
                  <Button variant="ghost" size="icon" onClick={() => setSections(sections.filter((_, j) => j !== i))}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea placeholder="Turinys" value={s.content} onChange={e => { const n = [...sections]; n[i].content = e.target.value; setSections(n); }} rows={3} />
              </div>
            ))}
          </div>

          {/* Pros / Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Privalumai</Label>
                <Button variant="ghost" size="sm" onClick={() => setPros([...pros, ''])}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {pros.map((p, i) => (
                <div key={i} className="flex gap-1 mb-1">
                  <Input value={p} onChange={e => { const n = [...pros]; n[i] = e.target.value; setPros(n); }} />
                  <Button variant="ghost" size="icon" onClick={() => setPros(pros.filter((_, j) => j !== i))}><X className="w-4 h-4" /></Button>
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Trūkumai</Label>
                <Button variant="ghost" size="sm" onClick={() => setCons([...cons, ''])}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {cons.map((c, i) => (
                <div key={i} className="flex gap-1 mb-1">
                  <Input value={c} onChange={e => { const n = [...cons]; n[i] = e.target.value; setCons(n); }} />
                  <Button variant="ghost" size="icon" onClick={() => setCons(cons.filter((_, j) => j !== i))}><X className="w-4 h-4" /></Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Verdiktas</Label>
            <Textarea value={form.verdict} onChange={e => set('verdict', e.target.value)} className="mt-1" rows={3} />
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Kategorija</Label>
              <Select value={form.category_id} onValueChange={v => set('category_id', v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Pasirinkite" /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Autorius</Label>
              <Select value={form.author_id} onValueChange={v => set('author_id', v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Pasirinkite" /></SelectTrigger>
                <SelectContent>
                  {authors.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Straipsnio tipas</Label>
              <Input value={form.article_type} onChange={e => set('article_type', e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Skaitymo laikas</Label>
              <Input value={form.read_time} onChange={e => set('read_time', e.target.value)} className="mt-1" placeholder="12 min" />
            </div>
            <div>
              <Label>Statusas</Label>
              <Select value={form.status} onValueChange={v => set('status', v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Juodraštis</SelectItem>
                  <SelectItem value="published">Publikuotas</SelectItem>
                  <SelectItem value="archived">Archyvuotas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Pagrindinė nuotrauka (URL)</Label>
              <Input value={form.featured_image} onChange={e => set('featured_image', e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Nuotraukos alt tekstas</Label>
              <Input value={form.featured_image_alt} onChange={e => set('featured_image_alt', e.target.value)} className="mt-1" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={form.show_toc} onCheckedChange={v => set('show_toc', v)} />
              <Label>Rodyti turinį</Label>
            </div>
          </div>

          {/* Product links */}
          <div>
            <Label className="text-base font-semibold mb-2 block">Susiję produktai (affiliate CTA)</Label>
            <p className="text-xs text-muted-foreground mb-2">Pažymėkite susijusius produktus ir pasirinkite pagrindinį CTA produktą.</p>
            <div className="space-y-2">
              {/* Show linked products first, then unlinked */}
              {[...allProducts].sort((a, b) => {
                const aLinked = linkedProductIds.includes(a.id);
                const bLinked = linkedProductIds.includes(b.id);
                if (aLinked && !bLinked) return -1;
                if (!aLinked && bLinked) return 1;
                return 0;
              }).map(p => {
                const isLinked = linkedProductIds.includes(p.id);
                const isPrimary = primaryProductId === p.id;
                return (
                  <div key={p.id} className={`flex items-center gap-3 rounded-lg px-3 py-2 ${isLinked ? 'bg-secondary/40' : ''}`}>
                    <input
                      type="checkbox"
                      checked={isLinked}
                      onChange={e => {
                        if (e.target.checked) {
                          setLinkedProductIds(prev => [...prev, p.id]);
                          // Auto-set primary if first product
                          if (linkedProductIds.length === 0) setPrimaryProductId(p.id);
                        } else {
                          setLinkedProductIds(prev => prev.filter(id => id !== p.id));
                          if (isPrimary) setPrimaryProductId(null);
                        }
                      }}
                      className="rounded border-border shrink-0"
                    />
                    <span className="text-sm text-foreground flex-1">{p.name}</span>
                    {isLinked && (
                      <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                        <input
                          type="radio"
                          name="primary-product"
                          checked={isPrimary}
                          onChange={() => setPrimaryProductId(p.id)}
                          className="accent-primary"
                        />
                        <span className={`text-xs ${isPrimary ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                          Pagrindinis CTA
                        </span>
                      </label>
                    )}
                  </div>
                );
              })}
              {allProducts.length === 0 && (
                <p className="text-sm text-muted-foreground">Nėra produktų. Sukurkite produktą pirmiausia.</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <div>
            <Label>SEO pavadinimas</Label>
            <Input value={form.seo_title} onChange={e => set('seo_title', e.target.value)} className="mt-1" maxLength={60} />
            <p className="text-xs text-muted-foreground mt-1">{form.seo_title.length}/60</p>
          </div>
          <div>
            <Label>Meta aprašymas</Label>
            <Textarea value={form.meta_description} onChange={e => set('meta_description', e.target.value)} className="mt-1" rows={2} maxLength={160} />
            <p className="text-xs text-muted-foreground mt-1">{form.meta_description.length}/160</p>
          </div>
          <div>
            <Label>Canonical URL</Label>
            <Input value={form.canonical_url} onChange={e => set('canonical_url', e.target.value)} className="mt-1" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>OG pavadinimas</Label>
              <Input value={form.og_title} onChange={e => set('og_title', e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>OG aprašymas</Label>
              <Input value={form.og_description} onChange={e => set('og_description', e.target.value)} className="mt-1" />
            </div>
          </div>
          <div>
            <Label>OG nuotrauka (URL)</Label>
            <Input value={form.og_image} onChange={e => set('og_image', e.target.value)} className="mt-1" />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.noindex} onCheckedChange={v => set('noindex', v)} />
            <Label>Noindex</Label>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-base font-semibold">DUK klausimai</Label>
            <Button variant="ghost" size="sm" onClick={() => setFaq([...faq, { q: '', a: '' }])}>
              <Plus className="w-4 h-4 mr-1" /> Pridėti
            </Button>
          </div>
          {faq.map((item, i) => (
            <div key={i} className="border border-border/40 rounded-lg p-3 space-y-2">
              <div className="flex gap-2">
                <Input placeholder="Klausimas" value={item.q} onChange={e => { const n = [...faq]; n[i].q = e.target.value; setFaq(n); }} className="flex-1" />
                <Button variant="ghost" size="icon" onClick={() => setFaq(faq.filter((_, j) => j !== i))}><X className="w-4 h-4" /></Button>
              </div>
              <Textarea placeholder="Atsakymas" value={item.a} onChange={e => { const n = [...faq]; n[i].a = e.target.value; setFaq(n); }} rows={2} />
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default ArticleEditor;
