import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// Assuming securityUtils is still needed for rate limiting or other security headers
// import { securityUtils } from "@/lib/utils";

// Rate limiting store (Keep if you need rate limiting)
// const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Define paths that do NOT require authentication
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/login/admin', // Assuming this is a public login page for admins
  // Add any other public pages here
];

// Define routes that should redirect authenticated users away (e.g., login/register)
const publicOnlyRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

// Define protected routes and their required roles
// NOTE: While you can define role-based access here,
// backend middleware is the ultimate authority for role/permission checks on API routes.
// This frontend middleware primarily handles authentication gating and basic route redirection.
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
  // Add other protected routes here
};


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- SANCTUM SPA AUTHENTICATION CHECK ---
  // Authentication status is determined by the presence of the Laravel session cookie.
  // Replace 'your_laravel_session_cookie_name' with the actual name of your session cookie.
  // You can find this in your browser's developer tools after logging in.
  // It's often derived from your APP_NAME (e.g., 'my_app_name_session').
const isAuthenticated = request.cookies.has('localhost');
  // -----------------------------------------

  // Allow access to explicitly defined public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Handle redirection for authenticated users trying to access public-only routes
  const isPublicOnlyRoute = publicOnlyRoutes.includes(pathname);
  if (isPublicOnlyRoute && isAuthenticated) {
    // Redirect authenticated users from login/register to a default dashboard
    // You could add more sophisticated role-based redirects here if needed,
    // but keeping it simple in middleware might be better, relying on the
    // destination page/component to handle role-specific rendering.
    return NextResponse.redirect(new URL('/dashboard', request.url)); // Redirect to a default authenticated page
  }

  // --- PROTECTED ROUTES HANDLING ---
  // If the user is not authenticated and is trying to access a route that is not public,
  // redirect them to the login page.
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    // Optionally add a 'redirect' query parameter to go back after login
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // --- ROLE-BASED REDIRECTION (Optional in Middleware, Backend is the ultimate authority) ---
  // You can keep your role-based redirection logic here if you want to prevent users
  // from even reaching certain frontend routes based on their presumed role.
  // However, remember that the backend must also enforce these role/permission checks
  // for API calls, as frontend checks can be bypassed.
  // To implement role checks here, you would need to fetch or have access to the user's role.
  // Storing the role in a cookie might be an option, but relying on the
  // AuthContext's user state *after* the initial fetch in the layout is often more reliable
  // for client-side role-based rendering/redirection within the application.

  // Example (Conceptual - requires user role data in middleware):
  /*
  const userRole = request.cookies.get('user_role')?.value; // Assuming role is stored in a cookie

  const isProtectedRoute = Object.keys(protectedRoutes).some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute && userRole) {
    const allowedRoles = Object.entries(protectedRoutes).find(([route]) =>
      pathname === route || pathname.startsWith(`${route}/`)
    )?.[1];

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      // Redirect based on role (similar to your existing logic)
      if (userRole === 'admin' || userRole === 'superadmin') {
         return NextResponse.redirect(new URL('/admin', request.url));
      } // ... etc.
    }
  }
  */
  // --- END ROLE-BASED REDIRECTION ---


  // If authenticated and not trying to access a public-only route, allow access.
  // Role/permission checks for API routes and finer-grained UI elements should happen
  // on the backend and within client-side components using the AuthContext.
  const response = NextResponse.next();

  // Add security headers (Keep if needed)
  // Object.entries(securityUtils.securityHeaders).forEach(([key, value]) => {
  //   response.headers.set(key, value)
  // })

  // Rate limiting (Keep if needed)
  // const ip = request.headers.get("x-forwarded-for") || "anonymous";
  // ... rate limiting logic ...

  // Session timeout check (REMOVE THIS - Handled by Sanctum/Backend)
  // const session = request.cookies.get("session");
  // if (session) { ... } // <<< --- REMOVE THIS BLOCK --- >>>

  return response;
}

