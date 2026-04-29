import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminHost,
  getAdminHomePath,
  getAdminSessionCookieOptions,
  normalizeNextPath,
} from "@/lib/admin-auth";
import { isAdminLoginConfigured, verifyAdminCredentials } from "@/lib/admin-password";

function buildPublicUrl(request: NextRequest, pathname: string) {
  const protocol = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  return new URL(pathname, `${protocol}://${getAdminHost()}`);
}

function buildLoginRedirect(request: NextRequest, error: string, nextPath: string) {
  const url = buildPublicUrl(request, "/admin/login");
  url.searchParams.set("error", error);

  if (nextPath !== getAdminHomePath()) {
    url.searchParams.set("next", nextPath);
  }

  return NextResponse.redirect(url);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const nextPath = normalizeNextPath(String(formData.get("next") ?? ""));

  if (!isAdminLoginConfigured()) {
    return buildLoginRedirect(request, "config", nextPath);
  }

  if (!verifyAdminCredentials(email, password)) {
    return buildLoginRedirect(request, "invalid", nextPath);
  }

  const token = await createAdminSessionToken(email);
  const response = NextResponse.redirect(buildPublicUrl(request, nextPath));
  response.cookies.set(ADMIN_SESSION_COOKIE, token, getAdminSessionCookieOptions());
  return response;
}
