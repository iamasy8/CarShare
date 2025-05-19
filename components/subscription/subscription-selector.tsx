// components/subscription/subscription-selector.tsx

"use client"

import { useState, useEffect } from "react" // Import useEffect
// We will remove the import of static subscriptionPlans
// import { type BillingPeriod, type SubscriptionTier, subscriptionPlans } from "@/lib/subscription-plans"

// Import the BackendSubscriptionPlan type and SubscriptionTier from your frontend types
import type {  SubscriptionTier,  BillingPeriod } from "@/lib/subscription-plans";
import { type BackendSubscriptionPlan } from "@/lib/api/subscriptionService"; // Import BackendSubscriptionPlan

import { PlanCard } from "./plan-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Update the interface to accept available plans and selected plan ID (backend ID)
interface SubscriptionSelectorProps {
  availablePlans: BackendSubscriptionPlan[]; // Receive plans from backend
  onPlanSelect: (plan: BackendSubscriptionPlan) => void; // Handler for selecting a plan
  selectedPlanId: number | null; // The backend ID of the currently selected plan
  // defaultTier and defaultBillingPeriod might become less relevant if you initialize selection
  // based on selectedPlanId, but you could keep them for initial state or fallback
  // defaultTier?: SubscriptionTier;
  // defaultBillingPeriod?: BillingPeriod;
}

export function SubscriptionSelector({
  availablePlans,
  onPlanSelect,
  selectedPlanId,
  // defaultTier = "standard", // Removed or commented out
  // defaultBillingPeriod = "monthly", // Removed or commented out
}: SubscriptionSelectorProps) {

   // Internal state to manage the selected billing period for the tabs
   const [internalBillingPeriod, setInternalBillingPeriod] = useState<BillingPeriod>("monthly");


   // Effect to initialize internal state based on selectedPlanId or default
   useEffect(() => {
       if (selectedPlanId !== null) {
           const selectedPlan = availablePlans.find(plan => plan.backend_id === selectedPlanId);
           if (selectedPlan) {
               // Set the internal billing period based on the selected plan's billing period
               setInternalBillingPeriod(selectedPlan.billing_period);
           }
       } else if (availablePlans.length > 0) {
            // Optional: Set a default selection if no plan is initially selected
            // Find a default plan (e.g., the first monthly plan)
            const defaultPlan = availablePlans.find(p => p.billing_period === 'monthly');
            if (defaultPlan) {
                // We don't select it internally here, just set the default tab state
                setInternalBillingPeriod('monthly');
            } else if (availablePlans.length > 0) {
                 setInternalBillingPeriod(availablePlans[0].billing_period);
            }
       }
   }, [selectedPlanId, availablePlans]); // Re-run when selectedPlanId or availablePlans change


  // Handle changing the billing period tab
  const handleBillingPeriodChange = (period: BillingPeriod) => {
    setInternalBillingPeriod(period);
    // When billing period changes, we might want to select a plan for that period
    // Find a plan for the new billing period, preferably matching the current tier if possible
    const currentSelectedPlan = availablePlans.find(plan => plan.backend_id === selectedPlanId);
    let nextSelectedPlan = null;

    if (currentSelectedPlan) {
        // Try to find a plan with the same tier but different billing period
        nextSelectedPlan = availablePlans.find(plan =>
            plan.id === currentSelectedPlan.id && // Match tier slug
            plan.billing_period === period
        );
    }

    // If no matching tier found for the new period, just pick the first one for the new period
    if (!nextSelectedPlan) {
        nextSelectedPlan = availablePlans.find(plan => plan.billing_period === period);
    }

    // If a plan is found for the new period, call the onPlanSelect handler
    if (nextSelectedPlan) {
        onPlanSelect(nextSelectedPlan);
    } else {
        // Handle the case where no plans are available for the selected billing period
        console.warn(`No plans found for billing period: ${period}`);
        // You might want to clear the selection or show a message
        onPlanSelect(null as any); // Pass null or handle appropriately
    }
  }

  // Handle selecting a specific plan card
  // This handler should receive the BackendSubscriptionPlan object
  const handlePlanCardSelect = (plan: BackendSubscriptionPlan) => {
    onPlanSelect(plan); // Call the parent component's handler with the selected plan
  }


  // Filter plans based on the currently selected billing period for display
  const filteredPlans = availablePlans.filter(plan => plan.billing_period === internalBillingPeriod);


  return (
    <div className="space-y-8">
      <div className="flex justify-center mb-2">
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <Tabs
            value={internalBillingPeriod} // Control tabs with internal state
            onValueChange={(value) => handleBillingPeriodChange(value as BillingPeriod)}
            className="w-full"
          >
            <TabsList className="grid w-full sm:w-[300px] grid-cols-2 bg-transparent">
              {/* Render tabs based on available billing periods in your data if needed */}
               {/* For now, assuming monthly and yearly are always options */}
              <TabsTrigger
                value="monthly"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:shadow-sm rounded-md"
              >
                Mensuel
              </TabsTrigger>
              <TabsTrigger
                value="yearly"
                className="data-[state=active]:bg-white dark-[state=active]:bg-gray-950 data-[state=active]:shadow-sm rounded-md"
              >
                Annuel
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Render filtered plans using PlanCard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {filteredPlans.map((plan) => (
           // Use the backend_id as the key
          <div key={plan.backend_id} className={plan.recommended ? "md:-mt-4" : ""}> {/* Assuming 'recommended' is in BackendSubscriptionPlan */}
            <PlanCard
              plan={plan} // Pass the BackendSubscriptionPlan object to PlanCard
              selectedPlanId={selectedPlanId} // Pass the selected plan's backend ID
              billingPeriod={internalBillingPeriod} // Pass the current billing period
              onSelect={() => handlePlanCardSelect(plan)} // Pass the plan object on select
            />
          </div>
        ))}
         {filteredPlans.length === 0 && (
             <div className="col-span-1 md:col-span-3 text-center text-gray-500">
                 Aucun plan disponible pour cette période de facturation.
             </div>
         )}
      </div>
    </div>
  )
}
