import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-center">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Prieiga uždrausta</h1>
          <p className="text-muted-foreground">Neturite administratoriaus teisių.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
