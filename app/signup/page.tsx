import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { signupChecklist } from "@/lib/site-data";

export default function SignupPage() {
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
            <div className="form-grid">
              <label>
                <span>Work email</span>
                <input type="email" placeholder="name@company.com" />
              </label>
              <label>
                <span>Company name</span>
                <input type="text" placeholder="Zenify Labs" />
              </label>
              <label>
                <span>Workspace URL</span>
                <input type="text" placeholder="acme.zenify.cx" />
              </label>
              <label>
                <span>Team size</span>
                <select defaultValue="10-25">
                  <option>1-5</option>
                  <option>6-10</option>
                  <option>10-25</option>
                  <option>26-100</option>
                  <option>100+</option>
                </select>
              </label>
              <label className="form-span-2">
                <span>Primary goal</span>
                <select defaultValue="omnichannel-support">
                  <option value="omnichannel-support">Omnichannel customer support</option>
                  <option value="sales-crm">Sales CRM and lead conversion</option>
                  <option value="ai-automation">AI automation and chatbot</option>
                  <option value="trial-plg">PLG onboarding and trial conversion</option>
                </select>
              </label>
            </div>
            <div className="form-footer">
              <p>
                By continuing, the customer is moved into card setup before the trial begins.
              </p>
              <Link href="/billing" className="button">
                Continue to billing
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
