import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-3 text-4xl font-heading font-bold text-foreground">404</h1>
        <p className="mb-4 text-base text-muted-foreground">Puslapis nerastas</p>
        <Link to="/" className="text-sm text-primary font-medium underline underline-offset-2 hover:text-primary/80 transition-colors">
          Grįžti į pradžią
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
