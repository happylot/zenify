import { PlanCode } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { schedulePlanChange } from "@/lib/billing";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ subscriptionId: string }> },
) {
  try {
    const body = (await request.json()) as {
      workspaceId?: string;
      customerId?: string;
      toPlan?: PlanCode;
      toSeatCount?: number;
      effectiveAt?: string;
    };

    if (!body.workspaceId || !body.customerId || !body.toPlan || !body.toSeatCount || !body.effectiveAt) {
      return NextResponse.json({ error: "Missing plan change payload" }, { status: 400 });
    }

    const { subscriptionId } = await params;
    const planChange = await schedulePlanChange({
      subscriptionId,
      workspaceId: body.workspaceId,
      customerId: body.customerId,
      toPlan: body.toPlan,
      toSeatCount: body.toSeatCount,
      effectiveAt: new Date(body.effectiveAt),
    });

    return NextResponse.json({ planChange }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to schedule plan change";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
