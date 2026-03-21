import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const SiteFooter = () => (
  <footer className="border-t border-border/50 mt-20 bg-card/50">
    <div className="container py-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 mb-4 group">
            <div className="w-7 h-7 rounded-md bg-primary/15 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <span className="font-heading font-bold text-foreground">
              antivirusines<span className="text-gradient-primary">.lt</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Nepriklausomos antivirusinių programų apžvalgos ir kibernetinio saugumo patarimai lietuvių kalba.
          </p>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-sm text-foreground mb-4 uppercase tracking-wider text-[13px]">Temos</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/antivirusines-programos" className="text-muted-foreground hover:text-primary transition-colors duration-200">Antivirusinės programos</Link></li>
            <li><Link to="/tevu-kontrole" className="text-muted-foreground hover:text-primary transition-colors duration-200">Tėvų kontrolė</Link></li>
            <li><Link to="/slaptazodziu-saugumas" className="text-muted-foreground hover:text-primary transition-colors duration-200">Slaptažodžių saugumas</Link></li>
            <li><Link to="/virusai/kompiuterinis-virusas" className="text-muted-foreground hover:text-primary transition-colors duration-200">Virusai</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-sm text-foreground mb-4 uppercase tracking-wider text-[13px]">Populiariausi</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/antivirusines-programos" className="text-muted-foreground hover:text-primary transition-colors duration-200">Geriausios antivirusinės</Link></li>
            <li><Link to="/antivirusines-programos/nemokamos" className="text-muted-foreground hover:text-primary transition-colors duration-200">Nemokamos antivirusinės</Link></li>
            <li><Link to="/antivirusines-programos/telefonui" className="text-muted-foreground hover:text-primary transition-colors duration-200">Antivirusinė telefonui</Link></li>
            <li><Link to="/antivirusines-programos/kompiuteriui" className="text-muted-foreground hover:text-primary transition-colors duration-200">Antivirusinė kompiuteriui</Link></li>
            <li><Link to="/tevu-kontrole" className="text-muted-foreground hover:text-primary transition-colors duration-200">Tėvų kontrolė</Link></li>
            <li><Link to="/virusai/kompiuterinis-virusas" className="text-muted-foreground hover:text-primary transition-colors duration-200">Kompiuterinis virusas</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-sm text-foreground mb-4 uppercase tracking-wider text-[13px]">Projektas</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/apie" className="text-muted-foreground hover:text-primary transition-colors duration-200">Apie mus</Link></li>
            <li><Link to="/autoriai/jonas-kazlauskas" className="text-muted-foreground hover:text-primary transition-colors duration-200">Autoriai</Link></li>
            <li><Link to="/kontaktai" className="text-muted-foreground hover:text-primary transition-colors duration-200">Kontaktai</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-sm text-foreground mb-4 uppercase tracking-wider text-[13px]">Teisinė informacija</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/affiliate-atskleidimas" className="text-muted-foreground hover:text-primary transition-colors duration-200">Affiliate atskleidimas</Link></li>
            <li><Link to="/privatumo-politika" className="text-muted-foreground hover:text-primary transition-colors duration-200">Privatumo politika</Link></li>
            <li><Link to="/slapuku-politika" className="text-muted-foreground hover:text-primary transition-colors duration-200">Slapukų politika</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-border/50 text-center">
        <p className="text-xs text-muted-foreground/70">
          © {new Date().getFullYear()} antivirusines.lt. Visos teisės saugomos. Kai kuriose nuorodose naudojami affiliate partnerių saitai.
        </p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
