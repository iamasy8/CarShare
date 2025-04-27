"use client"

import { useAuth } from "@/lib/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { isFeatureIncluded, subscriptionPlans } from "@/lib/subscription-plans"
import Link from "next/link"
import { Info, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Button } from "../ui/button"

interface SubscriptionLimitsAlertProps {
  currentCarCount: number
  showUpgradeLink?: boolean
}

export function SubscriptionLimitsAlert({ 
  currentCarCount, 
  showUpgradeLink = true 
}: SubscriptionLimitsAlertProps) {
  const { user } = useAuth()
  
  if (!user || user.role !== "owner" || !user.subscription) {
    return null
  }
  
  const currentPlan = subscriptionPlans.find(plan => plan.id === user.subscription?.tier)
  if (!currentPlan) return null
  
  // Get the car listing limit based on subscription tier
  let listingLimit = 1 // Default for basic
  
  if (currentPlan.id === "premium") {
    listingLimit = Infinity
  } else if (currentPlan.id === "standard") {
    listingLimit = 3
  }
  
  const listingsRemaining = listingLimit - currentCarCount
  const isAtLimit = listingsRemaining <= 0
  const isApproachingLimit = listingsRemaining === 1
  
  // If they have unlimited listings or plenty remaining, no need to show the alert
  if (listingLimit === Infinity || (!isAtLimit && !isApproachingLimit)) {
    return null
  }
  
  return (
    <Alert variant={isAtLimit ? "destructive" : "default"} className={isAtLimit ? "" : "bg-amber-50 border-amber-200 text-amber-800"}>
      {isAtLimit ? (
        <AlertTriangle className="h-4 w-4" />
      ) : (
        <Info className="h-4 w-4" />
      )}
      <AlertTitle>
        {isAtLimit 
          ? "Limite de véhicules atteinte" 
          : "Vous approchez de votre limite de véhicules"}
      </AlertTitle>
      <AlertDescription className="mt-2">
        {isAtLimit ? (
          <>
            <p>
              Votre abonnement {currentPlan.name} vous permet d'ajouter jusqu'à {listingLimit} véhicule{listingLimit > 1 ? 's' : ''}.
              Pour ajouter plus de véhicules, veuillez mettre à niveau votre abonnement.
            </p>
            {showUpgradeLink && (
              <Button asChild variant="outline" className="mt-2">
                <Link href="/owner/subscription">
                  Mettre à niveau mon abonnement
                </Link>
              </Button>
            )}
          </>
        ) : (
          <>
            <p>
              Votre abonnement {currentPlan.name} vous permet d'ajouter jusqu'à {listingLimit} véhicule{listingLimit > 1 ? 's' : ''}.
              Il vous reste {listingsRemaining} véhicule disponible.
            </p>
            {showUpgradeLink && (
              <Button asChild variant="outline" size="sm" className="mt-2">
                <Link href="/owner/subscription">
                  Voir les options d'abonnement
                </Link>
              </Button>
            )}
          </>
        )}
      </AlertDescription>
    </Alert>
  )
} 