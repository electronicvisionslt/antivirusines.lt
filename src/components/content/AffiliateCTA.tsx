import { ExternalLink } from 'lucide-react';

interface AffiliateCTAProps {
  productName: string;
  description: string;
  price?: string;
  ctaText?: string;
}

const AffiliateCTA = ({ productName, description, price, ctaText = 'Išbandyti dabar' }: AffiliateCTAProps) => (
  <div className="my-8 rounded-lg border-2 border-primary/20 bg-primary/3 p-6">
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1">
        <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">Redakcijos pasirinkimas</p>
        <h4 className="font-bold text-foreground text-lg">{productName}</h4>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        {price && <p className="text-sm font-semibold text-foreground mt-2">{price}</p>}
      </div>
      <button className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors active:scale-[0.97] text-sm">
        {ctaText}
        <ExternalLink className="w-4 h-4" />
      </button>
    </div>
    <p className="text-[11px] text-muted-foreground mt-3">* Ši nuoroda yra affiliate partnerio nuoroda. Jums tai nekainuoja papildomai.</p>
  </div>
);

export default AffiliateCTA;
