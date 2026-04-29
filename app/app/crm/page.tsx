import { AppShell } from "@/components/app-shell";
import { getSignupLeadSummary, listSignupLeads } from "@/lib/crm";

export const dynamic = "force-dynamic";

const SIGNUP_LEAD_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "DISQUALIFIED"] as const;
type SignupLeadStatus = (typeof SIGNUP_LEAD_STATUSES)[number];

const statusLabels: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  CONVERTED: "Converted",
  DISQUALIFIED: "Disqualified",
};

const TRIAL_LENGTH_DAYS = 15;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

function getTrialRemaining(createdAt: Date, now: Date) {
  const elapsedMs = now.getTime() - createdAt.getTime();
  const remainingMs = TRIAL_LENGTH_DAYS * MS_PER_DAY - elapsedMs;
  const remainingDaysFloat = remainingMs / MS_PER_DAY;
  const remainingDaysClamped = Math.max(0, Math.min(TRIAL_LENGTH_DAYS, remainingDaysFloat));

  const daysLeft = Math.max(0, Math.ceil(remainingDaysClamped));
  const pct = (remainingDaysClamped / TRIAL_LENGTH_DAYS) * 100;

  return { daysLeft, pct };
}

const primaryGoalLabels: Record<string, string> = {
  "omnichannel-support": "Omnichannel support",
  "sales-crm": "Sales CRM",
  "ai-automation": "AI automation",
  "trial-plg": "Trial to paid",
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(value);
}

export default async function AppCrmPage() {
  let loadError: string | null = null;
  const now = new Date();
  let summary = {
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    disqualified: 0,
  };
  let leads = [] as Awaited<ReturnType<typeof listSignupLeads>>;

  try {
    [summary, leads] = await Promise.all([getSignupLeadSummary(), listSignupLeads()]);
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "CRM data is unavailable. Configure DATABASE_URL and run the Prisma setup.";
  }

  return (
    <AppShell
      title="Signup CRM"
      description="Track companies that registered through the website signup form and move them from new lead to qualified or converted."
    >
      <div className="ops-stack">
        {loadError ? (
          <section className="detail-card ops-card">
            <div className="ops-section-head">
              <div>
                <p className="eyebrow">CRM data</p>
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
            { label: "Signup leads", value: summary.total, note: `${summary.new} waiting for first response` },
            { label: "Contacted", value: summary.contacted, note: "Leads touched by sales or onboarding" },
            { label: "Qualified", value: summary.qualified, note: "Ready to move deeper into billing" },
            { label: "Converted", value: summary.converted, note: `${summary.disqualified} closed or unqualified` },
          ].map((metric) => (
            <article key={metric.label} className="ops-metric-card">
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.note}</small>
            </article>
          ))}
        </section>

        <section className="detail-card ops-card">
          <div className="ops-section-head">
            <div>
              <p className="eyebrow">Website signups</p>
              <h2>Leads captured from `/signup`</h2>
            </div>
            <span className="ops-pill">CRM pipeline</span>
          </div>

          {leads.length ? (
            <div className="crm-lead-grid">
              {leads.map((lead) => (
                <article key={lead.id} className="crm-lead-card">
                  <div className="crm-lead-top">
                    <div>
                      <strong>{lead.company}</strong>
                      <span>{lead.email}</span>
                    </div>
                    <span className={`ops-status ops-status-${lead.status.toLowerCase()}`}>
                      {statusLabels[lead.status]}
                    </span>
                  </div>

                  <div className="crm-meta">
                    <span>Workspace: {lead.workspaceSlug}.zenify.cx</span>
                    <span>Team size: {lead.teamSize}</span>
                    <span>Goal: {primaryGoalLabels[lead.primaryGoal] ?? lead.primaryGoal}</span>
                    <span>Created: {formatDate(lead.createdAt)}</span>
                  </div>

                  {(() => {
                    const { daysLeft, pct } = getTrialRemaining(lead.createdAt, now);
                    return (
                      <div style={{ marginTop: 8, marginBottom: 16 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 12,
                            marginBottom: 10,
                          }}
                        >
                          <span style={{ color: "var(--muted)", fontWeight: 700, fontSize: "0.9rem" }}>
                            Trial remaining
                          </span>
                          <strong style={{ color: "var(--primary-deep)", fontWeight: 900, fontSize: "0.95rem" }}>
                            {daysLeft} / {TRIAL_LENGTH_DAYS} days
                          </strong>
                        </div>

                        <div
                          className="trial-progress"
                          role="progressbar"
                          aria-label="Trial remaining"
                          aria-valuemin={0}
                          aria-valuemax={TRIAL_LENGTH_DAYS}
                          aria-valuenow={daysLeft}
                        >
                          <span style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })()}

                  <div className="crm-actions">
                    {[
                      "CONTACTED",
                      "QUALIFIED",
                      "CONVERTED",
                      "DISQUALIFIED",
                    ].map((status) => (
                      <form key={status} action={`/app/crm/leads/${lead.id}/status`} method="post">
                        <input type="hidden" name="status" value={status} />
                        <button
                          type="submit"
                          className={`crm-action-button ${lead.status === status ? "crm-action-button-active" : ""}`}
                        >
                          {statusLabels[status]}
                        </button>
                      </form>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="lead compact">No signup leads have been captured yet.</p>
          )}
        </section>
      </div>
    </AppShell>
  );
}
