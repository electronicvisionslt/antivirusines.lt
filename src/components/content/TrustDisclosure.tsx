import { forwardRef } from 'react';
import { Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrustDisclosureProps {
  compact?: boolean;
}

const TrustDisclosure = forwardRef<HTMLDivElement, TrustDisclosureProps>(({ compact = false }, ref) => {
  if (compact) {
    return (
      <p ref={ref as React.Ref<HTMLParagraphElement>} className="text-xs text-muted-foreground/70">
        <Info className="w-3.5 h-3.5 inline mr-1 text-primary/50" />
        Kai kuriose nuorodose naudojami affiliate partnerių saitai. <Link to="/affiliate-atskleidimas" className="underline hover:text-primary transition-colors duration-200">Sužinokite daugiau</Link>.
      </p>
    );
  }

  return (
    <div ref={ref} className="rounded-xl border border-border/60 bg-card p-5 my-8 glow-border relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h4 className="font-heading font-semibold text-sm text-foreground mb-1.5">Skaidrumo pranešimas</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            antivirusines.lt yra nepriklausomas portalas. Mūsų apžvalgos remiasi objektyviu testavimu. Kai kuriose nuorodose naudojami affiliate partnerių saitai – tai padeda finansuoti svetainę, bet neturi įtakos mūsų vertinimams.{' '}
            <Link to="/affiliate-atskleidimas" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors duration-200">Skaityti visą atskleidimą</Link>.
          </p>
        </div>
      </div>
    </div>
  );
});

TrustDisclosure.displayName = 'TrustDisclosure';

export default TrustDisclosure;