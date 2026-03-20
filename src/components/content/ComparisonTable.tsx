import { Check, X, Star } from 'lucide-react';
import { ComparisonProduct } from '@/data/mockData';

const ComparisonTable = ({ products, title = 'Antivirusinių programų palyginimas' }: { products: ComparisonProduct[]; title?: string }) => {
  const featureKeys = products.length > 0 ? Object.keys(products[0].features) : [];

  return (
    <section className="my-10">
      <h2 className="text-2xl font-bold text-foreground mb-5">{title}</h2>
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-secondary/50">
              <th className="text-left p-4 font-semibold text-foreground">Programa</th>
              <th className="text-center p-4 font-semibold text-foreground">Įvertinimas</th>
              <th className="text-center p-4 font-semibold text-foreground">Kaina</th>
              {featureKeys.map(k => (
                <th key={k} className="text-center p-4 font-semibold text-foreground whitespace-nowrap">{k}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <tr key={product.name} className={i < products.length - 1 ? 'border-b' : ''}>
                <td className="p-4 font-medium text-foreground">{product.name}</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center gap-1 text-accent font-semibold">
                    <Star className="w-4 h-4 fill-accent" />
                    {product.rating}
                  </span>
                </td>
                <td className="p-4 text-center text-muted-foreground whitespace-nowrap">{product.price}</td>
                {featureKeys.map(k => {
                  const val = product.features[k];
                  return (
                    <td key={k} className="p-4 text-center">
                      {val === true ? <Check className="w-5 h-5 text-success mx-auto" /> :
                       val === false ? <X className="w-5 h-5 text-muted-foreground/40 mx-auto" /> :
                       <span className="text-muted-foreground">{val}</span>}
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
