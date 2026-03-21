import { ExternalLink } from 'lucide-react';

interface AffiliateCTAProps {
  productName: string;
  description: string;
  price?: string;
  affiliateUrl?: string | null;
  ctaText?: string;
}

const AffiliateCTA = ({ productName, description, price, affiliateUrl, ctaText = 'Išbandyti dabar' }: AffiliateCTAProps) => (
  <div className="my-8 rounded-lg border border-primary/12 bg-primary/[0.02] p-5">
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1">
        <p className="text-[10px] font-heading font-semibold text-primary uppercase tracking-[0.12em] mb-1">Redakcijos pasirinkimas</p>
        <h4 className="font-heading font-bold text-foreground text-base">{productName}</h4>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{description}</p>
        {price && <p className="text-sm font-semibold text-foreground mt-1.5">{price}</p>}
      </div>
      {affiliateUrl ? (
        <a
          href={affiliateUrl}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-heading font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200 active:scale-[0.97] text-sm shadow-sm"
        >
          {ctaText}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      ) : (
        <span className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-muted text-muted-foreground font-heading font-semibold rounded-lg text-sm cursor-default">
          {ctaText}
          <ExternalLink className="w-3.5 h-3.5" />
        </span>
      )}
    </div>
    <p className="text-[10px] text-muted-foreground/50 mt-3 pt-2.5 border-t border-border/40">* Ši nuoroda yra affiliate partnerio nuoroda. Jums tai nekainuoja papildomai.</p>
  </div>
);

export default AffiliateCTA;
