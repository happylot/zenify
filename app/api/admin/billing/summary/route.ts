import { NextResponse } from "next/server";
import { getBillingSummary } from "@/lib/billing";

export async function GET() {
  try {
    const summary = await getBillingSummary();
    return NextResponse.json(summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load billing summary";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
