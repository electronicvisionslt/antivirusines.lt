import { forwardRef } from 'react';
import { Star, ExternalLink, Check, X, Monitor, Laptop, Smartphone, Globe } from 'lucide-react';
import type { PublicProduct } from '@/hooks/usePublicData';
import { toWebpPath } from '@/lib/articleImageContent';

/* ── ProductLogo ── */
export function ProductLogo({ product, size = 40 }: { product: PublicProduct; size?: number }) {
  if (product.logoUrl) {
    return (
      <div className="rounded-xl bg-white border border-border/40 flex items-center justify-center shrink-0 elevation-1 overflow-hidden"
           style={{ width: size + 12, height: size + 12 }}>
        <img src={product.logoUrl} alt={`${product.name} logotipas`} width={size} height={size} className="object-contain" loading="lazy" />
      </div>
    );
  }
  return (
    <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/12 flex items-center justify-center shrink-0 elevation-1"
         style={{ width: size + 12, height: size + 12 }}>
      <span className="font-heading font-bold text-primary" style={{ fontSize: size * 0.38 }}>
        {product.brand?.slice(0, 2).toUpperCase() || product.name.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

/* ── RatingStars ── */
export const RatingStars = forwardRef<HTMLDivElement, { rating: number }>(function RatingStars({ rating }, ref) {
  return (
    <div ref={ref} className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted-foreground/20'}`} />
      ))}
      <span className="ml-1.5 text-xs font-bold text-foreground tabular-nums">{rating.toFixed(1)}</span>
    </div>
  );
});

/* ── AffiliateButton ── */
export const AffiliateButton = forwardRef<HTMLAnchorElement, { product: PublicProduct; className?: string; label?: string }>(function AffiliateButton({ product, className = '', label }, ref) {
  if (!product.affiliateUrl) return null;
  return (
    <a ref={ref} href={product.affiliateUrl} target="_blank" rel="nofollow sponsored noopener noreferrer"
       className={`inline-flex items-center justify-center gap-1.5 font-heading font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.97] elevation-primary ${className}`}>
      {label || 'Apsilankyti'}<ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
});

/* ── FeatureCheck ── */
export function FeatureCheck({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="w-4 h-4 text-success mx-auto" />;
  if (value === false) return <X className="w-4 h-4 text-muted-foreground/25 mx-auto" />;
  return <span className="text-xs text-muted-foreground">{value}</span>;
}

/* ── PlatformTags ── */
export function PlatformTags({ platforms, maxItems = 4 }: { platforms: string[]; maxItems?: number }) {
  const icons: Record<string, typeof Monitor> = { Windows: Monitor, Mac: Laptop, Android: Smartphone, iOS: Smartphone, ChromeOS: Globe, Kindle: Globe };
  return (
    <div className="flex flex-wrap gap-1">
      {platforms.slice(0, maxItems).map(p => {
        const Icon = icons[p] || Globe;
        return (
          <span key={p} className="chip-muted">
            <Icon className="w-2.5 h-2.5" />{p}
          </span>
        );
      })}
    </div>
  );
}

/* ── SectionHeading ── */
export function SectionHeading({ label, title, subtitle, className = '' }: { label?: string; title: string; subtitle?: string; className?: string }) {
  return (
    <div className={className}>
      {label && <span className="section-label mb-2 block">{label}</span>}
      <h2 className="font-heading text-2xl font-bold text-foreground leading-tight">{title}</h2>
      {subtitle && <p className="text-muted-foreground text-sm mt-1.5 max-w-xl leading-relaxed">{subtitle}</p>}
    </div>
  );
}

/* ── LandingFeatureImage ── */
export function LandingFeatureImage({ src, alt }: { src?: string | null; alt?: string | null }) {
  if (!src) return null;

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-border/50">
      <picture>
        <source srcSet={toWebpPath(src)} type="image/webp" />
        <img src={src} alt={alt || ''} className="w-full h-auto object-cover" loading="eager" />
      </picture>
    </div>
  );
}

/* ── UpdatedLabel helper ── */
export function useUpdatedLabel() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
