import { useEffect, useState, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2, Trash2, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface MediaItem {
  id: string;
  file_name: string;
  file_url: string;
  alt_text: string;
  mime_type: string | null;
  created_at: string;
}

const MediaLibrary = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    setItems((data as MediaItem[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file);
      if (uploadError) { toast.error(`Klaida: ${uploadError.message}`); continue; }

      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath);

      await supabase.from('media').insert({
        file_name: file.name,
        file_path: filePath,
        file_url: publicUrl,
        file_size: file.size,
        mime_type: file.type,
        alt_text: '',
      });
    }

    setUploading(false);
    toast.success('Failai įkelti!');
    load();
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm('Ištrinti failą?')) return;
    await supabase.storage.from('media').remove([item.file_name]);
    await supabase.from('media').delete().eq('id', item.id);
    toast.success('Failas ištrintas');
    load();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL nukopijuotas!');
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Media</h1>
        <div>
          <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
          <Button size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}
            Įkelti
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground">Nėra failų. Įkelkite pirmą!</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="rounded-xl border border-border/50 overflow-hidden bg-card group">
              <div className="aspect-square bg-secondary/30 flex items-center justify-center overflow-hidden">
                {item.mime_type?.startsWith('image') ? (
                  <img src={item.file_url} alt={item.alt_text} className="w-full h-full object-cover" />
                ) : (
                  <p className="text-xs text-muted-foreground">{item.file_name}</p>
                )}
              </div>
              <div className="p-2 space-y-1">
                <p className="text-xs text-foreground truncate">{item.file_name}</p>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyUrl(item.file_url)}>
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(item)}>
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default MediaLibrary;
