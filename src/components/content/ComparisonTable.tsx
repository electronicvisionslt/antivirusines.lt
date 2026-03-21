import { Check, X, Star } from 'lucide-react';
import type { PublicProduct } from '@/hooks/usePublicData';

const ComparisonTable = ({ products, title = 'Antivirusinių programų palyginimas' }: { products: PublicProduct[]; title?: string }) => {
  if (products.length === 0) return null;
  const featureKeys = Object.keys(products[0].features);

  return (
    <section className="my-10">
      <h2 className="font-heading text-xl font-bold text-foreground mb-4">{title}</h2>
      <div className="overflow-x-auto rounded-xl border border-border/60 bg-card glow-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-muted/40">
              <th className="text-left p-3.5 font-heading font-semibold text-foreground text-xs">Programa</th>
              <th className="text-center p-3.5 font-heading font-semibold text-foreground text-xs">Įvertinimas</th>
              <th className="text-center p-3.5 font-heading font-semibold text-foreground text-xs">Kaina</th>
              {featureKeys.map(k => (
                <th key={k} className="text-center p-3.5 font-heading font-semibold text-foreground text-xs whitespace-nowrap">{k}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <tr key={product.id || product.name} className={`${i < products.length - 1 ? 'border-b border-border/40' : ''} hover:bg-muted/30 transition-colors duration-150`}>
                <td className="p-3.5 font-medium text-foreground">
                {product.affiliateUrl ? (
                    <a href={product.affiliateUrl} target="_blank" rel="nofollow sponsored noopener noreferrer" className="hover:text-primary transition-colors">
                      {product.name}
                    </a>
                  ) : product.name}
                </td>
                <td className="p-3.5 text-center">
                  <span className="inline-flex items-center gap-1 font-semibold text-foreground text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {product.rating}
                  </span>
                </td>
                <td className="p-3.5 text-center text-muted-foreground whitespace-nowrap text-xs">{product.pricingSummary}</td>
                {featureKeys.map(k => {
                  const val = product.features[k];
                  return (
                    <td key={k} className="p-3.5 text-center">
                      {val === true ? <Check className="w-4 h-4 text-success mx-auto" /> :
                       val === false ? <X className="w-4 h-4 text-muted-foreground/25 mx-auto" /> :
                       <span className="text-xs text-muted-foreground">{val}</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ComparisonTable;
