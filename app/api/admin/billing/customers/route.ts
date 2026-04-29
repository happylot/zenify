import { NextResponse } from "next/server";
import { listCustomers } from "@/lib/billing";

export async function GET() {
  try {
    const customers = await listCustomers();
    return NextResponse.json({ customers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load customers";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
