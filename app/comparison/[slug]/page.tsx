import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { comparisonItems, getComparison } from "@/lib/site-data";

export function generateStaticParams() {
  return comparisonItems.map((item) => ({ slug: item.slug }));
}

export default async function ComparisonDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getComparison(slug);
  if (!item) notFound();

  return (
    <main>
      <PageHero eyebrow="Comparison" title={item.title} description={item.summary} />
      <section className="section section-tight">
        <div className="container three-col-grid">
          <article className="detail-card">
            <h2>Why Zenify stands out</h2>
            <ul>
              {item.strengths.map((strength) => (
                <li key={strength}>{strength}</li>
              ))}
            </ul>
          </article>
          <article className="detail-card">
            <h2>Buyer triggers</h2>
            <ul>
              {item.buyerTriggers.map((trigger) => (
                <li key={trigger}>{trigger}</li>
              ))}
            </ul>
          </article>
          <article className="detail-card">
            <h2>Zenify advantages</h2>
            <ul>
              {item.zenifyAdvantages.map((advantage) => (
                <li key={advantage}>{advantage}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section section-tight tint">
        <div className="container detail-card">
          <h2>Quick comparison</h2>
          <div className="comparison-table">
            <div className="comparison-row comparison-head">
              <span>Criteria</span>
              <span>Zenify</span>
              <span>{item.competitor}</span>
            </div>
            {item.comparisonRows.map((row) => (
              <div key={row.label} className="comparison-row">
                <span>{row.label}</span>
                <span>{row.zenify}</span>
                <span>{row.competitor}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container detail-card">
          <div className="cta-strip">
            <div>
              <p className="eyebrow">High-intent CTA</p>
              <h2>Comparison pages should push directly into pricing and a trial-ready signup path.</h2>
            </div>
            <div className="cta-strip-actions">
              <Link href="/pricing" className="button">
                Compare plans
              </Link>
              <Link href="/signup" className="text-link">
                Start free trial
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
