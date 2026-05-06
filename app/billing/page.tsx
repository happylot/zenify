import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { BillingCheckout } from "@/components/billing-checkout";
import { getSignupLeadById } from "@/lib/crm";
import { SIGNUP_SESSION_COOKIE, readSignupSessionToken } from "@/lib/signup-session";
import {
  PLAN_PRICES,
  billingChecklist,
  isSelfServePlan,
  planDisplayName,
  type SelfServePlanCode,
} from "@/lib/site-data";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const store = await cookies();
  const token = store.get(SIGNUP_SESSION_COOKIE)?.value;
  const session = readSignupSessionToken(token);

  if (!session) {
    redirect("/signup?error=session-expired");
  }

  const lead = await getSignupLeadById(session.leadId);

  if (!lead || !lead.planCode || !isSelfServePlan(lead.planCode) || !lead.seats) {
    redirect("/signup?error=session-expired");
  }

  const planCode = lead.planCode as SelfServePlanCode;
  const seats = lead.seats!;
  const pricePerSeat = PLAN_PRICES[planCode];
  const total = pricePerSeat * seats;

  return (
    <main>
      <PageHero
        eyebrow="Billing"
        title="Subscribe with PayPal"
        description="Approve the subscription with PayPal. PayPal will charge today and auto-renew monthly. Cancel anytime from your PayPal account."
      />
      <section className="section section-tight">
        <div className="container billing-layout">
          <article className="form-card">
            <div className="form-card-head">
              <h2>Payment</h2>
              <span>Step 2 of 3</span>
            </div>
            <p>
              Click <strong>PayPal</strong> below to approve your subscription. Your workspace is provisioned
              automatically once PayPal confirms the subscription.
            </p>
            <BillingCheckout />
            <div className="secure-note">
              <span className="secure-dot" />
              <p>Auto-renews monthly via PayPal. You can cancel from your PayPal account at any time.</p>
            </div>
          </article>

          <article className="checkout-summary">
            <div className="summary-card">
              <p className="eyebrow">Selected plan</p>
              <h2>{planDisplayName(planCode)}</h2>
              <div className="summary-price">
                <strong>${pricePerSeat}</strong>
                <span>per seat / month</span>
              </div>
              <ul>
                <li>
                  <strong>{seats}</strong> seats
                </li>
                <li>
                  Workspace: <strong>{lead.workspaceSlug}</strong>
                </li>
                <li>
                  Email: <strong>{lead.email}</strong>
                </li>
              </ul>
              <ul>
                {billingChecklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="summary-totals">
                <div>
                  <span>Charged today</span>
                  <strong>${total.toLocaleString("en-US")}</strong>
                </div>
                <div>
                  <span>Renews monthly</span>
                  <strong>${total.toLocaleString("en-US")}</strong>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}