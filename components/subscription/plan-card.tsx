// components/subscription/plan-card.tsx

// Update imports
// import { type BillingPeriod, type SubscriptionTier, type SubscriptionPlan, getPlanFeatures, getYearlySavingsPercentage } from "@/lib/subscription-plans";
import { type BillingPeriod, type SubscriptionTier, getPlanFeatures, getYearlySavingsPercentage } from "@/lib/subscription-plans"; // Import types and helpers
import { type BackendSubscriptionPlan } from "@/lib/api/subscriptionService"; // Import BackendSubscriptionPlan


import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

// Update the interface
interface PlanCardProps {
  // Accept BackendSubscriptionPlan instead of SubscriptionPlan
  plan: BackendSubscriptionPlan;
  // Accept the selected plan ID (backend ID)
  selectedPlanId: number | null;
  // billingPeriod is likely redundant if price is in BackendSubscriptionPlan, but keep for now
  billingPeriod: BillingPeriod;
  // The onSelect handler receives the plan object
  onSelect: (plan: BackendSubscriptionPlan) => void;
}

export function PlanCard({
  plan,
  selectedPlanId,
  billingPeriod,
  onSelect,
}: PlanCardProps) {

  // Determine if this card is the selected plan
  const isSelected = selectedPlanId === plan.backend_id; // Compare backend IDs


  // Get the price based on the billing period
  const price = billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

  // Get features for this plan (using the helper from subscription-plan.ts)
  const features = getPlanFeatures({ features: plan.features }); // Pass the features array

  // Get yearly savings percentage (using the helper)
  // You might need to adapt getYearlySavingsPercentage to work with BackendSubscriptionPlan
  const yearlySavingsPercentage = plan.monthlyPrice !== null && plan.yearlyPrice !== null
    ? getYearlySavingsPercentage({ monthlyPrice: plan.monthlyPrice, yearlyPrice: plan.yearlyPrice } as any) // Cast or adapt helper
    : 0;


  return (
    // Use the onClick handler to call onSelect with the plan object
    <Card
      className={`h-full flex flex-col border-2 ${isSelected ? "border-blue-500" : ""}`}
      onClick={() => onSelect(plan)}
    >
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="text-2xl font-bold">
          {price !== null ? `$${price.toFixed(2)}` : 'N/A'}
          {billingPeriod === "monthly" ? " / month" : " / year"}
        </div>
        {billingPeriod === "yearly" && yearlySavingsPercentage > 0 && (
          <p className="text-sm text-green-600 font-medium">
            Save {yearlySavingsPercentage}% annually
          </p>
        )}
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          {features.map((feature) => (
            <li key={feature.id} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              {feature.title}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {/* The button might not be needed if the whole card is clickable */}
        {/* But if you keep it, the onClick should also call onSelect(plan) */}
         {/* <Button onClick={() => onSelect(plan)} disabled={isSelected}>
             {isSelected ? "Selected" : "Select"}
         </Button> */}
      </CardFooter>
    </Card>
  );
}
