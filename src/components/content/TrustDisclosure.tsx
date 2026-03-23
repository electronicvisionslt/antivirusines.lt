import { Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrustDisclosureProps {
  compact?: boolean;
}

const TrustDisclosure = ({ compact = false }: TrustDisclosureProps) => {
  if (compact) {
    return (
      <p className="text-xs text-muted-foreground/70">
        <Info className="w-3.5 h-3.5 inline mr-1 text-primary/40" />
        Kai kuriose nuorodose naudojami affiliate partnerių saitai. <Link to="/affiliate-atskleidimas" className="underline hover:text-primary transition-colors duration-200">Sužinokite daugiau</Link>.
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-border/50 bg-card p-4 my-8">
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-md bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-3.5 h-3.5 text-primary" />
        </div>
        <div>
          <p className="font-heading font-semibold text-sm text-foreground mb-1">Skaidrumo pranešimas</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            antivirusines.lt yra nepriklausomas portalas. Mūsų apžvalgos remiasi objektyviu testavimu. Kai kuriose nuorodose naudojami affiliate partnerių saitai – tai padeda finansuoti svetainę, bet neturi įtakos mūsų vertinimams.{' '}
            <Link to="/affiliate-atskleidimas" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors duration-200">Skaityti visą atskleidimą</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustDisclosure;
