import { NextRequest, NextResponse } from "next/server";
import { lockWorkspace } from "@/lib/billing";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  try {
    const body = (await request.json()) as { reason?: string };
    const { workspaceId } = await params;
    const workspace = await lockWorkspace(workspaceId, body.reason ?? "Manual billing suspension");
    return NextResponse.json({ workspace });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to lock workspace";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
