interface TOCItem {
  id: string;
  title: string;
}

const TableOfContents = ({ items }: { items: TOCItem[] }) => (
  <nav className="rounded-lg border border-border/50 bg-card p-4 my-6">
    <h4 className="font-heading font-semibold text-xs text-foreground mb-2.5 uppercase tracking-wider">Turinys</h4>
    <ol className="space-y-1.5">
      {items.map((item, i) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className="flex items-baseline gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 group"
          >
            <span className="text-[10px] text-muted-foreground/35 font-mono tabular-nums group-hover:text-primary/50 transition-colors duration-200">{String(i + 1).padStart(2, '0')}</span>
            {item.title}
          </a>
        </li>
      ))}
    </ol>
  </nav>
);

export default TableOfContents;
