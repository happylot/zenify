import { NextRequest, NextResponse } from "next/server";
import { createSignupLead } from "@/lib/crm";
import {
  SIGNUP_SESSION_COOKIE,
  createSignupSessionToken,
  getSignupSessionCookieOptions,
} from "@/lib/signup-session";
import { isSelfServePlan } from "@/lib/site-data";
import { sendTelegramMessage } from "@/lib/telegram";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const KNOWN_VALIDATION_REASONS = new Set([
  "Missing signup fields",
  "Invalid plan",
  "Invalid seats",
  "Invalid email",
  "Invalid company name",
  "enterprise-contact-sales",
  "session-expired",
]);

function buildPublicUrl(request: NextRequest, pathname: string) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host") ?? request.nextUrl.host;
  const protocol = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  return new URL(pathname, `${protocol}://${host}`);
}

function redirectWithError(request: NextRequest, reason: string) {
  const url = buildPublicUrl(request, "/signup");
  url.searchParams.set("error", reason);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const email = String(formData.get("email") ?? "").trim();
    const company = String(formData.get("company") ?? "").trim();
    const workspaceSlug = String(formData.get("workspaceSlug") ?? "").trim();
    const teamSize = String(formData.get("teamSize") ?? "").trim();
    const primaryGoal = String(formData.get("primaryGoal") ?? "").trim();
    const planCodeRaw = String(formData.get("planCode") ?? "").trim().toUpperCase();
    const seatsRaw = String(formData.get("seats") ?? "").trim();

    if (!EMAIL_RE.test(email)) {
      return redirectWithError(request, "Invalid email");
    }

    if (company.length < 2 || company.length > 100) {
      return redirectWithError(request, "Invalid company name");
    }

    if (planCodeRaw === "ENTERPRISE") {
      return redirectWithError(request, "enterprise-contact-sales");
    }

    if (!isSelfServePlan(planCodeRaw)) {
      return redirectWithError(request, "Invalid plan");
    }

    const seats = Number.parseInt(seatsRaw, 10);
    if (!Number.isFinite(seats) || seats < 1 || seats > 1000) {
      return redirectWithError(request, "Invalid seats");
    }

    const lead = await createSignupLead({
      email,
      company,
      workspaceSlug,
      teamSize,
      primaryGoal,
      planCode: planCodeRaw,
      seats,
      billingCycle: "monthly",
    });

    void sendTelegramMessage(
      [
        "New Zenify signup lead",
        `Email: ${lead.email}`,
        `Company: ${lead.company}`,
        `Workspace: ${lead.workspaceSlug}`,
        `Plan: ${lead.planCode} × ${lead.seats} seats`,
        `Team size: ${lead.teamSize}`,
        `Primary goal: ${lead.primaryGoal}`,
        `Created: ${lead.createdAt.toISOString()}`,
      ].join("\n"),
    )
      .then((result) => {
        if (!result.ok) {
          console.error(`[signup] Telegram notification failed for ${lead.email}: ${result.reason}`);
        }
      })
      .catch((error) => {
        console.error("[signup] Telegram notification crashed", error);
      });

    const url = buildPublicUrl(request, "/billing");
    const response = NextResponse.redirect(url, 303);
    response.cookies.set(SIGNUP_SESSION_COOKIE, createSignupSessionToken(lead.id), getSignupSessionCookieOptions());
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save signup";
    if (KNOWN_VALIDATION_REASONS.has(message)) {
      return redirectWithError(request, message);
    }
    console.error("[signup/submit] internal error", error);
    return redirectWithError(request, "internal-error");
  }
}