import { CardGrid } from "@/components/card-grid";
import { PageHero } from "@/components/page-hero";
import { comparisonItems } from "@/lib/site-data";

export default function ComparisonPage() {
  return (
    <main>
      <PageHero
        eyebrow="Comparison"
        title="Zenify comparison pages"
        description="SEO-focused pages for buyers actively comparing Zenify against the core CX and chat competitors."
      />
      <section className="section">
        <div className="container">
          <CardGrid
            items={comparisonItems.map((item) => ({
              href: `/comparison/${item.slug}`,
              title: item.title,
              summary: item.summary,
            }))}
          />
        </div>
      </section>
    </main>
  );
}
