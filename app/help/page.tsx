import { CardGrid } from "@/components/card-grid";
import { PageHero } from "@/components/page-hero";
import { helpItems } from "@/lib/site-data";

export default function HelpPage() {
  return (
    <main>
      <PageHero
        eyebrow="Help Center"
        title="Zenify help center"
        description="Operational documentation sections for onboarding, AI, billing, integrations, and platform security."
      />
      <section className="section">
        <div className="container">
          <CardGrid
            items={helpItems.map((item) => ({
              href: `/help/${item.slug}`,
              title: item.title,
              summary: item.summary,
            }))}
          />
        </div>
      </section>
    </main>
  );
}
