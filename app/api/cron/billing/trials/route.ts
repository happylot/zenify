import { NextRequest, NextResponse } from "next/server";
import { runTrialExpirySweep } from "@/lib/billing";
import { authorizeCronRequest } from "@/lib/cron";

export async function POST(request: NextRequest) {
  try {
    authorizeCronRequest(request);
    const result = await runTrialExpirySweep();
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to run trial sweep";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized cron request" ? 401 : 500 });
  }
}
