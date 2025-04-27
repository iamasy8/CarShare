"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { SubscriptionSelector } from "@/components/subscription/subscription-selector"
import { type BillingPeriod, type SubscriptionTier, subscriptionPlans } from "@/lib/subscription-plans"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, CreditCard } from "lucide-react"

export default function SubscriptionPage() {
  const { user, updateSubscription } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [selectedSubscription, setSelectedSubscription] = useState<{
    tier: SubscriptionTier
    billingPeriod: BillingPeriod
  }>({
    tier: user?.subscription?.tier || "standard",
    billingPeriod: user?.subscription?.billingPeriod || "monthly",
  })

  const handleSubscriptionChange = (subscription: { tier: SubscriptionTier; billingPeriod: BillingPeriod }) => {
    setSelectedSubscription(subscription)
    // Reset messages when selection changes
    setSuccess(false)
    setError("")
  }

  const handleUpdateSubscription = async () => {
    if (!updateSubscription) return

    setIsUpdating(true)
    setSuccess(false)
    setError("")

    try {
      await updateSubscription(selectedSubscription)
      setSuccess(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      setError("La mise à jour de l'abonnement a échoué. Veuillez réessayer.")
    } finally {
      setIsUpdating(false)
    }
  }

  const currentPlan = subscriptionPlans.find((plan) => plan.id === user?.subscription?.tier)
  const selectedPlan = subscriptionPlans.find((plan) => plan.id === selectedSubscription.tier)
  const isCurrentSubscription =
    user?.subscription?.tier === selectedSubscription.tier &&
    user?.subscription?.billingPeriod === selectedSubscription.billingPeriod

  return (
    <div className="container py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Gérer mon abonnement</h1>

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800 mb-6">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>Votre abonnement a été mis à jour avec succès.</AlertDescription>
        </Alert>
      )}

      {user?.subscription && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-red-600" />
              Abonnement actuel
            </CardTitle>
            <CardDescription>Votre abonnement actuel et ses détails</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Plan</p>
                <p className="text-lg font-semibold">{currentPlan?.name || "Standard"}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Facturation</p>
                <p className="text-lg font-semibold">
                  {user.subscription.billingPeriod === "monthly" ? "Mensuelle" : "Annuelle"}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date de début</p>
                <p className="text-lg font-semibold">{user.subscription.startDate.toLocaleDateString()}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Prochaine facturation</p>
                <p className="text-lg font-semibold">{user.subscription.nextBillingDate.toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Changer d'abonnement</CardTitle>
          <CardDescription>Choisissez le plan qui vous convient le mieux</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="w-full overflow-x-auto pb-4">
            <div className="min-w-[600px] lg:min-w-0">
              <SubscriptionSelector
                onSubscriptionChange={handleSubscriptionChange}
                defaultTier={selectedSubscription.tier}
                defaultBillingPeriod={selectedSubscription.billingPeriod}
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleUpdateSubscription}
              disabled={isUpdating || isCurrentSubscription}
              className="bg-red-600 hover:bg-red-700 text-white px-8"
              size="lg"
            >
              {isUpdating
                ? "Mise à jour en cours..."
                : isCurrentSubscription
                  ? "Abonnement actuel"
                  : "Mettre à jour l'abonnement"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
