import { NextRequest, NextResponse } from "next/server";
import { updateSignupLeadStatus } from "@/lib/crm";

const SIGNUP_LEAD_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "DISQUALIFIED"] as const;
type SignupLeadStatus = (typeof SIGNUP_LEAD_STATUSES)[number];

function buildPublicUrl(request: NextRequest, pathname: string) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host") ?? request.nextUrl.host;
  const protocol = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  return new URL(pathname, `${protocol}://${host}`);
}

function isSignupLeadStatus(input: string): input is SignupLeadStatus {
  return (SIGNUP_LEAD_STATUSES as readonly string[]).includes(input);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> },
) {
  const formData = await request.formData();
  const status = String(formData.get("status") ?? "");

  if (!isSignupLeadStatus(status)) {
    const url = buildPublicUrl(request, "/app/crm");
    url.searchParams.set("error", "invalid-status");
    return NextResponse.redirect(url);
  }

  const { leadId } = await params;
  await updateSignupLeadStatus(leadId, status);
  return NextResponse.redirect(buildPublicUrl(request, "/app/crm"));
}
