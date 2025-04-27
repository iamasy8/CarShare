"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Car, User, AlertCircle, Loader2 } from "lucide-react"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register } = useAuth()
  const initialRole = (searchParams.get("type") as UserRole) || "client"
  const [activeTab, setActiveTab] = useState<UserRole>(initialRole)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  })

  // Update active tab based on URL parameter when component mounts
  useEffect(() => {
    if (initialRole && ["client", "owner"].includes(initialRole)) {
      setActiveTab(initialRole)
    }
  }, [initialRole])

  // Password strength calculation
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0)
      setPasswordFeedback("")
      return
    }

    let strength = 0
    let feedback = "Faible"

    // Length check
    if (formData.password.length >= 8) strength += 25
    
    // Contains uppercase
    if (/[A-Z]/.test(formData.password)) strength += 25
    
    // Contains number
    if (/[0-9]/.test(formData.password)) strength += 25
    
    // Contains special character
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 25

    // Feedback based on strength
    if (strength <= 25) {
      feedback = "Faible"
    } else if (strength <= 50) {
      feedback = "Moyen"
    } else if (strength <= 75) {
      feedback = "Bon"
    } else {
      feedback = "Fort"
    }

    setPasswordStrength(strength)
    setPasswordFeedback(feedback)
  }, [formData.password])

  // Validation functions
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isStrongPassword = (password: string): boolean => {
    return password.length >= 8
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate form data
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("Veuillez remplir tous les champs obligatoires.")
      return
    }

    // Validate email
    if (!isValidEmail(formData.email)) {
      setError("Veuillez entrer une adresse email valide.")
      return
    }

    // Validate password strength
    if (!isStrongPassword(formData.password)) {
      setError("Le mot de passe doit contenir au moins 8 caractères.")
      return
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }

    // Validate terms
    if (!formData.terms) {
      setError("Vous devez accepter les conditions d'utilisation.")
      return
    }

    setIsSubmitting(true)

    try {
      // Register with the selected role from the active tab
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      }

      await register(userData, activeTab)

      // Redirect based on role
      if (activeTab === "owner") {
        // Redirect to welcome page for subscription selection
        router.push("/welcome")
      } else {
        router.push("/") // Default for clients
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`L'inscription a échoué: ${err.message}`)
      } else {
        setError("L'inscription a échoué. Veuillez réessayer.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Créer un compte</h1>
            <p className="text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Rejoignez CarShare et commencez à louer ou à proposer des véhicules
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
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs 
              value={activeTab || "client"} 
              className="w-full" 
              onValueChange={(value) => setActiveTab(value as UserRole)}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="client" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Client
                </TabsTrigger>
                <TabsTrigger value="owner" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Propriétaire
                </TabsTrigger>
              </TabsList>
              <TabsContent value="client" className="space-y-6 pt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Inscrivez-vous en tant que client pour louer des véhicules.
                </p>
              </TabsContent>
              <TabsContent value="owner" className="space-y-6 pt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Inscrivez-vous en tant que propriétaire pour mettre vos véhicules en location.
                </p>
              </TabsContent>
            </Tabs>

            <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Jean"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    autoComplete="given-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Dupont"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="exemple@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <Progress value={passwordStrength} className="h-2" />
                      <span className="text-xs ml-2">{passwordFeedback}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Le mot de passe doit contenir au moins 8 caractères. Pour plus de sécurité, incluez des majuscules, 
                      des chiffres et des caractères spéciaux.
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.terms}
                  onCheckedChange={(checked) => setFormData({ ...formData, terms: checked as boolean })}
                />
                <Label htmlFor="terms" className="text-sm">
                  J'accepte les{" "}
                  <Link href="/terms" className="text-red-600 hover:underline">
                    conditions d'utilisation
                  </Link>{" "}
                  et la{" "}
                  <Link href="/privacy" className="text-red-600 hover:underline">
                    politique de confidentialité
                  </Link>
                </Label>
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  "Créer un compte"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              Vous avez déjà un compte?{" "}
              <Link href="/login" className="text-red-600 hover:underline">
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
