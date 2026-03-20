interface TOCItem {
  id: string;
  title: string;
}

const TableOfContents = ({ items }: { items: TOCItem[] }) => (
  <nav className="rounded-xl border border-border/60 bg-card p-5 my-6 glow-border">
    <h4 className="font-heading font-semibold text-sm text-foreground mb-3">Turinys</h4>
    <ol className="space-y-2">
      {items.map((item, i) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className="flex items-baseline gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 group"
          >
            <span className="text-xs text-muted-foreground/40 font-mono tabular-nums group-hover:text-primary/60 transition-colors duration-200">{String(i + 1).padStart(2, '0')}</span>
            {item.title}
          </a>
        </li>
      ))}
    </ol>
  </nav>
);

export default TableOfContents;