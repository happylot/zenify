import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { trialMilestones } from "@/lib/site-data";

export default function TrialPage() {
  return (
    <main>
      <PageHero
        eyebrow="Trial"
        title="15-day trial activation model"
        description="The trial experience should drive setup, adoption, team invites, and value discovery before the upgrade prompt."
      />
      <section className="section section-tight">
        <div className="container trial-overview">
          <article className="trial-status-card">
            <div className="trial-status-top">
              <div>
                <p className="eyebrow">Trial status</p>
                <h2>12 days remaining</h2>
              </div>
              <span className="status-pill">Active</span>
            </div>
            <div className="trial-progress">
              <span style={{ width: "22%" }} />
            </div>
            <div className="mini-stat-grid">
              <article>
                <strong>3 / 5</strong>
                <span>setup tasks complete</span>
              </article>
              <article>
                <strong>18</strong>
                <span>conversations handled</span>
              </article>
              <article>
                <strong>2</strong>
                <span>AI flows enabled</span>
              </article>
            </div>
          </article>

          <div className="timeline-grid">
            {trialMilestones.map((item) => (
              <article key={item.day} className="timeline-card">
                <span>{item.day}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight tint">
        <div className="container detail-card">
          <div className="cta-strip">
            <div>
              <p className="eyebrow">Activation path</p>
              <h2>Drive product usage during the trial, then convert directly into a paid workspace.</h2>
            </div>
            <div className="cta-strip-actions">
              <Link href="/app/dashboard" className="button">
                Open app dashboard
              </Link>
              <Link href="/pricing" className="text-link">
                Review paid plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
