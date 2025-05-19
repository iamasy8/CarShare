// lib/api/subscriptionPlansService.ts

import { apiClient, ApiResponse } from "./apiClient"; // <-- Import both

// Import only the necessary types from subscription-plan.ts
import type { SubscriptionTier, BillingPeriod } from '@/lib/subscription-plans';


// Define the interface for the plans fetched from the backend.
// This describes the structure returned by your backend API endpoint.
export interface BackendSubscriptionPlan {
    // The 'id' from the backend will be the tier slug (e.g., "basic")
    id: SubscriptionTier;
    name: string;
    description: string;
    // Backend prices can be nullable depending on the billing period
    monthlyPrice: number | null;
    yearlyPrice: number | null;
    features: string[] | null; // Feature IDs (string array) from the backend
    billing_period: BillingPeriod; // Explicitly include billing_period
    backend_id: number; // The actual database primary key ID
    // Add other properties if your backend returns them (like 'recommended')
    recommended?: boolean;
    // Add the 'created_at' property
    created_at: string; // <-- Add this line (assuming it's a string from backend)
    updated_at: string;
}


const subscriptionPlansService = {
    /**
     * Fetches the list of available subscription plans from the backend.
     * @returns A promise that resolves with an array of BackendSubscriptionPlan objects.
     */
    getAvailablePlans: async (): Promise<BackendSubscriptionPlan[]> => {
        try {
            // Make the GET request to the backend endpoint /api/subscription-plans
            // Pass the expected return type (BackendSubscriptionPlan[]) directly to the generic
            const plans = await apiClient.get<BackendSubscriptionPlan[]>('/subscription-plans'); // <-- Corrected line

             // The apiClient.get method already returns the unwrapped data (BackendSubscriptionPlan[])
             return plans; // <-- Return the result directly

        } catch (error) {
            console.error("Failed to fetch subscription plans:", error);
            // It's good practice to throw a more specific error or handle known API error structures
            if ((error as any).response?.data?.message) {
                 throw new Error((error as any).response.data.message);
            }
            throw error; // Re-throw for handling in the component
        }
    },

    // You can add other API-related functions here, e.g.,
    // getPlanById: async (id: number): Promise<BackendSubscriptionPlan> => { ... }
};

export default subscriptionPlansService;