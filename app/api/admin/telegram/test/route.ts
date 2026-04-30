import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { sendTelegramMessage } from "@/lib/telegram";

function buildSettingsUrl(request: NextRequest) {
  return new URL("/app/settings", request.url);
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession(request);
  const url = buildSettingsUrl(request);
  const timestamp = new Date().toISOString();

  const result = await sendTelegramMessage(
    [
      "Zenify Telegram test",
      `Sent by: ${session?.email ?? "unknown-admin"}`,
      `Time: ${timestamp}`,
      "Status: Telegram notifications are configured on the server route.",
    ].join("\n"),
  );

  if (!result.ok) {
    url.searchParams.set("telegram", "failed");
    url.searchParams.set("reason", result.reason);
    return NextResponse.redirect(url, 303);
  }

  url.searchParams.set("telegram", "sent");
  return NextResponse.redirect(url, 303);
}
