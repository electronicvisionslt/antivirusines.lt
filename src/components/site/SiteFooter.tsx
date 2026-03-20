import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const SiteFooter = () => (
  <footer className="bg-card border-t mt-16">
    <div className="container py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-3">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-bold text-foreground">antivirusines<span className="text-primary">.lt</span></span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Nepriklausomos antivirusinių programų apžvalgos ir kibernetinio saugumo patarimai lietuvių kalba.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-foreground mb-3">Kategorijos</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/antivirusines-programos" className="text-muted-foreground hover:text-primary transition-colors">Antivirusinės programos</Link></li>
            <li><Link to="/tevu-kontrole" className="text-muted-foreground hover:text-primary transition-colors">Tėvų kontrolė</Link></li>
            <li><Link to="/slaptazodziu-saugumas" className="text-muted-foreground hover:text-primary transition-colors">Slaptažodžių saugumas</Link></li>
            <li><Link to="/virusai/kompiuterinis-virusas" className="text-muted-foreground hover:text-primary transition-colors">Virusai</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-foreground mb-3">Informacija</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/apie" className="text-muted-foreground hover:text-primary transition-colors">Apie mus</Link></li>
            <li><Link to="/kontaktai" className="text-muted-foreground hover:text-primary transition-colors">Kontaktai</Link></li>
            <li><Link to="/autoriai/jonas-kazlauskas" className="text-muted-foreground hover:text-primary transition-colors">Autoriai</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-foreground mb-3">Teisinė informacija</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/affiliate-atskleidimas" className="text-muted-foreground hover:text-primary transition-colors">Affiliate atskleidimas</Link></li>
            <li><Link to="/privatumo-politika" className="text-muted-foreground hover:text-primary transition-colors">Privatumo politika</Link></li>
            <li><Link to="/slapuku-politika" className="text-muted-foreground hover:text-primary transition-colors">Slapukų politika</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} antivirusines.lt. Visos teisės saugomos. Kai kuriose nuorodose naudojami affiliate partnerių saitai.
        </p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