// Define which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - Handled by backend auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Any other public assets or folders you want to exclude
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public/).*)", // Added |public/ example
  ],
};
// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"
// import { securityUtils } from "@/lib/utils"

// // Rate limiting store
// const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// // This middleware will run on all routes
// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl
  
//   // Get the token from cookies (or localStorage for demo purposes)
//   const token = request.cookies.get('token')?.value || null
  
//   // Get user data from cookies (in real implementation, this would be from JWT verification)
//   const userDataCookie = request.cookies.get('user')
//   const sessionExpiryCookie = request.cookies.get('sessionExpiry')
  
//   let userData = null
//   let sessionExpiry = null
  
//   try {
//     if (userDataCookie?.value) {
//       userData = JSON.parse(userDataCookie.value)
//     }
    
//     if (sessionExpiryCookie?.value) {
//       sessionExpiry = new Date(sessionExpiryCookie.value)
//     }
//   } catch (e) {
//     console.error('Failed to parse user data or session cookies:', e)
//   }
  
//   // Check if session has expired
//   const isSessionExpired = sessionExpiry ? new Date() > sessionExpiry : false
  
//   // If session expired, clear the auth and redirect to login
//   if (isSessionExpired && token) {
//     const response = NextResponse.redirect(new URL('/login', request.url))
//     response.cookies.delete('token')
//     response.cookies.delete('user')
//     response.cookies.delete('sessionExpiry')
//     return response
//   }
  
//   // Define admin levels and their permissions
//   const adminLevels = {
//     'superadmin': ['view', 'edit', 'create', 'delete', 'manage_users', 'manage_admins'],
//     'admin': ['view', 'edit', 'create', 'delete']
//   }
  
//   // Define protected routes and their required roles
//   const protectedRoutes = {
//     '/dashboard': ['client', 'owner', 'admin', 'superadmin'],
//     '/owner/dashboard': ['owner', 'admin', 'superadmin'],
//     '/owner/cars': ['owner', 'admin', 'superadmin'],
//     '/owner/bookings': ['owner', 'admin', 'superadmin'],
//     '/owner/settings': ['owner', 'admin', 'superadmin'],
//     '/admin': ['admin', 'superadmin'],
//     '/admin/users': ['admin', 'superadmin'],
//     '/admin/settings': ['superadmin'], // Only super admins can access settings
//     '/bookings': ['client', 'owner', 'admin', 'superadmin'],
//     '/messages': ['client', 'owner', 'admin', 'superadmin'],
//     '/favorites': ['client', 'owner', 'admin', 'superadmin'],
//     '/profile': ['client', 'owner', 'admin', 'superadmin'],
//   }
  
//   // Define admin-only routes - update to match exact login/admin path
//   const adminOnlyRoutes = ['/login/admin']
//   const isAdminOnlyRoute = adminOnlyRoutes.some(route => pathname === route)
  
//   // Check if trying to access admin routes without admin role
//   if (isAdminOnlyRoute && userData?.role !== 'admin' && userData?.role !== 'superadmin') {
//     // If user is logged in but not an admin, redirect to their appropriate dashboard
//     if (userData) {
//       if (userData.role === 'owner') {
//         return NextResponse.redirect(new URL('/owner/dashboard', request.url))
//       } else {
//         return NextResponse.redirect(new URL('/dashboard', request.url))
//       }
//     }
    
//     // If not logged in, redirect to main login
//     return NextResponse.redirect(new URL('/login', request.url))
//   }
  
//   // Check for superadmin only routes
//   const superadminOnlyRoutes = ['/admin/settings']
//   const isSuperadminOnlyRoute = superadminOnlyRoutes.some(route => 
//     pathname === route || pathname.startsWith(`${route}/`)
//   )
  
//   // Redirect non-superadmins trying to access superadmin routes
//   if (isSuperadminOnlyRoute && userData?.role !== 'superadmin') {
//     // If admin trying to access superadmin routes, redirect to admin dashboard
//     if (userData?.role === 'admin') {
//       return NextResponse.redirect(new URL('/admin', request.url))
//     }
    
