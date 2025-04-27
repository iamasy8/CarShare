"use client"

import React, { ReactNode } from "react"
import { ClientSidebar } from "@/components/dashboards/client-sidebar"
import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"
import { cn } from "@/lib/utils" 

export default function ClientLayout({ children }: { children: ReactNode }) {
  const { isClient, status } = useAuth()
  
  // Check if the user is authenticated and is a client
  if (status === "authenticated" && !isClient) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen">
      <ClientSidebar />
      <div className={cn("flex-1 p-6 md:p-8")}>
        {children}
      </div>
    </div>
  )
} 