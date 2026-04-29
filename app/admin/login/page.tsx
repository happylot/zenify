import { getAdminHost, getAdminHomePath, normalizeNextPath } from "@/lib/admin-auth";
import { isAdminLoginConfigured } from "@/lib/admin-password";

const loginMessages: Record<string, string> = {
  invalid: "Incorrect email or password.",
  config: "Admin login is not configured yet. Add the required admin environment variables first.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const errorParam = Array.isArray(params.error) ? params.error[0] : params.error;
  const nextParam = Array.isArray(params.next) ? params.next[0] : params.next;
  const nextPath = normalizeNextPath(nextParam);
  const loginConfigured = isAdminLoginConfigured();
  const hostname = getAdminHost();

  return (
    <section className="section">
      <div className="container form-layout">
        <aside className="app-sidebar signup-sidebar">
          <p className="eyebrow">Admin access</p>
          <h2>{hostname}</h2>
          <p className="lead compact">
            This subdomain is reserved for internal operations such as billing controls, account locks,
            subscription oversight, and future back-office management.
          </p>
          <div className="mini-stat-grid">
            <article>
              <strong>Protected</strong>
              <p>All `/app` pages and `/api/admin` endpoints require an authenticated admin session.</p>
            </article>
            <article>
              <strong>Isolated</strong>
              <p>Main marketing traffic stays on `zenify.cx`, while admin traffic moves to a separate host.</p>
            </article>
          </div>
        </aside>

        <article className="form-card">
          <div className="form-card-head">
            <div>
              <p className="eyebrow">Sign in</p>
              <h2>Zenify admin console</h2>
            </div>
          </div>

          {!loginConfigured ? (
            <div className="paypal-error">
              Set `ADMIN_HOST`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `ADMIN_SESSION_SECRET`
              before using this login page.
            </div>
          ) : null}

          {errorParam && loginMessages[errorParam] ? (
            <div className="paypal-error">{loginMessages[errorParam]}</div>
          ) : null}

          <form action="/admin/login/submit" method="post">
            <div className="form-grid">
              <label className="form-span-2">
                <span>Admin email</span>
                <input type="email" name="email" autoComplete="email" required placeholder="ops@zenify.cx" />
              </label>
              <label className="form-span-2">
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter your admin password"
                />
              </label>
            </div>
            <input type="hidden" name="next" value={nextPath || getAdminHomePath()} />
            <div className="form-footer">
              <p className="lead compact">Use your provisioned admin account to continue into the internal workspace.</p>
              <button type="submit" className="button" disabled={!loginConfigured}>
                Enter admin console
              </button>
            </div>
          </form>
        </article>
      </div>
    </section>
  );
}
