import { Check, X } from 'lucide-react';

interface ProsConsListProps {
  pros: string[];
  cons: string[];
}

const ProsConsList = ({ pros, cons }: ProsConsListProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
    <div className="rounded-lg border bg-card p-5">
      <h4 className="font-semibold text-success flex items-center gap-2 mb-3">
        <Check className="w-5 h-5" />
        Privalumai
      </h4>
      <ul className="space-y-2">
        {pros.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>
    </div>
    <div className="rounded-lg border bg-card p-5">
      <h4 className="font-semibold text-danger flex items-center gap-2 mb-3">
        <X className="w-5 h-5" />
        Trūkumai
      </h4>
      <ul className="space-y-2">
        {cons.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <X className="w-4 h-4 text-danger shrink-0 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ProsConsList;
