"use server";

import { cookies } from "next/headers";
import {
  attachPaypalSubscriptionToLead,
  getSignupLeadById,
  markSignupLeadConverted,
} from "@/lib/crm";
import { SIGNUP_SESSION_COOKIE, readSignupSessionToken } from "@/lib/signup-session";
import { isSelfServePlan } from "@/lib/site-data";
import { sendTelegramMessage } from "@/lib/telegram";
import { ZenifyApiError, callZenifyApi } from "@/lib/zenify-api";

export type ActivateOk = {
  ok: true;
  email: string;
  loginUrl?: string;
  message: string;
  emailSent: boolean;
  alreadyActive: boolean;
};

export type ActivateFail = {
  ok: false;
  statusCode: number;
  message: string;
  idempotent?: boolean;
  paypalStatus?: string;
  conflictField?: string;
};

async function loadLeadFromCookie() {
  const store = await cookies();
  const token = store.get(SIGNUP_SESSION_COOKIE)?.value;
  const session = readSignupSessionToken(token);
  if (!session) return null;
  return getSignupLeadById(session.leadId);
}

/**
 * Called from <PayPalButtons createSubscription>. Must return the
 * PayPal subscription id (string) for the SDK to render the popup.
 * On any failure, we throw — the SDK reports the error to the caller.
 */
export async function startCheckout(): Promise<string> {
  const lead = await loadLeadFromCookie();
  if (!lead) {
    throw new ZenifyApiError("Your session expired. Please start over.", 410);
  }

  if (!lead.planCode || !isSelfServePlan(lead.planCode) || !lead.seats) {
    throw new ZenifyApiError("Signup profile is missing plan or seats.", 422);
  }

  const data = await callZenifyApi<{ paypalSubscriptionId?: string }>(
    "POST",
    "/v2/public/signup/checkout",
    {
      email: lead.email,
      companyName: lead.company,
      workspaceSlug: lead.workspaceSlug,
      planCode: lead.planCode,
      seatSize: lead.seats,
      primaryGoal: lead.primaryGoal,
      teamSize: lead.teamSize,
    },
  );

  if (!data?.paypalSubscriptionId) {
    throw new ZenifyApiError("Backend did not return a paypalSubscriptionId.", 502);
  }

  await attachPaypalSubscriptionToLead(lead.id, data.paypalSubscriptionId);

  return data.paypalSubscriptionId;
}

export async function activateSubscription(
  paypalSubscriptionId: string,
): Promise<ActivateOk | ActivateFail> {
  const lead = await loadLeadFromCookie();
  if (!lead) {
    return { ok: false, statusCode: 410, message: "Your session expired. Please start over." };
  }

  try {
    const data = await callZenifyApi<{
      tenant?: { loginUrl?: string };
      message?: string;
      emailSent?: boolean;
      alreadyActive?: boolean;
    }>("POST", "/v2/public/signup/activate", { paypalSubscriptionId });

    void markSignupLeadConverted(lead.id).catch((error) => {
      console.error("[billing.activateSubscription] markConverted failed", error);
    });

    void sendTelegramMessage(
      [
        "Zenify subscription activated",
        `Email: ${lead.email}`,
        `Workspace: ${lead.workspaceSlug}`,
        `Plan: ${lead.planCode} × ${lead.seats} seats`,
        `PayPal subscription: ${paypalSubscriptionId}`,
      ].join("\n"),
    ).catch((error) => {
      console.error("[billing.activateSubscription] telegram failed", error);
    });

    return {
      ok: true,
      email: lead.email,
      loginUrl: data?.tenant?.loginUrl,
      message: data?.message ?? "Subscription active. Please check your email for login credentials.",
      emailSent: data?.emailSent ?? true,
      alreadyActive: data?.alreadyActive ?? false,
    };
  } catch (error) {
    if (error instanceof ZenifyApiError) {
      // 409 idempotent → success-like (already activated by webhook earlier)
      if (error.statusCode === 409 && error.idempotent) {
        void markSignupLeadConverted(lead.id).catch(() => undefined);
        return {
          ok: true,
          email: lead.email,
          message: "Subscription already activated. Please check your email for login credentials.",
          emailSent: true,
          alreadyActive: true,
        };
      }
      return {
        ok: false,
        statusCode: error.statusCode,
        message: error.message,
        idempotent: error.idempotent,
        paypalStatus: error.paypalStatus,
        conflictField: error.conflictField,
      };
    }
    console.error("[billing.activateSubscription]", error);
    return {
      ok: false,
      statusCode: 500,
      message: "Subscription captured but workspace creation failed. The Zenify team will contact you within 24 hours.",
    };
  }
}
