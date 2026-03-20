import { useState } from 'react';
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
  const [setupSecret, setSetupSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSetup) {
      if (!setupSecret.trim()) {
        setError('Nustatymo kodas privalomas');
        setLoading(false);
        return;
      }
      if (password.length < 8) {
        setError('Slaptažodis turi būti bent 8 simbolių');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fnError } = await supabase.functions.invoke('setup-admin', {
          body: { email, password, setup_secret: setupSecret },
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

        toast.success('Administratorius sukurtas!');
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setError('Administratorius sukurtas. Prisijunkite naudodami formą.');
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
          {isSetup && (
            <div>
              <Label htmlFor="setup-secret">Nustatymo kodas</Label>
              <Input
                id="setup-secret"
                type="password"
                value={setupSecret}
                onChange={e => setSetupSecret(e.target.value)}
                required
                placeholder="ADMIN_SETUP_SECRET reikšmė"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Šis kodas nustatytas serveryje kaip ADMIN_SETUP_SECRET
              </p>
            </div>
          )}
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
              minLength={isSetup ? 8 : undefined}
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
