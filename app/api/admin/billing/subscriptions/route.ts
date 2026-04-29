import { NextResponse } from "next/server";
import { listSubscriptions } from "@/lib/billing";

export async function GET() {
  try {
    const subscriptions = await listSubscriptions();
    return NextResponse.json({ subscriptions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load subscriptions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
