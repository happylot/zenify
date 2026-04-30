import { AppShell } from "@/components/app-shell";

const telegramMessages: Record<string, string> = {
  sent: "Telegram test sent successfully.",
  failed: "Telegram test failed. Check the details below and review server logs.",
};

export default async function AppSettingsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const telegram = typeof params.telegram === "string" ? params.telegram : undefined;
  const reason = typeof params.reason === "string" ? decodeURIComponent(params.reason) : undefined;

  return (
    <AppShell
      title="Settings"
      description="Workspace configuration, integrations, channels, security, and branding controls belong here."
    >
      <article className="form-card">
        <div className="form-card-head">
          <h2>Telegram notifications</h2>
          <span>Server-side integration check</span>
        </div>
        {telegram && telegramMessages[telegram] ? (
          <div className="admin-auth-error">
            {telegramMessages[telegram]}
            {reason ? ` ${reason}` : ""}
          </div>
        ) : null}
        <form action="/api/admin/telegram/test" method="post">
          <div className="form-footer">
            <p>
              Send a test message to the configured bot and chat. This verifies the current server environment can
              reach the Telegram Bot API with the active credentials.
            </p>
            <button type="submit" className="button">
              Send Telegram test
            </button>
          </div>
        </form>
      </article>
    </AppShell>
  );
}
