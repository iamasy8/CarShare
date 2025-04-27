"use client"

import React, { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"

interface RoleThemeProviderProps {
  children: React.ReactNode
}

export function RoleThemeProvider({ children }: RoleThemeProviderProps) {
  const { user } = useAuth()
  
  useEffect(() => {
    // Add or remove role-specific theme class based on user role
    if (user) {
      // First remove all role theme classes
      document.documentElement.classList.remove("client-theme", "owner-theme", "admin-theme")
      
      // Then add the appropriate class based on the user's role
      if (user.role === "client") {
        document.documentElement.classList.add("client-theme")
      } else if (user.role === "owner") {
        document.documentElement.classList.add("owner-theme")
      } else if (user.role === "admin" || user.role === "superadmin") {
        document.documentElement.classList.add("admin-theme")
      }
    } else {
      // Remove all role theme classes if no user is logged in
      document.documentElement.classList.remove("client-theme", "owner-theme", "admin-theme")
    }
  }, [user])
  
  return <>{children}</>
} 