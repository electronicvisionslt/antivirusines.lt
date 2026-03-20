import { ExternalLink } from 'lucide-react';

interface AffiliateCTAProps {
  productName: string;
  description: string;
  price?: string;
  ctaText?: string;
}

const AffiliateCTA = ({ productName, description, price, ctaText = 'Išbandyti dabar' }: AffiliateCTAProps) => (
  <div className="my-8 rounded-xl border border-primary/15 bg-primary/[0.03] p-6 glow-border relative overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
      <div className="flex-1">
        <p className="text-[11px] font-heading font-semibold text-primary uppercase tracking-[0.12em] mb-1.5">Redakcijos pasirinkimas</p>
        <h4 className="font-heading font-bold text-foreground text-lg">{productName}</h4>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{description}</p>
        {price && <p className="text-sm font-semibold text-foreground mt-2">{price}</p>}
      </div>
      <button className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-heading font-semibold rounded-lg hover:bg-accent/90 transition-all duration-200 active:scale-[0.97] text-sm glow-accent">
        {ctaText}
        <ExternalLink className="w-4 h-4" />
      </button>
    </div>
    <p className="text-[11px] text-muted-foreground/60 mt-4 pt-3 border-t border-border/40">* Ši nuoroda yra affiliate partnerio nuoroda. Jums tai nekainuoja papildomai.</p>
  </div>
);

export default AffiliateCTA;