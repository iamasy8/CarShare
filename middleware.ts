import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This middleware will run on all routes
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get the token from cookies (or localStorage for demo purposes)
  const token = request.cookies.get('token')?.value || null
  
  // Get user data from cookies (in real implementation, this would be from JWT verification)
  const userDataCookie = request.cookies.get('user')
  const sessionExpiryCookie = request.cookies.get('sessionExpiry')
  
  let userData = null
  let sessionExpiry = null
  
  try {
    if (userDataCookie?.value) {
      userData = JSON.parse(userDataCookie.value)
    }
    
    if (sessionExpiryCookie?.value) {
      sessionExpiry = new Date(sessionExpiryCookie.value)
    }
  } catch (e) {
    console.error('Failed to parse user data or session cookies:', e)
  }
  
  // Check if session has expired
  const isSessionExpired = sessionExpiry ? new Date() > sessionExpiry : false
  
  // If session expired, clear the auth and redirect to login
  if (isSessionExpired && token) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('token')
    response.cookies.delete('user')
    response.cookies.delete('sessionExpiry')
    return response
  }
  
  // Define admin levels and their permissions
  const adminLevels = {
    'superadmin': ['view', 'edit', 'create', 'delete', 'manage_users', 'manage_admins'],
    'admin': ['view', 'edit', 'create', 'delete']
  }
  
  // Define protected routes and their required roles
  const protectedRoutes = {
    '/dashboard': ['client', 'owner', 'admin', 'superadmin'],
    '/owner': ['owner', 'admin', 'superadmin'],
    '/admin': ['admin', 'superadmin'],
    '/admin/users': ['admin', 'superadmin'],
    '/admin/settings': ['superadmin'], // Only super admins can access settings
    '/bookings': ['client', 'owner', 'admin', 'superadmin'],
    '/messages': ['client', 'owner', 'admin', 'superadmin'],
    '/favorites': ['client', 'owner', 'admin', 'superadmin'],
    '/profile': ['client', 'owner', 'admin', 'superadmin'],
  }
  
  // Define admin-only routes - update to match exact login/admin path
  const adminOnlyRoutes = ['/login/admin']
  const isAdminOnlyRoute = adminOnlyRoutes.some(route => pathname === route)
  
  // Check if trying to access admin routes without admin role
  if (isAdminOnlyRoute && userData?.role !== 'admin' && userData?.role !== 'superadmin') {
    // If user is logged in but not an admin, redirect to their appropriate dashboard
    if (userData) {
      if (userData.role === 'owner') {
        return NextResponse.redirect(new URL('/owner/dashboard', request.url))
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
    
    // If not logged in, redirect to main login
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Check for superadmin only routes
  const superadminOnlyRoutes = ['/admin/settings']
  const isSuperadminOnlyRoute = superadminOnlyRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
  
  // Redirect non-superadmins trying to access superadmin routes
  if (isSuperadminOnlyRoute && userData?.role !== 'superadmin') {
    // If admin trying to access superadmin routes, redirect to admin dashboard
    if (userData?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    
    // Otherwise redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Check if the route is protected
  const isProtectedRoute = Object.keys(protectedRoutes).some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
  
  // Define public only routes (e.g., login/register pages that should redirect if already authenticated)
  const publicOnlyRoutes = ['/login', '/register']
  const isPublicOnlyRoute = publicOnlyRoutes.includes(pathname) && !pathname.includes('/login/admin')
  
  // Redirect logic
  if (isProtectedRoute) {
    // If not authenticated, redirect to login
    if (!token || isSessionExpired) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // If authenticated but no role matches
    if (userData && userData.role) {
      const allowedRoles = Object.entries(protectedRoutes).find(([route]) => 
        pathname === route || pathname.startsWith(`${route}/`)
      )?.[1]
      
      if (allowedRoles && !allowedRoles.includes(userData.role)) {
        // Redirect to unauthorized or dashboard based on role
        if (userData.role === 'superadmin') {
          return NextResponse.redirect(new URL('/admin', request.url))
        } else if (userData.role === 'admin') {
          return NextResponse.redirect(new URL('/admin', request.url))
        } else if (userData.role === 'owner') {
          return NextResponse.redirect(new URL('/owner/dashboard', request.url))
        } else {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }
    }
  } else if (isPublicOnlyRoute && token && !isSessionExpired) {
    // If already authenticated and trying to access login/register, redirect to dashboard
    if (userData) {
      if (userData.role === 'superadmin' || userData.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      } else if (userData.role === 'owner') {
        return NextResponse.redirect(new URL('/owner/dashboard', request.url))
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }
  
  // For active admin users, log their activity
  if (token && userData && (userData.role === 'admin' || userData.role === 'superadmin')) {
    console.log(`Admin route access: ${userData.email} accessed ${pathname} at ${new Date().toISOString()}`)
    // In production, would log to server/database:
    // await logAdminAccess(userData.id, pathname)
  }
  
  // Continue with the request
  return NextResponse.next()
}

// Define which routes this middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/owner/:path*',
    '/admin/:path*',
    '/bookings/:path*',
    '/messages/:path*',
    '/favorites/:path*',
    '/profile/:path*',
    '/login',
    '/login/admin',
    '/register',
  ],
}
