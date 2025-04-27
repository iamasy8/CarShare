"use client"

import { useState } from "react"
import { type BillingPeriod, type SubscriptionTier, subscriptionPlans } from "@/lib/subscription-plans"
import { PlanCard } from "./plan-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SubscriptionSelectorProps {
  onSubscriptionChange: (subscription: { tier: SubscriptionTier; billingPeriod: BillingPeriod }) => void
  defaultTier?: SubscriptionTier
  defaultBillingPeriod?: BillingPeriod
}

export function SubscriptionSelector({
  onSubscriptionChange,
  defaultTier = "standard",
  defaultBillingPeriod = "monthly",
}: SubscriptionSelectorProps) {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(defaultTier)
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>(defaultBillingPeriod)

  const handleTierChange = (tier: SubscriptionTier) => {
    setSelectedTier(tier)
    onSubscriptionChange({ tier, billingPeriod })
  }

  const handleBillingPeriodChange = (period: BillingPeriod) => {
    setBillingPeriod(period)
    onSubscriptionChange({ tier: selectedTier, billingPeriod: period })
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-center mb-2">
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <Tabs
            defaultValue={billingPeriod}
            onValueChange={(value) => handleBillingPeriodChange(value as BillingPeriod)}
            className="w-full"
          >
            <TabsList className="grid w-full sm:w-[300px] grid-cols-2 bg-transparent">
              <TabsTrigger
                value="monthly"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:shadow-sm rounded-md"
              >
                Mensuel
              </TabsTrigger>
              <TabsTrigger
                value="yearly"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:shadow-sm rounded-md"
              >
                Annuel
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {subscriptionPlans.map((plan) => (
          <div key={plan.id} className={plan.recommended ? "md:-mt-4" : ""}>
            <PlanCard
              plan={plan}
              selectedPlan={selectedTier}
              billingPeriod={billingPeriod}
              onSelect={handleTierChange}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
