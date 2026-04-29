import { NextRequest, NextResponse } from "next/server";
import { unlockWorkspace } from "@/lib/billing";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> },
) {
  try {
    const { workspaceId } = await params;
    const workspace = await unlockWorkspace(workspaceId);
    return NextResponse.json({ workspace });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to unlock workspace";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
