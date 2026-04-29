import { NextRequest, NextResponse } from "next/server";
import { runSubscriptionRenewalSweep } from "@/lib/billing";
import { authorizeCronRequest } from "@/lib/cron";

export async function POST(request: NextRequest) {
  try {
    authorizeCronRequest(request);
    const result = await runSubscriptionRenewalSweep();
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to run renewal sweep";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized cron request" ? 401 : 500 });
  }
}
