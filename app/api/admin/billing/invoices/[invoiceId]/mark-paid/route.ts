import { NextRequest, NextResponse } from "next/server";
import { markInvoicePaid } from "@/lib/billing";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> },
) {
  try {
    const { invoiceId } = await params;
    const invoice = await markInvoicePaid(invoiceId);
    return NextResponse.json({ invoice });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to mark invoice as paid";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
