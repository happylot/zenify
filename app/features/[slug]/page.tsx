import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { featureItems, getFeature } from "@/lib/site-data";

export function generateStaticParams() {
  return featureItems.map((item) => ({ slug: item.slug }));
}

export default async function FeatureDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getFeature(slug);
  if (!item) notFound();

  return (
    <main>
      <PageHero eyebrow="Feature" title={item.title} description={item.summary} />
      <section className="section">
        <div className="container prose-block">
          <div className="detail-card">
            <h2>What this page is for</h2>
            <p>
              This route exists to support product marketing, paid acquisition, and organic search
              intent around the specific capability.
            </p>
            <ul>
              {item.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
