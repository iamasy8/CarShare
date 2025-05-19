// lib/api/subscription-plan.ts

// Type Definitions
export type SubscriptionTier = "basic" | "standard" | "premium";
export type BillingPeriod = "monthly" | "yearly";

export interface SubscriptionFeature {
  id: string;
  title: string;
  includedIn: SubscriptionTier[];
  description?: string;
}

// This interface describes a subscription plan as understood by the frontend's
// display logic. Its 'id' is the tier slug.
export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[]; // IDs of features included
  recommended?: boolean;
}

// Features available across subscription plans
// This is static data used by the frontend for display purposes
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
];

// NOTE: The static 'subscriptionPlans' array is removed from here.
// Plans will be fetched from the backend via the service.

// Helper functions
export function getYearlySavings(plan: SubscriptionPlan): number {
  // You might need to adapt these helpers to work with BackendSubscriptionPlan if you use them with fetched data
  // or only use them with the local static SubscriptionPlan structure if that's your intention.
  // If using with backend data, ensure monthlyPrice and yearlyPrice are not null.
  if (plan.monthlyPrice === null || plan.yearlyPrice === null) {
      return 0; // Or handle appropriately
  }
  return Math.round((plan.monthlyPrice * 12 - plan.yearlyPrice) * 100) / 100;
}

export function getYearlySavingsPercentage(plan: SubscriptionPlan): number {
   if (plan.monthlyPrice === null || plan.yearlyPrice === null || plan.monthlyPrice * 12 === 0) {
       return 0; // Avoid division by zero
   }
  return Math.round((1 - plan.yearlyPrice / (plan.monthlyPrice * 12)) * 100);
}

// This function still uses the local subscriptionFeatures array
export function getPlanFeatures(plan: { features: string[] | null }): SubscriptionFeature[] {
    if (!plan.features) {
        return [];
    }
  return subscriptionFeatures.filter((feature) => plan.features!.includes(feature.id));
}

// This function also uses the local subscriptionFeatures array
export function isFeatureIncluded(featureId: string, planTier: SubscriptionTier): boolean {
  const feature = subscriptionFeatures.find((f) => f.id === featureId);
  return feature ? feature.includedIn.includes(planTier) : false;
}
