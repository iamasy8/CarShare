import { z } from "zod"

export type SubscriptionType = "basic" | "premium" | "business"

export const subscriptionTypes = {
  BASIC: {
    id: "basic" as const,
    name: "Basic",
    price: 199,
    duration: 30, // days
    features: [
      "1 voiture maximum",
      "Statistiques de base",
      "Support par email",
    ],
  },
  PREMIUM: {
    id: "premium" as const,
    name: "Premium",
    price: 399,
    duration: 30, // days
    features: [
      "3 voitures maximum",
      "Statistiques avancées",
      "Support prioritaire",
      "Promotion sur la plateforme",
    ],
  },
  BUSINESS: {
    id: "business" as const,
    name: "Business",
    price: 799,
    duration: 30, // days
    features: [
      "10 voitures maximum",
      "Statistiques détaillées",
      "Support 24/7",
      "Promotion prioritaire",
      "API d'intégration",
    ],
  },
} as const

export const subscriptionSchema = z.object({
  type: z.enum(["basic", "premium", "business"]),
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(["active", "expired", "cancelled", "pending"]),
  autoRenew: z.boolean(),
  paymentMethod: z.enum(["credit_card", "bank_transfer"]),
  lastPaymentDate: z.date().optional(),
  nextPaymentDate: z.date().optional(),
})

export type Subscription = z.infer<typeof subscriptionSchema>

// Subscription management utilities
export const subscriptionUtils = {
  // Calculate subscription end date
  calculateEndDate: (startDate: Date, duration: number): Date => {
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + duration)
    return endDate
  },

  // Check if subscription is active
  isActive: (subscription: Subscription): boolean => {
    const now = new Date()
    return (
      subscription.status === "active" &&
      subscription.endDate > now
    )
  },

  // Check if subscription is about to expire (within 3 days)
  isExpiringSoon: (subscription: Subscription): boolean => {
    const now = new Date()
    const threeDaysFromNow = new Date(now)
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
    return (
      subscription.status === "active" &&
      subscription.endDate <= threeDaysFromNow &&
      subscription.endDate > now
    )
  },

  // Handle subscription expiration
  handleExpiration: (subscription: Subscription): Subscription => {
    const now = new Date()
    if (subscription.endDate < now) {
      return {
        ...subscription,
        status: "expired",
      }
    }
    return subscription
  },

  // Handle auto-renewal
  handleAutoRenewal: (subscription: Subscription): Subscription => {
    if (subscription.autoRenew && subscription.status === "active") {
      const newStartDate = new Date()
      const planType = subscription.type.toUpperCase() as keyof typeof subscriptionTypes
      const newEndDate = subscriptionUtils.calculateEndDate(
        newStartDate,
        subscriptionTypes[planType].duration
      )
      return {
        ...subscription,
        startDate: newStartDate,
        endDate: newEndDate,
        lastPaymentDate: new Date(),
        nextPaymentDate: newEndDate,
      }
    }
    return subscription
  },

  // Get subscription price in MAD
  getPrice: (type: SubscriptionType): number => {
    const planType = type.toUpperCase() as keyof typeof subscriptionTypes
    return subscriptionTypes[planType].price
  },

  // Format price with Moroccan currency
  formatPrice: (price: number): string => {
    return `${price} د.م.`
  },
} 