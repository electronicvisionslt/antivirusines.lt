import { Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrustDisclosure = ({ compact = false }: { compact?: boolean }) => {
  if (compact) {
    return (
      <p className="text-xs text-muted-foreground">
        <Info className="w-3.5 h-3.5 inline mr-1" />
        Kai kuriose nuorodose naudojami affiliate partnerių saitai. <Link to="/affiliate-atskleidimas" className="underline hover:text-primary transition-colors">Sužinokite daugiau</Link>.
      </p>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-5 my-8">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-sm text-foreground mb-1">Skaidrumo pranešimas</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            antivirusines.lt yra nepriklausomas portalas. Mūsų apžvalgos remiasi objektyviu testavimu. Kai kuriose nuorodose naudojami affiliate partnerių saitai – tai padeda finansuoti svetainę, bet neturi įtakos mūsų vertinimams.{' '}
            <Link to="/affiliate-atskleidimas" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">Skaityti visą atskleidimą</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustDisclosure;
