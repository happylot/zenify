import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { PaypalCheckout } from "@/components/paypal-checkout";
import { billingChecklist, pricingPlans } from "@/lib/site-data";

export default function BillingPage() {
  const growthPlan = pricingPlans.find((plan) => plan.name === "Growth");

  return (
    <main>
      <PageHero
        eyebrow="Billing"
        title="Card capture before trial access"
        description="The billing step is intentionally placed before activation so the product can convert trial users into subscribers without account fragmentation."
      />
      <section className="section section-tight">
        <div className="container billing-layout">
          <article className="form-card">
            <div className="form-card-head">
              <h2>Billing information</h2>
              <span>Step 2 of 3</span>
            </div>
            <div className="form-grid">
              <label className="form-span-2">
                <span>Name on card</span>
                <input type="text" placeholder="Alex Nguyen" />
              </label>
              <label className="form-span-2">
                <span>Card number</span>
                <input type="text" placeholder="4242 4242 4242 4242" />
              </label>
              <label>
                <span>Expiry</span>
                <input type="text" placeholder="08 / 29" />
              </label>
              <label>
                <span>CVC</span>
                <input type="text" placeholder="123" />
              </label>
              <label className="form-span-2">
                <span>Billing country</span>
                <select defaultValue="Vietnam">
                  <option>Vietnam</option>
                  <option>Singapore</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                </select>
              </label>
            </div>
            <div className="secure-note">
              <span className="secure-dot" />
              <p>Card setup is used to start the 15-day trial and convert seamlessly into a paid plan.</p>
            </div>
          </article>

          <article className="checkout-summary">
            <div className="summary-card">
              <p className="eyebrow">Selected plan</p>
              <h2>{growthPlan?.name ?? "Growth"}</h2>
              <div className="summary-price">
                <strong>{growthPlan?.monthlyPrice ?? "$79"}</strong>
                <span>per seat / month</span>
              </div>
              <p>{growthPlan?.description}</p>
              <ul>
                {billingChecklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="summary-totals">
                <div>
                  <span>Trial today</span>
                  <strong>$0.00</strong>
                </div>
                <div>
                  <span>After 15 days</span>
                  <strong>{growthPlan?.monthlyPrice ?? "$79"} / seat</strong>
                </div>
              </div>
              <Link href="/trial" className="button">
                Start 15-day trial
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="section section-tight tint">
        <div className="container paypal-layout">
          <article className="detail-card">
            <p className="eyebrow">PayPal Checkout</p>
            <h2>Pay the first month now with PayPal</h2>
            <p>
              Use this path when the customer wants to skip trial-style card capture and go straight
              to a paid Growth plan checkout.
            </p>
            <ul>
              <li>Creates a PayPal order from a secure server route.</li>
              <li>Captures the approved payment on the server after buyer approval.</li>
              <li>Keeps `client ID` public on the client and `client secret` only on the server.</li>
            </ul>
          </article>

          <article className="summary-card paypal-summary">
            <p className="eyebrow">Growth plan checkout</p>
            <h2>{growthPlan?.monthlyPrice ?? "$79.00"}</h2>
            <p>First month for one seat, billed in USD via PayPal.</p>
            <PaypalCheckout
              amount={(growthPlan?.monthlyPrice ?? "$79").replace("$", "")}
              currency="USD"
              description="Zenify Growth plan - first month"
            />
          </article>
        </div>
      </section>
    </main>
  );
}
