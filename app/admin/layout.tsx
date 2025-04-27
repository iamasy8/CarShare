"use client"

import React, { ReactNode } from "react"
import { AdminSidebar } from "@/components/dashboards/admin-sidebar"
import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"
import { cn } from "@/lib/utils" 

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isAdmin, status } = useAuth()
  
  // Check if the user is authenticated and is an admin
  if (status === "authenticated" && !isAdmin) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className={cn("flex-1 p-6 md:p-8")}>
        {children}
      </div>
    </div>
  )
} 