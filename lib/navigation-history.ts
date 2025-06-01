"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

/**
 * A hook that sets up smooth navigation history handling.
 * This prevents page refreshes when using the browser's back/forward buttons.
 */
export function useSmoothNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Save the current URL to the history state
    window.history.replaceState({ path: pathname }, "", pathname)

    // Handle popstate events (back/forward buttons)
    const handlePopState = (event: PopStateEvent) => {
      // Prevent default navigation behavior
      if (event.state?.path) {
        // Use Next.js router to navigate without a page refresh
        router.push(event.state.path)
      }
    }

    // Add event listener
    window.addEventListener("popstate", handlePopState)

    // Clean up
    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [pathname, router])
}

/**
 * A utility function to navigate to a URL without refreshing the page
 * and properly updating the browser history.
 */
export function smoothNavigate(url: string) {
  // Push the new URL to the history state
  window.history.pushState({ path: url }, "", url)
  
  // Use the Next.js router to navigate without a page refresh
  const router = useRouter()
  router.push(url)
} 