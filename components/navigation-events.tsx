"use client"

import { useSmoothNavigation } from "@/lib/navigation-history"

/**
 * A component that sets up navigation event listeners.
 * This is used to handle browser back/forward buttons without page refreshes.
 */
export function NavigationEvents() {
  // Set up smooth navigation
  useSmoothNavigation()
  
  // This component doesn't render anything
  return null
} 