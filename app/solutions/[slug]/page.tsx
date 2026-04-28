import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { getSolution, solutionItems } from "@/lib/site-data";

export function generateStaticParams() {
  return solutionItems.map((item) => ({ slug: item.slug }));
}

export default async function SolutionDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getSolution(slug);
  if (!item) notFound();

  return (
    <main>
      <PageHero eyebrow="Solution" title={item.title} description={item.summary} />
      <section className="section section-tight">
        <div className="container three-col-grid">
          <article className="detail-card">
            <h2>Key use cases</h2>
            <ul>
              {item.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>
          <article className="detail-card">
            <h2>Common challenges</h2>
            <ul>
              {item.challenges.map((challenge) => (
                <li key={challenge}>{challenge}</li>
              ))}
            </ul>
          </article>
          <article className="detail-card">
            <h2>Expected outcomes</h2>
            <ul>
              {item.outcomes.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section section-tight tint">
        <div className="container detail-card">
          <h2>Recommended Zenify modules</h2>
          <div className="tag-grid">
            {item.modules.map((module) => (
              <span key={module} className="feature-tag">
                {module}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container detail-card">
          <div className="cta-strip">
            <div>
              <p className="eyebrow">Next step</p>
              <h2>Route this industry page into pricing, signup, or a dedicated enterprise demo.</h2>
            </div>
            <div className="cta-strip-actions">
              <Link href="/signup" className="button">
                Start free trial
              </Link>
              <Link href="/contact" className="text-link">
                Request industry demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
