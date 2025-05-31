"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface RouteProtectionProps {
  children: React.ReactNode
  requiredRoles?: string[]
}

export function RouteProtection({ children, requiredRoles = ["client", "owner", "admin", "superadmin"] }: RouteProtectionProps) {
  const { user, status } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If authentication status is loading, do nothing yet
    if (status === "loading") return
    
    // If not authenticated, redirect to login
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    
    // If authenticated but role doesn't match required roles
    if (user && !requiredRoles.includes(user.role)) {
      // Redirect based on role
      if (user.role === "superadmin" || user.role === "admin") {
        router.push("/admin")
      } else if (user.role === "owner") {
        router.push("/owner/dashboard")
      } else {
        router.push("/dashboard")
      }
    }
  }, [user, status, router, requiredRoles])

  // Show nothing while checking authentication
  if (status === "loading" || status === "unauthenticated" || (user && !requiredRoles.includes(user.role))) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
    </div>
  }

  // If authenticated and role matches, show the children
  return <>{children}</>
} 