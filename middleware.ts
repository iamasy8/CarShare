import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { securityUtils } from "@/lib/utils"

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// This middleware will run on all routes
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for API routes and static files
  if (pathname.startsWith('/api') || 
      pathname.startsWith('/_next') || 
      pathname.includes('.')) {
    return NextResponse.next()
  }
  
  // Define protected routes and their required roles
  const protectedRoutes = {
    '/dashboard': ['client', 'owner', 'admin', 'superadmin'],
    '/owner/dashboard': ['owner', 'admin', 'superadmin'],
    '/owner/cars': ['owner', 'admin', 'superadmin'],
    '/owner/bookings': ['owner', 'admin', 'superadmin'],
    '/owner/settings': ['owner', 'admin', 'superadmin'],
    '/admin': ['admin', 'superadmin'],
    '/admin/users': ['admin', 'superadmin'],
    '/admin/settings': ['superadmin'], // Only super admins can access settings
    '/bookings': ['client', 'owner', 'admin', 'superadmin'],
    '/messages': ['client', 'owner', 'admin', 'superadmin'],
    '/favorites': ['client', 'owner', 'admin', 'superadmin'],
    '/profile': ['client', 'owner', 'admin', 'superadmin'],
  }
  
  // Define public only routes (e.g., login/register pages that should redirect if already authenticated)
  const publicOnlyRoutes = ['/login', '/register']
  const isPublicOnlyRoute = publicOnlyRoutes.includes(pathname) && !pathname.includes('/login/admin')
  
  // Check if the route is protected
  const isProtectedRoute = Object.keys(protectedRoutes).some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
  
  // For client-side auth, we'll skip the server-side protection
  // The auth check will be handled by the client-side auth context
  // The auth check will be handled by the client-side auth context
  if (isProtectedRoute) {
    // We won't redirect here since auth is handled client-side
    // This allows the page to load and then the client-side auth context
    // will redirect if needed
  }
  
  // Continue with the request
  const response = NextResponse.next()

  // Add security headers
  Object.entries(securityUtils.securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") || "anonymous"
  const now = Date.now()
  const windowMs = securityUtils.rateLimit.windowMs
  const max = securityUtils.rateLimit.max

  const rateLimitInfo = rateLimitStore.get(ip)
  if (rateLimitInfo) {
    if (now > rateLimitInfo.resetTime) {
      rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
    } else if (rateLimitInfo.count >= max) {
      return new NextResponse("Too Many Requests", { status: 429 })
    } else {
      rateLimitInfo.count++
    }
  } else {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
  }

  // Add Content Security Policy header
  response.headers.set(
    'Content-Security-Policy',
    `default-src 'self'; connect-src 'self' http://localhost:8000 http://localhost:8000/api; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com https://ui-avatars.com;`
  )

  return response
}

// Define which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
