import { NextRequest, NextResponse } from "next/server";
import { createPaypalOrder } from "@/lib/paypal";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      amount?: string;
      currency?: string;
      description?: string;
    };

    const amount = body.amount ?? "79.00";
    const currency = body.currency ?? "USD";
    const description = body.description ?? "Zenify Growth plan - first month";

    const order = await createPaypalOrder({ amount, currency, description });
    return NextResponse.json(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown PayPal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
