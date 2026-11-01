import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Concept: Edge Middleware for Route Protection in Next.js App Router.
 * Why: Prevents unauthenticated users from accessing protected dashboard routes before page rendering.
 * How: Checks for the presence of Better Auth session token cookies on protected routes.
 * Example: Visiting /create-event while logged out immediately redirects to /login?callbackUrl=/create-event.
 */

const PROTECTED_ROUTES = [
  "/create-event",
  "/manage-events",
  "/joined-events",
  "/profile",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtected) {
    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value ||
      request.cookies.get("__Secure-better-auth.session_token")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/create-event/:path*",
    "/manage-events/:path*",
    "/joined-events/:path*",
    "/profile/:path*",
  ],
};
