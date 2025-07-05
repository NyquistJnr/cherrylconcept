// middleware.js (in root directory)

import { NextResponse } from "next/server";

/**
 * Simplified middleware that checks for basic token presence
 * without calling refresh or verify endpoints
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get tokens from cookies (preferred) or check if localStorage might have them
  const accessTokenCookie = request.cookies.get("accessToken")?.value;
  const userIdCookie = request.cookies.get("userId")?.value;

  // For client-side routes, we'll let the AuthContext handle detailed verification
  // Middleware just does basic presence check
  const hasTokens = !!(accessTokenCookie && userIdCookie);

  // Define protected routes that require authentication
  const protectedRoutes = [
    "/account",
    "/dashboard",
    "/profile",
    "/settings",
    "/orders",
    // Add more protected routes here
  ];

  // Define auth routes that should redirect if already logged in
  const authRoutes = [
    "/login",
    "/signup",
    // forgot-password is accessible regardless of auth status
  ];

  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Handle protected routes - redirect to login if no tokens
  if (isProtectedRoute && !hasTokens) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Handle auth routes when tokens present - redirect to account
  if (isAuthRoute && hasTokens) {
    // Check if there's a redirect parameter
    const redirectUrl = request.nextUrl.searchParams.get("redirect");

    if (redirectUrl && redirectUrl.startsWith("/")) {
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // Default redirect to account page
    return NextResponse.redirect(new URL("/account", request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
