import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Loader2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
  const [isSetup, setIsSetup] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if any admin exists - use the edge function approach
    // Since user_roles SELECT requires admin, we check by trying to invoke the setup function status
    const checkAdminExists = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('setup-admin', {
          method: 'POST',
          body: { email: 'check@check.check', password: 'checkcheck' },
        });
        // If we get "admin already exists" error, hasAdmin = true
        if (error || data?.error?.includes('jau egzistuoja')) {
          setHasAdmin(true);
        } else {
          // If the function would succeed, an admin was just created — roll back not possible
          // So this approach is flawed. Instead let's use a simpler check.
          setHasAdmin(true);
        }
      } catch {
        // If edge function not deployed yet, assume setup mode
        setHasAdmin(false);
      }
    };

    // Simpler approach: try to count authors (public table) as a proxy
    // Actually, just show both options and let the edge function gate it
    setHasAdmin(null); // Will show login by default, setup as toggle
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSetup) {
      // Create first admin via edge function
      try {
        const { data, error: fnError } = await supabase.functions.invoke('setup-admin', {
          body: { email, password },
        });

        if (fnError) {
          setError(fnError.message || 'Klaida kuriant administratorių');
          setLoading(false);
          return;
        }

        if (data?.error) {
          setError(data.error);
          setLoading(false);
          return;
        }

        // Admin created, now sign in
        toast.success('Administratorius sukurtas!');
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setError('Administratorius sukurtas, bet nepavyko prisijungti. Bandykite prisijungti.');
          setIsSetup(false);
          setLoading(false);
          return;
        }
        navigate('/admin');
      } catch (err: any) {
        setError(err.message || 'Nežinoma klaida');
        setLoading(false);
      }
    } else {
      // Normal login
      const { error } = await signIn(email, password);
      if (error) {
        setError('Neteisingi prisijungimo duomenys');
        setLoading(false);
      } else {
        navigate('/admin');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {isSetup ? 'Pirmas administratorius' : 'Administratoriaus prisijungimas'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">antivirusines.lt turinio valdymas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">El. paštas</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Slaptažodis</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete={isSetup ? 'new-password' : 'current-password'}
              minLength={isSetup ? 6 : undefined}
              className="mt-1"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isSetup ? 'Sukurti administratorių' : 'Prisijungti'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => { setIsSetup(!isSetup); setError(''); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            {isSetup ? 'Grįžti į prisijungimą' : 'Sukurti pirmą administratorių'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
