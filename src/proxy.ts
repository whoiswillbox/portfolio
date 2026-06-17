import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, ADMIN_COOKIE, authToken, adminToken } from "@/lib/auth";

/* Two independent gates:
   - Admin area (/admin/*, /api/chat-log): requires the ADMIN_KEY cookie.
   - Public site (everything else): requires the SITE_PASSWORD cookie (if set).
   Each is auto-disabled when its env var is unset. */
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAdminArea =
    path.startsWith("/admin") || path === "/api/chat-log" || path === "/api/feedback-log";

  if (isAdminArea) {
    const adminKey = process.env.ADMIN_KEY;
    if (!adminKey) return NextResponse.next(); // not configured → routes return 501
    const cookie = request.cookies.get(ADMIN_COOKIE)?.value;
    if (cookie && cookie === (await adminToken(adminKey))) return NextResponse.next();
    return redirectTo(request, "/admin/login", path);
  }

  const sitePassword = process.env.SITE_PASSWORD;
  if (!sitePassword) return NextResponse.next(); // gate disabled
  const cookie = request.cookies.get(AUTH_COOKIE)?.value;
  if (cookie && cookie === (await authToken(sitePassword))) return NextResponse.next();
  return redirectTo(request, "/unlock", path);
}

function redirectTo(request: NextRequest, pathname: string, next: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = `?next=${encodeURIComponent(next)}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Run on everything except the auth endpoints/pages and static assets.
  // Static image files are excluded too: the image optimizer fetches the
  // source asset with an internal (cookie-less) request, so gating those paths
  // would block optimization ("isn't a valid image / received null").
  matcher: [
    "/((?!unlock|api/unlock|admin/login|api/admin-login|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|webp|avif|gif|svg|ico)$).*)",
  ],
};
