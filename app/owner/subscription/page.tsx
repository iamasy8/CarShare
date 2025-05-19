'use client';

import { useAuth } from '@/lib/auth-context';
import { useState, useEffect } from 'react';
// Import the service and the BackendSubscriptionPlan type
import subscriptionPlansService, { BackendSubscriptionPlan } from "@/lib/api/subscriptionService";

// Import existing frontend types if needed for display logic (like looking up feature details)
// You might need to adjust the import path based on your file structure
import  { subscriptionFeatures, getPlanFeatures,type SubscriptionTier } from '@/lib/subscription-plans';


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, CreditCard } from "lucide-react";
// Assuming SubscriptionSelector component can handle the new data structure
// You might need to adjust its props and internal logic
import { SubscriptionSelector } from "@/components/subscription/subscription-selector";


export default function SubscriptionPage() {
  // Use loading and error states from useAuth
  const { user, updateSubscription, loading, error: authContextError } = useAuth();

  // Use the BackendSubscriptionPlan type for the plans fetched from the backend
  const [availablePlans, setAvailablePlans] = useState<BackendSubscriptionPlan[]>([]);

  // The selected plan ID will be the backend database ID (number)
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  // Local state for component-specific messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

   // State to store the currently selected plan object (for display purposes before updating)
   const [selectedPlanDetails, setSelectedPlanDetails] = useState<BackendSubscriptionPlan | null>(null);


  // Fetch available subscription plans when the component mounts
  useEffect(() => {
    const fetchPlans = async () => {
       setLocalError(null); // Clear previous local errors
      try {
        const plans = await subscriptionPlansService.getAvailablePlans();
        setAvailablePlans(plans);

         // After fetching plans, if user is already loaded, try to set initial selected plan
          if (user?.subscription?.plan_id) {
             const currentPlan = plans.find(p => p.backend_id === user.subscription.plan_id);
             if (currentPlan) {
                 setSelectedPlanId(user.subscription.plan_id);
                 setSelectedPlanDetails(currentPlan);
             }
          } else if (user && !user.subscription && plans.length > 0) {
              // If user is logged in but has no subscription, maybe pre-select the first monthly plan
              const defaultPlan = plans.find(p => p.billing_period === 'monthly');
              if (defaultPlan) {
                setSelectedPlanId(defaultPlan.backend_id);
                setSelectedPlanDetails(defaultPlan);
              } else if (plans.length > 0) {
                // Fallback to the first plan if no monthly plan found
                 setSelectedPlanId(plans[0].backend_id);
                 setSelectedPlanDetails(plans[0]);
              }
          }

      } catch (err) {
        console.error("Failed to fetch subscription plans:", err);
        setLocalError("Failed to load subscription plans. Please try again.");
      }
    }

     // Fetch plans once on component mount and user change
     // Re-fetch if user changes to ensure initial selection is correct
     if (user !== undefined) { // Only fetch once user state is initialized (not null initially)
        fetchPlans();
     }


  }, [user]); // Dependency array includes user


  // Handler for when a plan is selected in your SubscriptionSelector component
  // This handler should receive the BackendSubscriptionPlan object, not just tier and billingPeriod
  // You will need to adjust your SubscriptionSelector component to emit this structure
  const handlePlanSelect = (plan: BackendSubscriptionPlan) => {
    setSelectedPlanId(plan.backend_id); // Use the backend_id as the selected ID
    setSelectedPlanDetails(plan); // Store the selected plan details

    // Clear messages when selection changes
    setSuccessMessage(null);
    setLocalError(null);
     // Consider if you need to clear authContextError here too
  }

  const handleUpdateSubscription = async () => {
    if (selectedPlanId === null) {
       setLocalError("Please select a subscription plan.");
       return;
    }

    // Clear previous messages
    setSuccessMessage(null);
    setLocalError(null);


    try {
      // The updateSubscription hook already sets its own loading state (loading.updateSubscription)
      // Pass the selectedPlanId (backend ID) to the updateSubscription function from useAuth
      await updateSubscription({ plan_id: selectedPlanId });

      // If updateSubscription completes without throwing, it was successful
      setSuccessMessage("Your subscription has been updated successfully!");
      // Optionally scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (err) {
      // Errors are already caught and potentially set in the auth context's error state
      console.error("Subscription update failed in component:", err);
       // The auth context error will be displayed, no need to set localError here
    }
  }

   // Determine if the user is currently updating the subscription (using auth context loading)
   const isUpdating = loading.updateSubscription;

   // Use the error from the auth context or a local error for display
   const displayError = authContextError || localError;

   // Determine if the currently selected plan is the user's current subscription
   const isCurrentSubscription =
       user?.subscription?.plan_id !== undefined && // Ensure user and subscription are loaded and plan_id exists
       selectedPlanId !== null && // Ensure a plan is selected in the UI
       user.subscription.plan_id === selectedPlanId; // Compare backend IDs


  return (
    <div className="container py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Gérer mon abonnement</h1>

      {/* Display success or error messages */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200 text-green-800 mb-6">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      {displayError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}

      {/* Display current subscription details if user is loaded and has a subscription */}
      {user && !loading.initial && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-red-600" />
              Abonnement actuel
            </CardTitle>
            <CardDescription>Votre abonnement actuel et ses détails</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.subscription ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {/* Access plan details via the 'plan' relationship loaded by the backend */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Plan</p>
                  <p className="text-lg font-semibold">{user.subscription.plan?.name || "N/A"}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Facturation</p>
                   {/* Use the billing_period from the loaded plan data */}
                  <p className="text-lg font-semibold">
                    {user.subscription.plan?.billing_period === "monthly" ? "Mensuelle" : user.subscription.plan?.billing_period === "yearly" ? "Annuelle" : "N/A"}
                  </p>
                </div>
                {/* Ensure startDate and nextBillingDate are available and valid Date objects or strings */}
                {/* You might need to adjust how dates are handled based on your backend's date format */}
                 {user.subscription.start_date && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date de début</p>
                      <p className="text-lg font-semibold">{new Date(user.subscription.start_date).toLocaleDateString()}</p>
                    </div>
                 )}
                  {/* If you have a next_billing_date field in your backend subscription */}
                  {user.subscription.next_billing_date && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Prochaine facturation</p>
                       <p className="text-lg font-semibold">{new Date(user.subscription.next_billing_date).toLocaleDateString()}</p>
                    </div>
                 )}

                 {/* Add other current subscription details as needed */}
              </div>
            ) : (
              <p>Vous n'avez pas d'abonnement actuel.</p>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Changer d'abonnement</CardTitle>
          <CardDescription>Choisissez le plan qui vous convient le mieux</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
           {/* You need to adapt your SubscriptionSelector or render plans directly */}
           {/* If using SubscriptionSelector, pass availablePlans and handle its output */}

          <div className="w-full overflow-x-auto pb-4">
            <div className="min-w-[600px] lg:min-w-0">
              {/* Option 1: Adapt SubscriptionSelector */}
              {/* Assuming SubscriptionSelector takes available plans and a handler */}
              {/* <SubscriptionSelector
                 availablePlans={availablePlans}
                 onSubscriptionChange={handlePlanSelect} // Pass the handler for plan selection
                 selectedPlanId={selectedPlanId} // Pass the selected plan's backend ID
                 // You might need to pass initial/default values based on user's current subscription
                 // initialSelectedPlanId={user?.subscription?.plan_id || null}
              /> */}

               {/* Option 2: Render plans directly in this component (as shown in previous example) */}
               {/* This might be simpler than adapting a complex selector component */}
               {availablePlans.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availablePlans.map(plan => (
                            <div
                                key={plan.backend_id} // Use backend_id as key
                                className={`border p-4 rounded-lg cursor-pointer transition-shadow ${selectedPlanId === plan.backend_id ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-sm'}`}
                                onClick={() => !isUpdating && handlePlanSelect(plan)} // Pass the whole plan object
                            >
                                <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                                <p className="text-gray-600 mb-2">{plan.description}</p>
                                 <p className="font-bold">
                                     {/* Use billing_period from the fetched plan data */}
                                     {plan.billing_period === 'monthly' && plan.monthlyPrice !== null && `$${plan.monthlyPrice.toFixed(2)} / month`}
                                     {plan.billing_period === 'yearly' && plan.yearlyPrice !== null && `$${plan.yearlyPrice.toFixed(2)} / year`}
                                 </p>
                                 {/* Display features - you can look up details from your local subscriptionFeatures if needed */}
                                 {plan.features && plan.features.length > 0 && (
                                     <ul className="list-disc list-inside mt-2 text-sm text-gray-700">
                                         {plan.features.map((featureId, index) => {
                                              // Optionally look up the feature details from your local subscriptionFeatures array
                                              const feature = subscriptionFeatures.find(f => f.id === featureId);
                                              return (
                                                  <li key={index}>{feature ? feature.title : featureId}</li> // Display title or ID
                                              );
                                         })}
                                     </ul>
                                 )}
                            </div>
                        ))}
                    </div>
                ) : (
                     <p>Loading plans...</p> // Or a message if no plans are available
                )}
            </div>
          </div>


          <div className="flex justify-center pt-4">
            <Button
              onClick={handleUpdateSubscription}
              disabled={isUpdating || isCurrentSubscription || !selectedPlanId} // Disable if updating, current, or no plan selected
              className="bg-red-600 hover:bg-red-700 text-white px-8"
              size="lg"
            >
              {isUpdating
                ? "Mise à jour en cours..."
                : isCurrentSubscription
                  ? "Abonnement actuel"
                  : "Mettre à jour l'abonnement"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
