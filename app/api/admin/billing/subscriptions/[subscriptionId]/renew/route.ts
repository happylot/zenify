import { NextRequest, NextResponse } from "next/server";
import { renewSubscription } from "@/lib/billing";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ subscriptionId: string }> },
) {
  try {
    const { subscriptionId } = await params;
    const subscription = await renewSubscription(subscriptionId);
    return NextResponse.json({ subscription });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to renew subscription";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
