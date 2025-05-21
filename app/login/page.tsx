"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Car, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context" // Use the login function from AuthContext
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || ""

  // Get user, login function, and the loading state object from AuthContext
  const { user, login, loading } = useAuth() // Get user, login, and loading object

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isSubmittingForm, setIsSubmittingForm] = useState(false) // Renamed for clarity: local form submission state
  const [error, setError] = useState("")

  // Check if there's a pre-filled role for demo purposes
  const role = searchParams.get("role") || ""

  // Set pre-filled demo credentials if role is provided
  useEffect(() => {
    if (role === "owner") {
      setEmail("owner@example.com")
      setPassword("password")
    } else if (role === "client") {
      setEmail("client@example.com")
      setPassword("password")
    }
  }, [role])

  // useEffect to handle redirection after user state updates
  useEffect(() => {
    if (user) { // Check if the user object is available (meaning authentication was successful)
      // Once user is set, stop the local form submitting state
      setIsSubmittingForm(false);

      if (redirectTo) {
        router.push(redirectTo)
      } else if (user.role === "admin") {
        // Redirect to admin login path (or admin dashboard if already logged in)
        router.push("/login/admin") // Or wherever your admin login/dashboard is
      } else if (user.role === "owner") {
        router.push("/owner/dashboard")
      } else {
        router.push("/") // Default for clients
      }
    }
  }, [user, redirectTo, router]) // Depend on user, redirectTo, and router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!email.trim()) {
      setError("Veuillez saisir votre email.")
      return
    }

    if (!password) {
      setError("Veuillez saisir votre mot de passe.")
      return
    }

    setIsSubmittingForm(true) // Start local form submitting state

    try {
      // Call the login function from AuthContext - AuthContext handles fetching user and setting state
      await login(email, password)

      // The useEffect will handle redirection upon successful login and user state update.
      // We don't set isSubmittingForm to false here because the useEffect
      // will do it once the user is set, which happens after the login
      // and fetchUserProfile calls complete.

    } catch (err) {
      console.error("Login form submission failed:", err); // Log the error
      if (err instanceof Error) {
        setError(err.message || "Email ou mot de passe incorrect.")
      } else {
        setError("Email ou mot de passe incorrect.")
      }
      setIsSubmittingForm(false) // Stop local form submitting state on error
    }
  }


  // Adjust the disabled state of the button to consider BOTH local and auth context loading states
  const isButtonDisabled = isSubmittingForm || loading.login;


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Connexion</h1>
            <p className="text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Connectez-vous à votre compte CarShare
            </p>
          </div>
        </div>
        <div className="mx-auto w-full max-w-md space-y-6 mt-8">
          <div className="bg-white dark:bg-gray-950 p-8 rounded-lg border shadow-sm">
            <div className="flex justify-center mb-6">
              <Link href="/" className="flex items-center gap-2">
                <Car className="h-6 w-6 text-red-600" />
                <span className="text-xl font-bold">CarShare</span>
              </Link>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="exemple@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link href="/forgot-password" className="text-sm text-red-600 hover:underline">
                    Mot de passe oublié?
                  </Link>
                </div>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
                <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Se souvenir de moi
                </Label>
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isButtonDisabled}>
                {isButtonDisabled ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              Vous n'avez pas de compte?{" "}
              <Link href="/register" className="text-red-600 hover:underline">
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
