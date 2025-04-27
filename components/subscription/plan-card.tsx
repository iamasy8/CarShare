"use client"

import { Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  type SubscriptionPlan,
  type SubscriptionTier,
  type BillingPeriod,
  getPlanFeatures,
  getYearlySavingsPercentage,
} from "@/lib/subscription-plans"

interface PlanCardProps {
  plan: SubscriptionPlan
  selectedPlan: SubscriptionTier
  billingPeriod: BillingPeriod
  onSelect: (plan: SubscriptionTier) => void
}

export function PlanCard({ plan, selectedPlan, billingPeriod, onSelect }: PlanCardProps) {
  const isSelected = selectedPlan === plan.id
  const price = billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice
  const features = getPlanFeatures(plan)

  return (
    <Card
      className={`relative w-full h-full transition-all duration-200 ${
        isSelected
          ? "border-2 border-red-500 shadow-md"
          : "border border-gray-200 hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      {plan.recommended && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-full">
          Recommandé
        </div>
      )}
      <CardHeader className={`pb-4 ${plan.recommended ? "pt-6" : "pt-4"}`}>
        <CardTitle className="text-xl font-bold text-center">{plan.name}</CardTitle>
        <CardDescription className="text-center text-sm mt-1 h-10 flex items-center justify-center">
          {plan.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-4 space-y-5">
        <div className="text-center">
          <div className="flex items-baseline justify-center">
            <span className="text-3xl font-bold">{price.toFixed(2)}€</span>
            <span className="text-sm text-gray-500 ml-1">/{billingPeriod === "monthly" ? "mois" : "an"}</span>
          </div>

          {billingPeriod === "yearly" && (
            <div className="text-sm text-green-600 font-medium mt-1">
              Économisez {getYearlySavingsPercentage(plan)}% avec l'abonnement annuel
            </div>
          )}
        </div>

        <div className="h-px w-full bg-gray-100 my-4"></div>

        <ul className="space-y-3 min-h-[180px]">
          {features.map((feature) => (
            <li key={feature.id} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature.title}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="px-6 pt-2 pb-6">
        <Button
          onClick={() => onSelect(plan.id)}
          variant={isSelected ? "default" : "outline"}
          className={`w-full py-2 ${
            isSelected ? "bg-red-600 hover:bg-red-700 text-white" : "border-red-600 text-red-600 hover:bg-red-50"
          }`}
        >
          {isSelected ? "Sélectionné" : "Choisir ce plan"}
        </Button>
      </CardFooter>
    </Card>
  )
}
