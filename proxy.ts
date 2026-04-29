import { NextResponse, type NextRequest } from "next/server";
import {
  buildAdminRedirectUrl,
  getAdminHomePath,
  getAdminSession,
  isAdminHost,
  isLocalHost,
  isPrimarySiteHost,
  normalizeNextPath,
} from "@/lib/admin-auth";

function isAppPage(pathname: string) {
  return pathname === "/app" || pathname.startsWith("/app/");
}

function isAdminPage(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isAdminApi(pathname: string) {
  return pathname.startsWith("/api/admin/");
}

function isLoginPage(pathname: string) {
  return pathname === "/admin/login";
}

function isLoginAction(pathname: string) {
  return pathname === "/admin/login/submit";
}

function isLogoutPath(pathname: string) {
  return pathname === "/admin/logout";
}

function getLoginUrl(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";

  const nextPath = normalizeNextPath(
    `${request.nextUrl.pathname}${request.nextUrl.search ? request.nextUrl.search : ""}`,
  );

  if (nextPath !== getAdminHomePath()) {
    url.searchParams.set("next", nextPath);
  }

  return url;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? request.nextUrl.host;
  const onAdminHost = isAdminHost(host);
  const onPrimarySiteHost = isPrimarySiteHost(host);
  const localHost = isLocalHost(host);
  const session = await getAdminSession(request);
  const appPage = isAppPage(pathname);
  const adminPage = isAdminPage(pathname);
  const adminApi = isAdminApi(pathname);
  const loginPage = isLoginPage(pathname);
  const loginAction = isLoginAction(pathname);
  const logoutPath = isLogoutPath(pathname);
  const protectedUi = appPage || adminPage;

  if (!localHost && onPrimarySiteHost && (appPage || adminPage)) {
    return NextResponse.redirect(buildAdminRedirectUrl(request, pathname));
  }

  if (onAdminHost && !pathname.startsWith("/api/") && !protectedUi) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = session ? getAdminHomePath() : "/admin/login";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (adminApi) {
    if (!session) {
      return NextResponse.json({ error: "Unauthorized admin request" }, { status: 401 });
    }

    return NextResponse.next();
  }

  if (protectedUi) {
    if (!session && !loginPage && !loginAction) {
      return NextResponse.redirect(getLoginUrl(request));
    }

    if (session && (loginPage || pathname === "/admin")) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = getAdminHomePath();
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }

    if (!session && logoutPath) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin/login";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (onAdminHost && pathname === "/") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = session ? getAdminHomePath() : "/admin/login";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
