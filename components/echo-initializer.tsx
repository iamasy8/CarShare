"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { initEcho } from "@/lib/echo"

export function EchoInitializer() {
  const { isAuthenticated } = useAuth()
  
  useEffect(() => {
    if (isAuthenticated) {
      // Initialize Echo if the user is authenticated
      initEcho()
    }
  }, [isAuthenticated])
  
  // This component doesn't render anything
  return null
} 