import { NextRequest, NextResponse } from "next/server";
import { capturePaypalOrder } from "@/lib/paypal";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { orderId?: string };

    if (!body.orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const capture = await capturePaypalOrder(body.orderId);
    return NextResponse.json(capture);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown PayPal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
