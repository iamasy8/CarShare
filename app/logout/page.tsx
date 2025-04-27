"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function LogoutPage() {
  const router = useRouter()
  const { logout } = useAuth()

  useEffect(() => {
    // Perform logout
    logout()

    // Redirect to home page
    router.push("/")
  }, [logout, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Déconnexion en cours...</h1>
        <p className="text-gray-500 dark:text-gray-400">Vous allez être redirigé vers la page d'accueil.</p>
      </div>
    </div>
  )
}
