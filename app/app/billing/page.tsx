import { SubscriptionStatus, TrialStatus, WorkspaceStatus } from "@prisma/client";
import { AppShell } from "@/components/app-shell";
import {
  getBillingSummary,
  listCustomers,
  listInvoices,
  listSubscriptions,
} from "@/lib/billing";
import { billingAccountActions, billingAutomationRules } from "@/lib/site-data";

export const dynamic = "force-dynamic";

function formatDate(value?: Date | null) {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(value);
}

function formatAmount(value: unknown, currency = "USD") {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getTrialRisk(params: {
  hasPaymentMethod: boolean;
  trialStatus?: TrialStatus;
  activationRate?: number | null;
}) {
  if (!params.hasPaymentMethod || params.trialStatus === TrialStatus.EXPIRED) return "High";
  if ((params.activationRate ?? 0) < 60) return "Medium";
  return "Low";
}

export default async function AppBillingPage() {
  let loadError: string | null = null;
  let summary:
    | {
        trialWorkspaces: number;
        activeSubscriptions: number;
        openInvoices: number;
        monthlyRecurringRevenue: string;
      }
    | null = null;
  let customers = [] as Awaited<ReturnType<typeof listCustomers>>;
  let subscriptions = [] as Awaited<ReturnType<typeof listSubscriptions>>;
  let invoices = [] as Awaited<ReturnType<typeof listInvoices>>;

  try {
    [summary, customers, subscriptions, invoices] = await Promise.all([
      getBillingSummary(),
      listCustomers(),
      listSubscriptions(),
      listInvoices(),
    ]);
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Billing data is unavailable. Configure DATABASE_URL and run the Prisma setup.";
  }

  const trialRows = customers.flatMap((customer) =>
    customer.workspaces
      .filter((workspace) => workspace.trial)
      .map((workspace) => {
        const trial = workspace.trial;
        const hasPaymentMethod = Boolean(workspace.paymentMethodBrand && workspace.paymentMethodLast4);
        const risk = getTrialRisk({
          hasPaymentMethod,
          trialStatus: trial?.status,
          activationRate: trial?.activationRate,
        });

        return {
          key: workspace.id,
          company: customer.company,
          owner: customer.email,
          plan: workspace.currentPlan,
          trialEnd: formatDate(trial?.endsAt ?? workspace.trialEndsAt),
          paymentMethod: hasPaymentMethod
            ? `${workspace.paymentMethodBrand} ending ${workspace.paymentMethodLast4}`
            : "No card on file",
          activation: `${trial?.activationRate ?? 0}% activated`,
          risk,
        };
      }),
  );

  const subscriptionRows = subscriptions.map((subscription) => ({
    key: subscription.id,
    company: subscription.workspace.customer.company,
    plan: subscription.planCode,
    seats: `${subscription.workspace.seatCount} seats`,
    renewalDate: formatDate(subscription.renewsAt),
    billingCycle: subscription.billingCycle,
    autoRenew: subscription.workspace.autoRenew ? "Enabled" : "Manual renewal",
    status:
      subscription.workspace.status === WorkspaceStatus.SUSPENDED
        ? "Account locked"
        : subscription.status === SubscriptionStatus.PAST_DUE
          ? "Payment retry"
          : subscription.status === SubscriptionStatus.CANCELED
            ? "Canceled"
            : "Healthy",
    action:
      subscription.planChanges[0]
        ? `${subscription.planChanges[0].type.toLowerCase()} scheduled`
        : "No change scheduled",
  }));

  const invoiceRows = invoices.map((invoice) => ({
    key: invoice.id,
    invoiceNo: invoice.invoiceNumber,
    customer: invoice.customer.company,
    amount: formatAmount(invoice.totalAmount, invoice.currency),
    dueDate: formatDate(invoice.dueAt),
    status: invoice.status,
    export: invoice.exportUrl ? "PDF ready" : "Pending export",
  }));

  return (
    <AppShell
      title="Billing operations"
      description="Manage trial accounts, active subscriptions, recurring charges, invoice generation, plan changes, and account access from one control center."
    >
      <div className="ops-stack">
        {loadError ? (
          <section className="detail-card ops-card">
            <div className="ops-section-head">
              <div>
                <p className="eyebrow">Billing data</p>
                <h2>Database connection still needs configuration</h2>
              </div>
            </div>
            <p className="lead compact">
              {loadError}. Add `DATABASE_URL`, then run `npm run db:push` and `npm run db:seed`.
            </p>
          </section>
        ) : null}

        <section className="ops-metric-grid">
          {[
            {
              label: "Trial workspaces",
              value: summary?.trialWorkspaces ?? 0,
              note: `${trialRows.length} customer records in trial tracking`,
            },
            {
              label: "Active subscriptions",
              value: summary?.activeSubscriptions ?? 0,
              note: `${subscriptionRows.filter((row) => row.autoRenew === "Enabled").length} on auto-renew`,
            },
            {
              label: "MRR under management",
              value: summary ? formatAmount(summary.monthlyRecurringRevenue) : "$0",
              note: "Live amount from active subscriptions",
            },
            {
              label: "Open invoices",
              value: summary?.openInvoices ?? 0,
              note: `${invoiceRows.filter((row) => row.status !== "PAID").length} still require action`,
            },
          ].map((metric) => (
            <article key={metric.label} className="ops-metric-card">
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.note}</small>
            </article>
          ))}
        </section>

        <section className="ops-grid">
          <article className="detail-card ops-card ops-card-wide">
            <div className="ops-section-head">
              <div>
                <p className="eyebrow">Trial management</p>
                <h2>Customers in trial and ready for conversion</h2>
              </div>
              <span className="ops-pill">Activation + billing check</span>
            </div>
            {trialRows.length ? (
              <div className="ops-table">
                <div className="ops-row ops-row-head">
                  <span>Customer</span>
                  <span>Plan</span>
                  <span>Trial end</span>
                  <span>Payment method</span>
                  <span>Activation</span>
                  <span>Risk</span>
                </div>
                {trialRows.map((workspace) => (
                  <div key={workspace.key} className="ops-row">
                    <span>
                      <strong>{workspace.company}</strong>
                      <small>{workspace.owner}</small>
                    </span>
                    <span>{workspace.plan}</span>
                    <span>{workspace.trialEnd}</span>
                    <span>{workspace.paymentMethod}</span>
                    <span>{workspace.activation}</span>
                    <span className={`ops-status ops-status-${workspace.risk.toLowerCase()}`}>
                      {workspace.risk}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="lead compact">No active trial workspaces found in the database yet.</p>
            )}
          </article>

          <article className="detail-card ops-card">
            <div className="ops-section-head">
              <div>
                <p className="eyebrow">Recurring billing</p>
                <h2>Renewals and subscription health</h2>
              </div>
            </div>
            <div className="ops-list">
              {subscriptionRows.length ? (
                subscriptionRows.map((workspace) => (
                  <article key={workspace.key} className="ops-list-item">
                    <div>
                      <strong>{workspace.company}</strong>
                      <span>
                        {workspace.plan} · {workspace.seats}
                      </span>
                    </div>
                    <p>
                      {workspace.billingCycle} renewal on {workspace.renewalDate}
                    </p>
                    <div className="ops-meta">
                      <span className="ops-pill">{workspace.autoRenew}</span>
                      <span>{workspace.status}</span>
                    </div>
                    <small>{workspace.action}</small>
                  </article>
                ))
              ) : (
                <p className="lead compact">No subscriptions exist yet. Seed data or live records will appear here.</p>
              )}
            </div>
          </article>
        </section>

        <section className="ops-grid">
          <article className="detail-card ops-card ops-card-wide">
            <div className="ops-section-head">
              <div>
                <p className="eyebrow">Invoice center</p>
                <h2>Billing checks, invoice issuing, and export readiness</h2>
              </div>
              <span className="ops-pill">Finance handoff</span>
            </div>
            {invoiceRows.length ? (
              <div className="ops-table">
                <div className="ops-row ops-row-head">
                  <span>Invoice</span>
                  <span>Customer</span>
                  <span>Amount</span>
                  <span>Due date</span>
                  <span>Status</span>
                  <span>Export</span>
                </div>
                {invoiceRows.map((invoice) => (
                  <div key={invoice.key} className="ops-row">
                    <span>
                      <strong>{invoice.invoiceNo}</strong>
                    </span>
                    <span>{invoice.customer}</span>
                    <span>{invoice.amount}</span>
                    <span>{invoice.dueDate}</span>
                    <span>{invoice.status}</span>
                    <span>{invoice.export}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="lead compact">No invoices have been generated yet.</p>
            )}
          </article>

          <article className="detail-card ops-card">
            <div className="ops-section-head">
              <div>
                <p className="eyebrow">Account control</p>
                <h2>Upgrade, downgrade, lock, and reopen access</h2>
              </div>
            </div>
            <div className="ops-list">
              {billingAccountActions.map((action) => (
                <article key={action.title} className="ops-list-item">
                  <strong>{action.title}</strong>
                  <p>{action.detail}</p>
                  <small>{action.status}</small>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="detail-card ops-card">
          <div className="ops-section-head">
            <div>
              <p className="eyebrow">Automation rules</p>
              <h2>What the production billing engine should execute automatically</h2>
            </div>
          </div>
          <div className="ops-automation-grid">
            {billingAutomationRules.map((rule) => (
              <article key={rule.title} className="ops-automation-card">
                <h3>{rule.title}</h3>
                <p>{rule.description}</p>
                <ul>
                  {rule.checkpoints.map((checkpoint) => (
                    <li key={checkpoint}>{checkpoint}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
