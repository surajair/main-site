// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip API routes, static files, and internal Next.js routes
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/api/preview") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/static/") || // Prevent infinite loops
    pathname.startsWith("/assets/")
  ) {
    return NextResponse.next();
  }
  const hostname = request.headers.get("host");
  // If no hostname, continue without rewriting
  if (!hostname) {
    return NextResponse.next();
  }
  let finalHostname = hostname.replace(/^www\./, ""); // Remove www. prefix if present

  // Get the root domain from environment variable
  const appDomain = process.env.APP_DOMAIN || "app.localhost:3000";

  // For app subdomain, continue without rewriting (dashboard/builder)
  if (finalHostname === appDomain) {
    if (pathname?.includes("/reset-password")) {
      return NextResponse.next({ headers: { "x-redirection-type": "reset-password" } });
    }
    return NextResponse.next();
  }

  // For custom domains or other subdomains, rewrite to sites route
  const rewriteUrl = new URL(`/sites/${finalHostname}${pathname}`, request.url);
  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sites (prevent infinite loops)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
