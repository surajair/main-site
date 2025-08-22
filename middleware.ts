// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')
  const pathname = request.nextUrl.pathname

  // Skip API routes, static files, and internal Next.js routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/sites/') // Prevent infinite loops
  ) {
    return NextResponse.next()
  }

  // If no hostname, continue without rewriting
  if (!hostname) {
    return NextResponse.next()
  }

  if (hostname.startsWith('app.')) {
    return NextResponse.next()
  }

  // Rewrite the request to /sites/[domain]/original-path
  const rewriteUrl = new URL(`/sites/${hostname}${pathname}`, request.url)
  
  return NextResponse.rewrite(rewriteUrl)
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
    '/((?!api|_next/static|_next/image|favicon.ico|sites).*)',
  ],
}
