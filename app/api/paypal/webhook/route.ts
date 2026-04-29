import { NextRequest, NextResponse } from "next/server";
import { processPaypalWebhookEvent } from "@/lib/billing";
import { verifyPaypalWebhookSignature } from "@/lib/paypal";

export async function POST(request: NextRequest) {
  try {
    const event = (await request.json()) as Record<string, unknown>;

    const transmissionId = request.headers.get("paypal-transmission-id");
    const transmissionTime = request.headers.get("paypal-transmission-time");
    const certUrl = request.headers.get("paypal-cert-url");
    const authAlgo = request.headers.get("paypal-auth-algo");
    const transmissionSig = request.headers.get("paypal-transmission-sig");

    if (!transmissionId || !transmissionTime || !certUrl || !authAlgo || !transmissionSig) {
      return NextResponse.json({ error: "Missing PayPal verification headers" }, { status: 400 });
    }

    const verified = await verifyPaypalWebhookSignature({
      authAlgo,
      certUrl,
      transmissionId,
      transmissionSig,
      transmissionTime,
      webhookEvent: event,
    });

    if (!verified) {
      return NextResponse.json({ error: "Invalid PayPal webhook signature" }, { status: 401 });
    }

    await processPaypalWebhookEvent(event as never);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process PayPal webhook";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
