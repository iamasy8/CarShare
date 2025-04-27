export type SubscriptionTier = "basic" | "standard" | "premium"
export type BillingPeriod = "monthly" | "yearly"

export interface SubscriptionFeature {
  id: string
  title: string
  includedIn: SubscriptionTier[]
  description?: string
}

export interface SubscriptionPlan {
  id: SubscriptionTier
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[] // IDs of features included
  recommended?: boolean
}

// Features available across subscription plans
export const subscriptionFeatures: SubscriptionFeature[] = [
  {
    id: "listings",
    title: "Nombre d'annonces",
    includedIn: ["basic", "standard", "premium"],
    description: "Basic: 1 annonce, Standard: 3 annonces, Premium: Illimité",
  },
  {
    id: "visibility",
    title: "Visibilité dans les recherches",
    includedIn: ["standard", "premium"],
    description: "Apparaissez en priorité dans les résultats de recherche",
  },
  {
    id: "featured",
    title: "Annonces en vedette",
    includedIn: ["premium"],
    description: "Vos annonces apparaissent dans la section 'En vedette' sur la page d'accueil",
  },
  {
    id: "analytics",
    title: "Statistiques détaillées",
    includedIn: ["standard", "premium"],
    description: "Accédez à des statistiques détaillées sur vos annonces",
  },
  {
    id: "support",
    title: "Support prioritaire",
    includedIn: ["premium"],
    description: "Bénéficiez d'un support client prioritaire",
  },
  {
    id: "commission",
    title: "Commission réduite",
    includedIn: ["standard", "premium"],
    description: "Basic: 15%, Standard: 10%, Premium: 5%",
  },
]

// Subscription plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basique",
    description: "Idéal pour débuter",
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    features: ["listings", "commission"],
  },
  {
    id: "standard",
    name: "Standard",
    description: "Pour les propriétaires réguliers",
    monthlyPrice: 19.99,
    yearlyPrice: 199.99,
    features: ["listings", "visibility", "analytics", "commission"],
    recommended: true,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Pour les professionnels",
    monthlyPrice: 39.99,
    yearlyPrice: 399.99,
    features: ["listings", "visibility", "featured", "analytics", "support", "commission"],
  },
]

// Helper functions
export function getYearlySavings(plan: SubscriptionPlan): number {
  return Math.round((plan.monthlyPrice * 12 - plan.yearlyPrice) * 100) / 100
}

export function getYearlySavingsPercentage(plan: SubscriptionPlan): number {
  return Math.round((1 - plan.yearlyPrice / (plan.monthlyPrice * 12)) * 100)
}

export function getPlanFeatures(plan: SubscriptionPlan): SubscriptionFeature[] {
  return subscriptionFeatures.filter((feature) => plan.features.includes(feature.id))
}

export function isFeatureIncluded(featureId: string, planId: SubscriptionTier): boolean {
  const feature = subscriptionFeatures.find((f) => f.id === featureId)
  return feature ? feature.includedIn.includes(planId) : false
}
