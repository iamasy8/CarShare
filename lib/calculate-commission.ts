import type { SubscriptionTier } from "./subscription-plans"

/**
 * Calculate commission rate based on user subscription tier
 * @param tier Subscription tier of the user
 * @returns Commission rate as a decimal (e.g., 0.1 for 10%)
 */
export function getCommissionRate(tier?: SubscriptionTier): number {
  switch (tier) {
    case "premium":
      return 0.05 // 5%
    case "standard":
      return 0.1 // 10%
    case "basic":
      return 0.15 // 15%
    default:
      return 0.15 // Default rate for unsubscribed or unknown tier
  }
}

/**
 * Calculate service fee amount based on base price and subscription tier
 * @param basePrice The base price of the rental
 * @param days Number of rental days
 * @param tier Subscription tier of the owner
 * @returns Service fee amount
 */
export function calculateServiceFee(basePrice: number, days: number, tier?: SubscriptionTier): number {
  const rate = getCommissionRate(tier)
  return Math.round(basePrice * days * rate)
}

/**
 * Calculate total price including service fee
 * @param basePrice The base price of the rental per day
 * @param days Number of rental days
 * @param tier Subscription tier of the owner
 * @returns Total price including service fee
 */
export function calculateTotalPrice(basePrice: number, days: number, tier?: SubscriptionTier): number {
  const serviceFee = calculateServiceFee(basePrice, days, tier)
  return basePrice * days + serviceFee
}

/**
 * Calculate owner payout amount (after commission)
 * @param basePrice The base price of the rental per day
 * @param days Number of rental days
 * @param tier Subscription tier of the owner
 * @returns Owner payout amount
 */
export function calculateOwnerPayout(basePrice: number, days: number, tier?: SubscriptionTier): number {
  return basePrice * days
} 