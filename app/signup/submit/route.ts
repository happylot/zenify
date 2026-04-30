import { NextRequest, NextResponse } from "next/server";
import { createSignupLead } from "@/lib/crm";
import { sendTelegramMessage } from "@/lib/telegram";

function buildPublicUrl(request: NextRequest, pathname: string) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host") ?? request.nextUrl.host;
  const protocol = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  return new URL(pathname, `${protocol}://${host}`);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const lead = await createSignupLead({
      email: String(formData.get("email") ?? ""),
      company: String(formData.get("company") ?? ""),
      workspaceSlug: String(formData.get("workspaceSlug") ?? ""),
      teamSize: String(formData.get("teamSize") ?? ""),
      primaryGoal: String(formData.get("primaryGoal") ?? ""),
    });

    // Best-effort: Telegram failure should not block signup->billing flow.
    void sendTelegramMessage(
      [
        "New Zenify signup lead",
        `Email: ${lead.email}`,
        `Company: ${lead.company}`,
        `Workspace: ${lead.workspaceSlug}.zenify.cx`,
        `Team size: ${lead.teamSize}`,
        `Primary goal: ${lead.primaryGoal}`,
        `Created: ${lead.createdAt.toISOString()}`,
      ].join("\n"),
    )
      .then((result) => {
        if (!result.ok) {
          console.error(`[signup] Telegram notification failed for ${lead.email}: ${result.reason}`);
        }
      })
      .catch((error) => {
        console.error("[signup] Telegram notification crashed", error);
      });

    const url = buildPublicUrl(request, "/billing");
    url.searchParams.set("signup", "created");
    return NextResponse.redirect(url);
  } catch (error) {
    const url = buildPublicUrl(request, "/signup");
    url.searchParams.set("error", error instanceof Error ? error.message : "Unable to save signup");
    return NextResponse.redirect(url);
  }
}
