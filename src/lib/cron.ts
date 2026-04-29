import { NextRequest } from "next/server";

export function authorizeCronRequest(request: NextRequest) {
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret) {
    throw new Error("Missing CRON_SECRET. Configure cron authentication before running billing jobs.");
  }

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "");

  if (token !== expectedSecret) {
    throw new Error("Unauthorized cron request");
  }
}
