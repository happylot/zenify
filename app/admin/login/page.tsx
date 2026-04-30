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
    <section className="admin-auth-shell">
      <div className="admin-auth-card">
        <div className="admin-auth-head">
          <div className="admin-auth-brand">
            <span className="brand-mark">Z</span>
            <div>
              <strong>Zenify Admin</strong>
              <small>{hostname}</small>
            </div>
          </div>
          <div>
            <p className="eyebrow">Sign in</p>
            <h1>Admin Console</h1>
            <p className="admin-auth-copy">Sign in with your admin account to access billing and operations.</p>
          </div>
        </div>

        {!loginConfigured ? (
          <div className="admin-auth-error">
            Set `ADMIN_HOST`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `ADMIN_SESSION_SECRET`
            before using this login page.
          </div>
        ) : null}

        {errorParam && loginMessages[errorParam] ? (
          <div className="admin-auth-error">{loginMessages[errorParam]}</div>
        ) : null}

        <form action="/admin/login/submit" method="post" className="admin-auth-form">
          <label>
            <span>Admin email</span>
            <input type="email" name="email" autoComplete="email" required placeholder="admin@zenify.cx" />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              placeholder="Enter your password"
            />
          </label>
          <input type="hidden" name="next" value={nextPath || getAdminHomePath()} />
          <button type="submit" className="button" disabled={!loginConfigured}>
            Sign in
          </button>
        </form>
      </div>
    </section>
  );
}
