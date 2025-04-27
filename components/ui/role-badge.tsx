import React from "react"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/lib/auth-context"

interface RoleBadgeProps {
  role: UserRole
  className?: string
  showLabel?: boolean
}

export function RoleBadge({ role, className, showLabel = true }: RoleBadgeProps) {
  if (!role) return null
  
  return (
    <span className={cn(
      "role-badge",
      role === "client" && "role-badge-client",
      role === "owner" && "role-badge-owner",
      role === "admin" && "role-badge-admin",
      role === "superadmin" && "role-badge-superadmin",
      className
    )}>
      {showLabel && (
        role === "client" ? "Client" :
        role === "owner" ? "Propriétaire" :
        role === "admin" ? "Admin" :
        role === "superadmin" ? "SuperAdmin" : role
      )}
    </span>
  )
} 