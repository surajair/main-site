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
    pathname.startsWith('/static/') // Prevent infinite loops
  ) {
    return NextResponse.next()
  }

  // If no hostname, continue without rewriting
  if (!hostname) {
    return NextResponse.next()
  }

  // Get the root domain from environment variable
  const rootDomain = process.env.ROOT_DOMAIN || 'localhost:3000'
  const isLocalDev = hostname.includes(rootDomain.split(':')[0])
  
  if (isLocalDev) {
  
    // For app subdomain, continue without rewriting (dashboard/builder)
    if (hostname.startsWith(`app.${rootDomain.split(':')[0]}`)) {
      return NextResponse.next()
    }
    
    // For other subdomains, rewrite to sites route
    if (hostname !== rootDomain && !hostname.startsWith(`app.${rootDomain.split(':')[0]}`)) {
      // Use full hostname for development (e.g., 'site.localhost:3000')
      const rewriteUrl = new URL(`/sites/${hostname}${pathname}`, request.url)
      return NextResponse.rewrite(rewriteUrl)
    }
  } else {
    // Production environment handling
    
    // For app subdomain in production, continue without rewriting
    if (hostname === 'app.' + rootDomain) {
      return NextResponse.next()
    }

    // For custom domains or other subdomains, rewrite to sites route
    const rewriteUrl = new URL(`/sites/${hostname}${pathname}`, request.url)
    return NextResponse.rewrite(rewriteUrl)
  }

  return NextResponse.next()
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
