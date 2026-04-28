import Link from "next/link";

type CardItem = {
  href: string;
  title: string;
  summary: string;
};

export function CardGrid({ items }: { items: CardItem[] }) {
  return (
    <div className="card-grid">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="card">
          <h3>{item.title}</h3>
          <p>{item.summary}</p>
          <span className="card-link">Open page</span>
        </Link>
      ))}
    </div>
  );
}
