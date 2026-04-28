import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { getHelpItem, helpItems } from "@/lib/site-data";

export function generateStaticParams() {
  return helpItems.map((item) => ({ slug: item.slug }));
}

export default async function HelpDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getHelpItem(slug);
  if (!item) notFound();

  return (
    <main>
      <PageHero eyebrow="Help" title={item.title} description={item.summary} />
      <section className="section">
        <div className="container detail-card">
          <h2>Core topics</h2>
          <ul>
            {item.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
