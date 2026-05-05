"use server";

import { cookies } from "next/headers";
import {
  attachPaypalOrderToLead,
  getSignupLeadById,
  markSignupLeadConverted,
} from "@/lib/crm";
import { SIGNUP_SESSION_COOKIE, readSignupSessionToken } from "@/lib/signup-session";
import { isSelfServePlan } from "@/lib/site-data";
import { sendTelegramMessage } from "@/lib/telegram";
import { ZenifyApiError, callZenifyApi } from "@/lib/zenify-api";

export type CheckoutOk = {
  ok: true;
  paypalOrderId: string;
};

export type CheckoutFail = {
  ok: false;
  statusCode: number;
  message: string;
  conflictField?: string;
};

export type ActivateOk = {
  ok: true;
  email: string;
  loginUrl?: string;
  message: string;
  emailSent: boolean;
};

export type ActivateFail = {
  ok: false;
  statusCode: number;
  message: string;
};

async function loadLeadFromCookie() {
  const store = await cookies();
  const token = store.get(SIGNUP_SESSION_COOKIE)?.value;
  const session = readSignupSessionToken(token);
  if (!session) return null;
  return getSignupLeadById(session.leadId);
}

export async function startCheckout(): Promise<CheckoutOk | CheckoutFail> {
  const lead = await loadLeadFromCookie();
  if (!lead) {
    return { ok: false, statusCode: 410, message: "Your session expired. Please start over." };
  }

  if (!lead.planCode || !isSelfServePlan(lead.planCode) || !lead.seats) {
    return { ok: false, statusCode: 422, message: "Signup profile is missing plan or seats." };
  }

  try {
    const data = await callZenifyApi<{ paypalOrderId: string }>("POST", "/v2/public/signup/checkout", {
      email: lead.email,
      companyName: lead.company,
      workspaceSlug: lead.workspaceSlug,
      seats: lead.seats,
      primaryGoal: lead.primaryGoal,
      planCode: lead.planCode,
      teamSize: lead.teamSize,
    });

    if (!data?.paypalOrderId) {
      return { ok: false, statusCode: 502, message: "Backend did not return a paypalOrderId." };
    }

    await attachPaypalOrderToLead(lead.id, data.paypalOrderId);

    return { ok: true, paypalOrderId: data.paypalOrderId };
  } catch (error) {
    if (error instanceof ZenifyApiError) {
      return {
        ok: false,
        statusCode: error.statusCode,
        message: error.message,
        conflictField: error.conflictField,
      };
    }
    console.error("[billing.startCheckout]", error);
    return { ok: false, statusCode: 500, message: "Unable to start checkout. Please try again." };
  }
}

export async function activateSignup(paypalOrderId: string): Promise<ActivateOk | ActivateFail> {
  const lead = await loadLeadFromCookie();
  if (!lead) {
    return { ok: false, statusCode: 410, message: "Your session expired. Please start over." };
  }

  try {
    const data = await callZenifyApi<{
      tenant?: { loginUrl?: string };
      message?: string;
      emailSent?: boolean;
    }>("POST", "/v2/public/signup/activate", { paypalOrderId });

    void markSignupLeadConverted(lead.id).catch((error) => {
      console.error("[billing.activateSignup] markConverted failed", error);
    });

    void sendTelegramMessage(
      [
        "Zenify signup converted",
        `Email: ${lead.email}`,
        `Workspace: ${lead.workspaceSlug}`,
        `Plan: ${lead.planCode} × ${lead.seats} seats`,
        `PayPal order: ${paypalOrderId}`,
      ].join("\n"),
    ).catch((error) => {
      console.error("[billing.activateSignup] telegram failed", error);
    });

    return {
      ok: true,
      email: lead.email,
      loginUrl: data?.tenant?.loginUrl,
      message: data?.message ?? "Payment successful. Please check your email for login details.",
      emailSent: data?.emailSent ?? true,
    };
  } catch (error) {
    if (error instanceof ZenifyApiError) {
      return { ok: false, statusCode: error.statusCode, message: error.message };
    }
    console.error("[billing.activateSignup]", error);
    return { ok: false, statusCode: 500, message: "Payment captured but workspace creation failed. The Zenify team will contact you within 24 hours." };
  }
}