import { CardGrid } from "@/components/card-grid";
import { PageHero } from "@/components/page-hero";
import { solutionItems } from "@/lib/site-data";

export default function SolutionsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Solutions"
        title="Zenify industry solutions"
        description="Vertical landing pages tailored for different industries, operating models, and customer communication demands."
      />
      <section className="section">
        <div className="container">
          <CardGrid
            items={solutionItems.map((item) => ({
              href: `/solutions/${item.slug}`,
              title: item.title,
              summary: item.summary,
            }))}
          />
        </div>
      </section>
    </main>
  );
}