//     // Otherwise redirect to login
//     return NextResponse.redirect(new URL('/login', request.url))
//   }
  
//   // Check if the route is protected
//   const isProtectedRoute = Object.keys(protectedRoutes).some(route => 
//     pathname === route || pathname.startsWith(`${route}/`)
//   )
  
//   // Define public only routes (e.g., login/register pages that should redirect if already authenticated)
//   const publicOnlyRoutes = ['/login', '/register']
//   const isPublicOnlyRoute = publicOnlyRoutes.includes(pathname) && !pathname.includes('/login/admin')
  
//   // Redirect logic
//   if (isProtectedRoute) {
//     // If not authenticated, redirect to login
//     if (!token || isSessionExpired) {
//       return NextResponse.redirect(new URL('/login', request.url))
//     }
    
//     // If authenticated but no role matches
//     if (userData && userData.role) {
//       const allowedRoles = Object.entries(protectedRoutes).find(([route]) => 
//         pathname === route || pathname.startsWith(`${route}/`)
//       )?.[1]
      
//       if (allowedRoles && !allowedRoles.includes(userData.role)) {
//         // Redirect to unauthorized or dashboard based on role
//         if (userData.role === 'superadmin') {
//           return NextResponse.redirect(new URL('/admin', request.url))
//         } else if (userData.role === 'admin') {
//           return NextResponse.redirect(new URL('/admin', request.url))
//         } else if (userData.role === 'owner') {
//           return NextResponse.redirect(new URL('/owner/dashboard', request.url))
//         } else {
//           return NextResponse.redirect(new URL('/dashboard', request.url))
//         }
//       }
//     }
//   } else if (isPublicOnlyRoute && token && !isSessionExpired) {
//     // If already authenticated and trying to access login/register, redirect to dashboard
//     if (userData) {
//       if (userData.role === 'superadmin' || userData.role === 'admin') {
//         return NextResponse.redirect(new URL('/admin', request.url))
//       } else if (userData.role === 'owner') {
//         return NextResponse.redirect(new URL('/owner/dashboard', request.url))
//       } else {
//         return NextResponse.redirect(new URL('/dashboard', request.url))
//       }
//     }
//   }
  
//   // For active admin users, log their activity
//   if (token && userData && (userData.role === 'admin' || userData.role === 'superadmin')) {
//     console.log(`Admin route access: ${userData.email} accessed ${pathname} at ${new Date().toISOString()}`)
//     // In production, would log to server/database:
//     // await logAdminAccess(userData.id, pathname)
//   }
  
//   // Continue with the request
//   const response = NextResponse.next()

//   // Add security headers
//   Object.entries(securityUtils.securityHeaders).forEach(([key, value]) => {
//     response.headers.set(key, value)
//   })

//   // Rate limiting
//   const ip = request.headers.get("x-forwarded-for") || "anonymous"
//   const now = Date.now()
//   const windowMs = securityUtils.rateLimit.windowMs
//   const max = securityUtils.rateLimit.max

//   const rateLimitInfo = rateLimitStore.get(ip)
//   if (rateLimitInfo) {
//     if (now > rateLimitInfo.resetTime) {
//       rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
//     } else if (rateLimitInfo.count >= max) {
//       return new NextResponse("Too Many Requests", { status: 429 })
//     } else {
//       rateLimitInfo.count++
//     }
//   } else {
//     rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
//   }

//   // Session timeout check
//   const session = request.cookies.get("session")
//   if (session) {
//     const sessionData = JSON.parse(session.value)
//     if (Date.now() - sessionData.lastActivity > 30 * 60 * 1000) {
//       // Session expired
//       response.cookies.delete("session")
//       return NextResponse.redirect(new URL("/login", request.url))
//     }
//   }

//   return response
// }

// // Define which routes this middleware should run on
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// }
