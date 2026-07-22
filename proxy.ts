import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Gracefully handle legacy /en or /bn locale URL prefixes from browser history/cache
  if (pathname.startsWith("/en/") || pathname.startsWith("/bn/") || pathname === "/en" || pathname === "/bn") {
    const cleanPath = pathname.replace(/^\/(en|bn)/, "") || "/";
    return NextResponse.redirect(new URL(cleanPath, request.url));
  }

  const sessionCookie = getSessionCookie(request);

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAuthRoute = pathname === "/admin-login" || pathname === "/login";

  // Redirect unauthenticated users attempting to access /dashboard to /admin-login
  if (isDashboardRoute && !sessionCookie) {
    const loginUrl = new URL("/admin-login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users visiting /admin-login to /dashboard
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
