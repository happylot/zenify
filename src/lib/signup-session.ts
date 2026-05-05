import "server-only";

import { createHmac } from "node:crypto";

export const SIGNUP_SESSION_COOKIE = "zenify_signup_lead";
const TTL_SECONDS = 30 * 60;

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET. Configure session signing before enabling signup.");
  }
  return secret;
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  return Buffer.from(`${normalized}${padding}`, "base64").toString("utf8");
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function getSignupSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL_SECONDS,
  };
}

export function createSignupSessionToken(leadId: string) {
  const payload = JSON.stringify({ leadId, exp: Date.now() + TTL_SECONDS * 1000 });
  const encoded = toBase64Url(payload);
  return `${encoded}.${sign(encoded)}`;
}

export function readSignupSessionToken(token?: string | null): { leadId: string } | null {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  if (sign(encoded) !== signature) return null;

  let payload: { leadId?: unknown; exp?: unknown };
  try {
    payload = JSON.parse(fromBase64Url(encoded));
  } catch {
    return null;
  }

  const exp = typeof payload.exp === "number" ? payload.exp : 0;
  if (exp <= Date.now()) return null;
  if (typeof payload.leadId !== "string" || !payload.leadId) return null;

  return { leadId: payload.leadId };
}