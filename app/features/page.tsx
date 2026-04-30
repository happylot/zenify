import { CardGrid } from "@/components/card-grid";
import { PageHero } from "@/components/page-hero";
import { featureItems } from "@/lib/site-data";

export default function FeaturesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Features"
        title="Zenify features"
        description="Product marketing pages for the platform capabilities that power acquisition, onboarding, support, and retention."
      />
      <section className="section">
        <div className="container">
          <CardGrid
            items={featureItems.map((item) => ({
              href: `/features/${item.slug}`,
              title: item.title,
              summary: item.summary,
            }))}
          />
        </div>
      </section>
    </main>
  );
}
