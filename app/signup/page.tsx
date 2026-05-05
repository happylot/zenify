import { PageHero } from "@/components/page-hero";
import {
  PLAN_DEFAULT_SEATS,
  PLAN_PRICES,
  SELF_SERVE_PLANS,
  planCodeFromQuery,
  planDisplayName,
  signupChecklist,
  type SelfServePlanCode,
} from "@/lib/site-data";

const signupMessages: Record<string, string> = {
  "Missing signup fields": "Please complete all fields before continuing.",
  "Unable to save signup": "We could not save your signup right now. Please try again.",
  "Invalid plan": "Please choose Starter, Growth, or Business.",
  "Invalid seats": "Seat count must be between 1 and 1000.",
  "Invalid email": "Enter a valid work email address.",
  "Invalid company name": "Company name must be 2-100 characters.",
  "enterprise-contact-sales": "Enterprise plans are sold via our sales team. Please use the contact form.",
  "session-expired": "Your signup session expired. Please fill the form again.",
  "internal-error": "Something went wrong on our side. Please try again in a moment.",
};

const FALLBACK_ERROR_MESSAGE = "Something went wrong. Please try again.";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const errorParam = Array.isArray(params.error) ? params.error[0] : params.error;
  const planParam = Array.isArray(params.plan) ? params.plan[0] : params.plan;
  const preselectedPlan: SelfServePlanCode = planCodeFromQuery(planParam) ?? "GROWTH";
  const defaultSeats = PLAN_DEFAULT_SEATS[preselectedPlan];

  return (
    <main>
      <PageHero
        eyebrow="Signup"
        title="Create your Zenify workspace"
        description="Account creation is the first conversion step before billing, activation, and in-product onboarding."
      />
      <section className="section section-tight">
        <div className="container form-layout">
          <article className="detail-card signup-sidebar">
            <p className="eyebrow">What gets captured</p>
            <h2>Fast signup, then straight into billing and trial activation.</h2>
            <ul>
              {signupChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="mini-stat-grid">
              <article>
                <strong>24h</strong>
                <span>target deployment</span>
              </article>
              <article>
                <strong>15 days</strong>
                <span>free trial length</span>
              </article>
            </div>
          </article>

          <article className="form-card">
            <div className="form-card-head">
              <h2>Create your workspace</h2>
              <span>Step 1 of 3</span>
            </div>
            {errorParam ? (
              <div className="admin-auth-error">
                {signupMessages[errorParam] ?? FALLBACK_ERROR_MESSAGE}
              </div>
            ) : null}
            <form action="/signup/submit" method="post">
              <div className="form-grid">
                <label>
                  <span>Work email</span>
                  <input type="email" name="email" placeholder="name@company.com" required />
                </label>
                <label>
                  <span>Company name</span>
                  <input type="text" name="company" placeholder="Zenify Labs" required />
                </label>
                <label>
                  <span>Workspace URL</span>
                  <input type="text" name="workspaceSlug" placeholder="acme.zenify.cx" required />
                </label>
                <label>
                  <span>Plan</span>
                  <select name="planCode" defaultValue={preselectedPlan}>
                    {SELF_SERVE_PLANS.map((code) => (
                      <option key={code} value={code}>
                        {planDisplayName(code)} — ${PLAN_PRICES[code]}/seat/month
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Seats</span>
                  <input
                    type="number"
                    name="seats"
                    min={1}
                    max={1000}
                    defaultValue={defaultSeats}
                    required
                  />
                </label>
                <label>
                  <span>Team size</span>
                  <select name="teamSize" defaultValue="10-25">
                    <option>1-5</option>
                    <option>6-10</option>
                    <option>10-25</option>
                    <option>26-100</option>
                    <option>100+</option>
                  </select>
                </label>
                <label className="form-span-2">
                  <span>Primary goal</span>
                  <select name="primaryGoal" defaultValue="omnichannel-support">
                    <option value="omnichannel-support">Omnichannel customer support</option>
                    <option value="sales-crm">Sales CRM and lead conversion</option>
                    <option value="ai-automation">AI automation and chatbot</option>
                    <option value="trial-plg">PLG onboarding and trial conversion</option>
                  </select>
                </label>
              </div>
              <div className="form-footer">
                <p>
                  Your signup is captured in CRM first, then the customer is moved into billing before the trial begins.
                </p>
                <button type="submit" className="button">
                  Continue to billing
                </button>
              </div>
            </form>
          </article>
        </div>
      </section>
    </main>
  );
}