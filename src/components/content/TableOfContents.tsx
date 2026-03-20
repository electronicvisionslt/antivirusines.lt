interface TOCItem {
  id: string;
  title: string;
}

const TableOfContents = ({ items }: { items: TOCItem[] }) => (
  <nav className="rounded-lg border bg-card p-5 my-6">
    <h4 className="font-semibold text-sm text-foreground mb-3">Turinys</h4>
    <ol className="space-y-1.5">
      {items.map((item, i) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className="flex items-baseline gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-xs text-muted-foreground/60 font-mono tabular-nums">{i + 1}.</span>
            {item.title}
          </a>
        </li>
      ))}
    </ol>
  </nav>
);

export default TableOfContents;
