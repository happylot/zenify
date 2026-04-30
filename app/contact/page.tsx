import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Contact Zenify | Sales, Partnerships, and Implementation",
  description:
    "Contact the Zenify team for product demos, enterprise discussions, partnership inquiries, and implementation planning.",
};

const contactPaths = [
  {
    title: "Sales and product evaluation",
    text: "Speak with the Zenify team if you are comparing platforms, reviewing pricing, or assessing whether Zenify fits your customer experience, automation, or service operations goals.",
  },
  {
    title: "Enterprise and implementation planning",
    text: "Use this route for multi-team rollouts, regulated environments, security reviews, custom workflows, or integration requirements that need structured scoping before launch.",
  },
  {
    title: "Partnership and strategic collaboration",
    text: "Contact us for channel partnerships, implementation alliances, technology integrations, or commercial collaboration that extends the Zenify platform into new markets.",
  },
];

const responseExpectations = [
  "A clear qualification of your use case, business model, and operational priorities",
  "Guidance on the most relevant Zenify modules, workflows, and rollout path",
  "A recommended next step, which may be a product demo, pricing discussion, or trial setup",
];

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title="Contact the Zenify team for sales, enterprise planning, and strategic partnerships"
        description="Zenify supports businesses evaluating customer experience, automation, CRM, ticketing, and lifecycle operations in one platform. Use this page to start the right commercial or implementation conversation."
      />

      <section className="section section-tight">
        <div className="container detail-card prose-block">
          <p>
            A professional software evaluation should lead to a focused conversation, not a generic handoff. Zenify is
            built for organizations that need a more structured customer experience operating model across acquisition,
            support, onboarding, automation, and retention. If you are exploring platform consolidation, replacing
            fragmented support tools, or planning a broader CX rollout, this is the right place to start.
          </p>
          <p>
            The contact process is intended for buyers and partners who need a serious commercial or operational
            discussion. That may include solution review, industry fit, rollout planning, governance requirements,
            implementation structure, or partnership alignment. The goal is to route each inquiry to the most relevant
            next step quickly and professionally.
          </p>
        </div>
      </section>

      <section className="section section-tight tint">
        <div className="container three-col-grid">
          {contactPaths.map((item) => (
            <article key={item.title} className="detail-card">
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-tight">
        <div className="container split">
          <article className="detail-card">
            <p className="eyebrow">What to expect</p>
            <h2>A more useful first conversation</h2>
            <p>
              Zenify conversations are structured around operational fit. Instead of only discussing features, we focus
              on the business model, customer journey, team structure, and service demands that shape a successful
              rollout.
            </p>
            <ul>
              {responseExpectations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="detail-card">
            <p className="eyebrow">Best next route</p>
            <h2>Choose the path that matches your stage</h2>
            <p>
              If you already know you want hands-on access, go directly into trial signup. If your team needs alignment
              on scope, security, implementation, or pricing, start with a contact-led conversation first.
            </p>
            <div className="cta-strip-actions">
              <Link href="/signup" className="button">
                Start free trial
              </Link>
              <Link href="/pricing" className="text-link">
                Review pricing
              </Link>
              <Link href="/solutions" className="text-link">
                Explore industry solutions
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
