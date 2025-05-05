"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { subscriptionTypes, subscriptionUtils, type Subscription, type SubscriptionType } from "@/lib/subscription-types"
import { moroccoLocalization } from "@/lib/localization"

interface SubscriptionSelectorProps {
  onSelect: (subscription: Subscription) => void
  currentSubscription?: Subscription
}

export function SubscriptionSelector({
  onSelect,
  currentSubscription,
}: SubscriptionSelectorProps) {
  const [selectedType, setSelectedType] = useState<SubscriptionType>(
    currentSubscription?.type || "basic"
  )
  const [autoRenew, setAutoRenew] = useState<boolean>(
    currentSubscription?.autoRenew || false
  )

  const handleSelect = (type: SubscriptionType) => {
    setSelectedType(type)
  }

  const handleSubmit = () => {
    const startDate = new Date()
    const planType = selectedType.toUpperCase() as keyof typeof subscriptionTypes
    const endDate = subscriptionUtils.calculateEndDate(
      startDate,
      subscriptionTypes[planType].duration
    )

    const subscription: Subscription = {
      type: selectedType,
      startDate,
      endDate,
      status: "pending",
      autoRenew,
      paymentMethod: "credit_card", // Default, can be changed in payment step
    }

    onSelect(subscription)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Choisissez votre abonnement</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Sélectionnez le plan qui correspond le mieux à vos besoins
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(subscriptionTypes).map(([key, plan]) => (
          <Card
            key={plan.id}
            className={`p-6 cursor-pointer transition-all ${
              selectedType === plan.id
                ? "border-primary shadow-lg"
                : "hover:border-gray-300"
            }`}
            onClick={() => handleSelect(plan.id as SubscriptionType)}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                {selectedType === plan.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="text-3xl font-bold">
                {moroccoLocalization.pricing.formats.price(plan.price)}
                <span className="text-sm font-normal text-gray-500">
                  /mois
                </span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="autoRenew"
          checked={autoRenew}
          onChange={(e) => setAutoRenew(e.target.checked)}
          className="rounded border-gray-300"
        />
        <label htmlFor="autoRenew" className="text-sm text-gray-600">
          Renouvellement automatique
        </label>
      </div>

      <div className="text-sm text-gray-500">
        <p>
          * Le renouvellement automatique peut être désactivé à tout moment
        </p>
        <p>
          * En cas de non-paiement, votre compte sera suspendu après la période
          d'essai
        </p>
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full"
        disabled={!selectedType}
      >
        Continuer vers le paiement
      </Button>
    </div>
  )
}
