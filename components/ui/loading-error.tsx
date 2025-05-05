"use client"

import { useEffect, useState } from "react"
import { ErrorMessage, LoadingState, offlineUtils } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingErrorProps {
  isLoading?: boolean
  error?: string | null
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function LoadingError({
  isLoading = false,
  error = null,
  children,
  fallback,
}: LoadingErrorProps) {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      offlineUtils.handleOnline()
    }

    const handleOffline = () => {
      setIsOffline(true)
      offlineUtils.handleOffline()
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOffline) {
    return (
      <div
        role="alert"
        className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg"
      >
        <p>Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div
        role="status"
        className="flex items-center justify-center p-4"
        aria-label="Chargement en cours"
      >
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="sr-only">Chargement en cours...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div
        role="alert"
        className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg"
      >
        <p>{error}</p>
      </div>
    )
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return <>{children}</>
} 