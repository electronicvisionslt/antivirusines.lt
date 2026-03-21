import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const SiteFooter = () => (
  <footer className="border-t border-border/60 mt-20 bg-muted/40">
    <div className="container py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-3 group">
            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-heading font-bold text-sm text-foreground">
              antivirusines<span className="text-gradient-primary">.lt</span>
            </span>
          </Link>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
            Nepriklausomos antivirusinių programų apžvalgos ir kibernetinio saugumo patarimai lietuvių kalba.
          </p>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-xs text-foreground mb-3 uppercase tracking-wider">Temos</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/antivirusines-programos" className="text-muted-foreground hover:text-primary transition-colors duration-200">Antivirusinės programos</Link></li>
            <li><Link to="/tevu-kontrole" className="text-muted-foreground hover:text-primary transition-colors duration-200">Tėvų kontrolė</Link></li>
            <li><Link to="/slaptazodziu-saugumas" className="text-muted-foreground hover:text-primary transition-colors duration-200">Slaptažodžių saugumas</Link></li>
            <li><Link to="/virusai/kompiuterinis-virusas" className="text-muted-foreground hover:text-primary transition-colors duration-200">Virusai</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-xs text-foreground mb-3 uppercase tracking-wider">Populiariausi</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/antivirusines-programos" className="text-muted-foreground hover:text-primary transition-colors duration-200">Geriausios antivirusinės</Link></li>
            <li><Link to="/antivirusines-programos/nemokamos" className="text-muted-foreground hover:text-primary transition-colors duration-200">Nemokamos antivirusinės</Link></li>
            <li><Link to="/antivirusines-programos/telefonui" className="text-muted-foreground hover:text-primary transition-colors duration-200">Antivirusinė telefonui</Link></li>
            <li><Link to="/antivirusines-programos/kompiuteriui" className="text-muted-foreground hover:text-primary transition-colors duration-200">Antivirusinė kompiuteriui</Link></li>
            <li><Link to="/tevu-kontrole" className="text-muted-foreground hover:text-primary transition-colors duration-200">Tėvų kontrolė</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-xs text-foreground mb-3 uppercase tracking-wider">Projektas</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/apie" className="text-muted-foreground hover:text-primary transition-colors duration-200">Apie mus</Link></li>
            <li><Link to="/autoriai/jonas-kazlauskas" className="text-muted-foreground hover:text-primary transition-colors duration-200">Autoriai</Link></li>
            <li><Link to="/kontaktai" className="text-muted-foreground hover:text-primary transition-colors duration-200">Kontaktai</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-xs text-foreground mb-3 uppercase tracking-wider">Teisinė informacija</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/affiliate-atskleidimas" className="text-muted-foreground hover:text-primary transition-colors duration-200">Affiliate atskleidimas</Link></li>
            <li><Link to="/privatumo-politika" className="text-muted-foreground hover:text-primary transition-colors duration-200">Privatumo politika</Link></li>
            <li><Link to="/slapuku-politika" className="text-muted-foreground hover:text-primary transition-colors duration-200">Slapukų politika</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 pt-5 border-t border-border/60 text-center">
        <p className="text-[11px] text-muted-foreground/60">
          © {new Date().getFullYear()} antivirusines.lt. Visos teisės saugomos. Kai kuriose nuorodose naudojami affiliate partnerių saitai.
        </p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
