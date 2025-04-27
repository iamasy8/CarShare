"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Star, Shield, Zap, Award, Clock, Calendar, Car, AlertCircle } from "lucide-react"
import type { BillingPeriod, SubscriptionTier } from "@/lib/subscription-plans"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function WelcomePage() {
  const { user, updateSubscription } = useAuth()
  const router = useRouter()
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>("standard")
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (user.role !== "owner") {
      router.push("/")
    }
  }, [user, router])

  const handleContinue = async () => {
    // Clear any previous errors
    setError(null)
    setIsLoading(true)

    try {
      await updateSubscription({ tier: selectedTier, billingPeriod })
      router.push("/owner/dashboard")
    } catch (error) {
      console.error("Failed to update subscription:", error)
      setError("Une erreur est survenue lors de la mise à jour de votre abonnement. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || user.role !== "owner") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container max-w-6xl px-4 py-16 mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Bienvenue sur CarShare, {user.name.split(" ")[0]} !</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choisissez l'abonnement qui correspond le mieux à vos besoins pour commencer à louer vos véhicules.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-full shadow-md p-1 flex items-center">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "bg-red-600 text-white"
                  : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              disabled={isLoading}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                billingPeriod === "yearly"
                  ? "bg-red-600 text-white"
                  : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              disabled={isLoading}
            >
              Annuel{" "}
              <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">-20%</span>
            </button>
          </div>
        </div>

        {/* Subscription Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Basic Plan */}
          <Card
            className={`relative overflow-hidden transition-all ${
              selectedTier === "basic"
                ? "ring-2 ring-red-600 dark:ring-red-500 shadow-lg scale-[1.02]"
                : "hover:shadow-md"
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-300"></div>
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">Basique</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pour débuter</p>
                  </div>
                  <Shield className="h-8 w-8 text-gray-400" />
                </div>
                <div className="mb-4">
                  <p className="text-3xl font-bold">
                    {billingPeriod === "monthly" ? "9,99 €" : "95,90 €"}
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      /{billingPeriod === "monthly" ? "mois" : "an"}
                    </span>
                  </p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <p className="text-sm">Jusqu'à 2 véhicules</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <p className="text-sm">Assistance basique</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <p className="text-sm">Visibilité standard</p>
                  </div>
                </div>
                <Button
                  variant={selectedTier === "basic" ? "default" : "outline"}
                  className={`w-full ${selectedTier === "basic" ? "bg-red-600 hover:bg-red-700 text-white" : ""}`}
                  onClick={() => setSelectedTier("basic")}
                  disabled={isLoading}
                >
                  {selectedTier === "basic" ? "Sélectionné" : "Sélectionner"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Standard Plan */}
          <Card
            className={`relative overflow-hidden transition-all ${
              selectedTier === "standard"
                ? "ring-2 ring-red-600 dark:ring-red-500 shadow-lg scale-[1.02]"
                : "hover:shadow-md"
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
            <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              Recommandé
            </div>
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">Standard</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Le plus populaire</p>
                  </div>
                  <Star className="h-8 w-8 text-red-600" />
                </div>
                <div className="mb-4">
                  <p className="text-3xl font-bold">
                    {billingPeriod === "monthly" ? "19,99 €" : "191,90 €"}
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      /{billingPeriod === "monthly" ? "mois" : "an"}
                    </span>
                  </p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <p className="text-sm">Jusqu'à 5 véhicules</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <p className="text-sm">Assistance prioritaire</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <p className="text-sm">Visibilité améliorée</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <p className="text-sm">Statistiques avancées</p>
                  </div>
                </div>
                <Button
                  variant={selectedTier === "standard" ? "default" : "outline"}
                  className={`w-full ${selectedTier === "standard" ? "bg-red-600 hover:bg-red-700 text-white" : ""}`}
                  onClick={() => setSelectedTier("standard")}
                  disabled={isLoading}
                >
                  {selectedTier === "standard" ? "Sélectionné" : "Sélectionner"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card
            className={`relative overflow-hidden transition-all ${
              selectedTier === "premium"
                ? "ring-2 ring-red-600 dark:ring-red-500 shadow-lg scale-[1.02]"
                : "hover:shadow-md"
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">Premium</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pour les professionnels</p>
                  </div>
                  <Award className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="mb-4">
                  <p className="text-3xl font-bold">
                    {billingPeriod === "monthly" ? "39,99 €" : "383,90 €"}
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      /{billingPeriod === "monthly" ? "mois" : "an"}
                    </span>
                  </p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <p className="text-sm">Véhicules illimités</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <p className="text-sm">Assistance VIP 24/7</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <p className="text-sm">Visibilité maximale</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <p className="text-sm">Statistiques avancées</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <p className="text-sm">Outils marketing exclusifs</p>
                  </div>
                </div>
                <Button
                  variant={selectedTier === "premium" ? "default" : "outline"}
                  className={`w-full ${selectedTier === "premium" ? "bg-red-600 hover:bg-red-700 text-white" : ""}`}
                  onClick={() => setSelectedTier("premium")}
                  disabled={isLoading}
                >
                  {selectedTier === "premium" ? "Sélectionné" : "Sélectionner"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-12">
          <h3 className="text-xl font-bold mb-6 text-center">Comparaison des fonctionnalités</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-4 px-4 font-medium text-gray-500 dark:text-gray-400">Fonctionnalité</th>
                  <th className="text-center py-4 px-4 font-medium text-gray-500 dark:text-gray-400">Basique</th>
                  <th className="text-center py-4 px-4 font-medium text-gray-500 dark:text-gray-400">Standard</th>
                  <th className="text-center py-4 px-4 font-medium text-gray-500 dark:text-gray-400">Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-4 px-4 flex items-center">
                    <Car className="h-5 w-5 mr-2 text-gray-500" />
                    Nombre de véhicules
                  </td>
                  <td className="text-center py-4 px-4">2 max</td>
                  <td className="text-center py-4 px-4">5 max</td>
                  <td className="text-center py-4 px-4">Illimité</td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-4 px-4 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-gray-500" />
                    Visibilité dans les recherches
                  </td>
                  <td className="text-center py-4 px-4">Standard</td>
                  <td className="text-center py-4 px-4">Améliorée</td>
                  <td className="text-center py-4 px-4">Maximale</td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-4 px-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-gray-500" />
                    Assistance client
                  </td>
                  <td className="text-center py-4 px-4">Basique</td>
                  <td className="text-center py-4 px-4">Prioritaire</td>
                  <td className="text-center py-4 px-4">VIP 24/7</td>
                </tr>
                <tr className="border-b dark:border-gray-700">
                  <td className="py-4 px-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                    Réservations anticipées
                  </td>
                  <td className="text-center py-4 px-4">30 jours</td>
                  <td className="text-center py-4 px-4">60 jours</td>
                  <td className="text-center py-4 px-4">90 jours</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-gray-500" />
                    Outils marketing
                  </td>
                  <td className="text-center py-4 px-4">Basique</td>
                  <td className="text-center py-4 px-4">Avancés</td>
                  <td className="text-center py-4 px-4">Exclusifs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center">
          <Button
            onClick={handleContinue}
            disabled={isLoading}
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg rounded-full flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Chargement...
              </>
            ) : (
              <>
                Continuer avec l'abonnement{" "}
                {selectedTier === "basic" ? "Basique" : selectedTier === "standard" ? "Standard" : "Premium"}{" "}
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Vous pourrez modifier votre abonnement à tout moment depuis votre tableau de bord.
          </p>
          <div className="mt-8 text-center">
            <p className="text-sm">
              Besoin d'aide pour choisir ?{" "}
              <Link href="/contact" className="text-red-600 hover:underline">
                Contactez-nous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
