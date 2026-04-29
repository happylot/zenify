import type { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "zenify_admin_session";

const DEFAULT_ADMIN_HOST = "admin.zenify.cx";
const DEFAULT_SITE_HOST = "zenify.cx";
const DEFAULT_ADMIN_HOME_PATH = "/app/billing";

type AdminSession = {
  email: string;
  exp: number;
};

function stripPort(host: string) {
  return host.split(":")[0]?.toLowerCase() ?? "";
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

async function signValue(value: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

export function getAdminHost() {
  return stripPort(process.env.ADMIN_HOST ?? DEFAULT_ADMIN_HOST);
}

export function getSiteHost() {
  return stripPort(process.env.SITE_HOST ?? DEFAULT_SITE_HOST);
}

export function getAdminHomePath() {
  return DEFAULT_ADMIN_HOME_PATH;
}

export function isLocalHost(host: string) {
  const normalized = stripPort(host);
  return normalized === "localhost" || normalized === "127.0.0.1" || normalized === "::1";
}

export function isAdminHost(host: string) {
  return stripPort(host) === getAdminHost();
}

export function isPrimarySiteHost(host: string) {
  const normalized = stripPort(host);
  const siteHost = getSiteHost();
  return normalized === siteHost || normalized === `www.${siteHost}`;
}

export function normalizeNextPath(value?: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return getAdminHomePath();
  }

  return value;
}

export function getAdminSessionCookieOptions() {
  const ttlHours = Number(process.env.ADMIN_SESSION_TTL_HOURS ?? 12);
  const maxAge = Number.isFinite(ttlHours) && ttlHours > 0 ? Math.round(ttlHours * 60 * 60) : 43200;

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export async function createAdminSessionToken(email: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET. Configure admin session signing before enabling login.");
  }

  const ttlSeconds = getAdminSessionCookieOptions().maxAge;
  const payload = new URLSearchParams({
    email,
    exp: String(Date.now() + ttlSeconds * 1000),
  }).toString();
  const encodedPayload = encodeURIComponent(payload);
  const signature = await signValue(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export async function verifyAdminSessionToken(token?: string | null): Promise<AdminSession | null> {
  if (!token) {
    return null;
  }

  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    return null;
  }

  const [encodedPayload, providedSignature] = token.split(".");

  if (!encodedPayload || !providedSignature) {
    return null;
  }

  const expectedSignature = await signValue(encodedPayload, secret);

  if (expectedSignature !== providedSignature) {
    return null;
  }

  const payload = new URLSearchParams(decodeURIComponent(encodedPayload));
  const email = payload.get("email");
  const exp = Number(payload.get("exp"));

  if (!email || !Number.isFinite(exp) || exp <= Date.now()) {
    return null;
  }

  return { email, exp };
}

export async function getAdminSession(request: NextRequest) {
  return verifyAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

export function buildAdminRedirectUrl(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.hostname = getAdminHost();
  url.pathname = pathname;
  url.search = request.nextUrl.search;
  return url;
}
