"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { pricingPlans } from "@/lib/site-data";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const plans = useMemo(
    () =>
      pricingPlans.map((plan) => {
        const monthlyValue = Number.parseFloat(plan.monthlyPrice.replace(/[^0-9.]/g, ""));
        const hasNumericPrice = Number.isFinite(monthlyValue);
        const annualMonthlyValue = hasNumericPrice ? Math.round(monthlyValue * 0.82) : null;

        return {
          ...plan,
          displayPrice:
            billingCycle === "annual" && annualMonthlyValue !== null
              ? `$${annualMonthlyValue}`
              : plan.monthlyPrice,
          billingNote:
            annualMonthlyValue === null
              ? "Contact sales for a tailored annual contract."
              : billingCycle === "annual"
                ? `Save 18% with annual billing.`
                : "Billed monthly.",
        };
      }),
    [billingCycle],
  );

  return (
    <main>
      <PageHero
        eyebrow="Pricing"
        title="Pricing built for trial conversion"
        description="The pricing structure follows a LiveChat-style SaaS pattern with clear tiers, upgrade paths, and enterprise escalation."
      />
      <section className="section section-tight">
        <div className="container">
          <div className="billing-toggle">
            <button
              type="button"
              className={`billing-tab ${billingCycle === "monthly" ? "billing-tab-active" : ""}`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly billing
            </button>
            <button
              type="button"
              className={`billing-tab ${billingCycle === "annual" ? "billing-tab-active" : ""}`}
              onClick={() => setBillingCycle("annual")}
            >
              <span>Annual billing</span>
              <b className="billing-save">Save up to 18%</b>
            </button>
          </div>
          <div className="pricing-grid">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`pricing-card ${plan.highlighted ? "pricing-card-featured" : ""}`}
              >
                {plan.highlighted ? <div className="pricing-badge">Most Popular</div> : null}
                <h3>{plan.name}</h3>
                <p className="pricing-seat">{plan.seats}</p>
                <div className="price-stack">
                  <strong>{plan.displayPrice}</strong>
                  <span>per seat / month</span>
                  <small>{plan.billingNote}</small>
                </div>
                <p>{plan.description}</p>
                <ul>
                  {plan.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <Link href="/signup" className="button button-small">
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight tint">
        <div className="container pricing-facts">
          <article className="detail-card">
            <h2>How the billing flow works</h2>
            <ul>
              <li>Customer chooses a package from the landing site.</li>
              <li>Signup captures workspace and use-case information.</li>
              <li>Billing step adds a card before the 15-day trial starts.</li>
              <li>Trial expires into a clean upgrade path without re-onboarding.</li>
            </ul>
          </article>
          <article className="detail-card">
            <h2>What makes this SaaS-ready</h2>
            <ul>
              <li>Tiered packaging aligned to company size and operating complexity.</li>
              <li>Trial conversion path modeled directly in the route structure.</li>
              <li>Enterprise path separated cleanly for procurement-led buyers.</li>
              <li>Comparison pages can point directly into pricing and signup.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container detail-card">
          <div className="cta-strip">
            <div>
              <p className="eyebrow">Ready to start?</p>
              <h2>Start with Growth and move to paid without rebuilding your workspace.</h2>
            </div>
            <div className="cta-strip-actions">
              <Link href="/signup" className="button">
                Start free trial
              </Link>
              <Link href="/enterprise" className="text-link">
                Need enterprise pricing?
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
