import { Check, X } from 'lucide-react';

interface ProsConsListProps {
  pros: string[];
  cons: string[];
}

const ProsConsList = ({ pros, cons }: ProsConsListProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
    <div className="rounded-lg border border-border/50 bg-card p-4">
      <h4 className="font-heading font-semibold text-success flex items-center gap-2 mb-2.5 text-sm">
        <span className="w-5 h-5 rounded bg-success/8 flex items-center justify-center">
          <Check className="w-3 h-3" />
        </span>
        Privalumai
      </h4>
      <ul className="space-y-2">
        {pros.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>
    </div>
    <div className="rounded-lg border border-border/50 bg-card p-4">
      <h4 className="font-heading font-semibold text-danger flex items-center gap-2 mb-2.5 text-sm">
        <span className="w-5 h-5 rounded bg-danger/8 flex items-center justify-center">
          <X className="w-3 h-3" />
        </span>
        Trūkumai
      </h4>
      <ul className="space-y-2">
        {cons.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <X className="w-3.5 h-3.5 text-danger shrink-0 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ProsConsList;
