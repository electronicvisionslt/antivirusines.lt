import { Check, X } from 'lucide-react';

interface ProsConsListProps {
  pros: string[];
  cons: string[];
}

const ProsConsList = ({ pros, cons }: ProsConsListProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
    <div className="rounded-xl border border-border/60 bg-card p-5 glow-border">
      <h4 className="font-heading font-semibold text-success flex items-center gap-2 mb-3 text-sm">
        <span className="w-6 h-6 rounded-md bg-success/10 border border-success/15 flex items-center justify-center">
          <Check className="w-3.5 h-3.5" />
        </span>
        Privalumai
      </h4>
      <ul className="space-y-2.5">
        {pros.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>
    </div>
    <div className="rounded-xl border border-border/60 bg-card p-5 glow-border">
      <h4 className="font-heading font-semibold text-danger flex items-center gap-2 mb-3 text-sm">
        <span className="w-6 h-6 rounded-md bg-danger/10 border border-danger/15 flex items-center justify-center">
          <X className="w-3.5 h-3.5" />
        </span>
        Trūkumai
      </h4>
      <ul className="space-y-2.5">
        {cons.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <X className="w-4 h-4 text-danger shrink-0 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ProsConsList;