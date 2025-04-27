"use client"

import React, { ReactNode } from "react"
import { OwnerSidebar } from "@/components/dashboards/owner-sidebar"
import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"
import { cn } from "@/lib/utils" 

export default function OwnerLayout({ children }: { children: ReactNode }) {
  const { isOwner, status } = useAuth()
  
  // Check if the user is authenticated and is an owner
  if (status === "authenticated" && !isOwner) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen">
      <OwnerSidebar />
      <div className={cn("flex-1 p-6 md:p-8")}>
        {children}
      </div>
    </div>
  )
}
