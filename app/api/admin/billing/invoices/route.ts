import { NextResponse } from "next/server";
import { listInvoices } from "@/lib/billing";

export async function GET() {
  try {
    const invoices = await listInvoices();
    return NextResponse.json({ invoices });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load invoices";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
