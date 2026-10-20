
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

const GUEST_ONLY_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/",
];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const locale = routing.locales.find(
    (supportedLocale) =>
      pathname === `/${supportedLocale}` ||
      pathname.startsWith(`/${supportedLocale}/`),
  );

  if (!locale) {
    return handleI18nRouting(request);
  }

  const pathnameWithoutLocale =
    pathname.slice(`/${locale}`.length).replace(/\/$/, "") || "/";

  const isProtectedRoute =
    pathnameWithoutLocale === "/dashboard" ||
    pathnameWithoutLocale.startsWith("/dashboard/");

  const isGuestOnlyRoute =
    GUEST_ONLY_ROUTES.includes(pathnameWithoutLocale);

  const hasSessionCookie =
    request.cookies.has("smartdm_session");

  // Protect dashboard routes from requests without a session cookie.
  if (isProtectedRoute && !hasSessionCookie) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = `/${locale}/login`;
    loginUrl.search = "";

    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from guest-only pages.
  if (isGuestOnlyRoute && hasSessionCookie) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    const cookieHeader = request.headers.get("cookie");

    if (apiUrl && cookieHeader) {
      try {
        const response = await fetch(`${apiUrl}/auth/me`, {
          method: "GET",
          headers: {
            cookie: cookieHeader,
          },
          cache: "no-store",
        });

        if (response.ok) {
          const dashboardUrl = request.nextUrl.clone();
          dashboardUrl.pathname = `/${locale}/dashboard`;
          dashboardUrl.search = "";

          return NextResponse.redirect(dashboardUrl);
        }
      } catch {
        // Keep the auth page accessible if session verification fails.
      }
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
