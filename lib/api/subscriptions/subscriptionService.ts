import { apiClient } from '../apiClient';
import type { SubscriptionTier, BillingPeriod } from '@/lib/subscription-plans';

export interface Subscription {
  id: number;
  userId: number;
  tier: SubscriptionTier;
  billingPeriod: BillingPeriod;
  startDate: Date;
  nextBillingDate: Date;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  paymentMethodId?: string;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionCreateData {
  tier: SubscriptionTier;
  billingPeriod: BillingPeriod;
  paymentMethodId: string;
}

export interface Invoice {
  id: number;
  userId: number;
  subscriptionId: number;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'uncollectible';
  invoiceUrl: string;
  invoicePdf: string;
  billingPeriod: BillingPeriod;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  lastFour: string;
  expiryMonth?: number;
  expiryYear?: number;
  brand?: string;
  isDefault: boolean;
}

class SubscriptionService {
  /**
   * Get the current user's subscription
   */
  async getSubscription(): Promise<Subscription | null> {
    try {
      return await apiClient.get<Subscription>('/subscriptions/current');
    } catch (error) {
      // If no subscription exists
      if ((error as any).status === 404) {
        return null;
      }
      throw error;
    }
  }
  
  /**
   * Create a new subscription
   */
  async createSubscription(subscriptionData: SubscriptionCreateData): Promise<Subscription> {
    return apiClient.post<Subscription>('/subscriptions', subscriptionData);
  }
  
  /**
   * Update an existing subscription
   */
  async updateSubscription(subscriptionData: {
    tier?: SubscriptionTier;
    billingPeriod?: BillingPeriod;
  }): Promise<Subscription> {
    return apiClient.put<Subscription>('/subscriptions/current', subscriptionData);
  }
  
  /**
   * Cancel subscription at period end
   */
  async cancelSubscription(): Promise<Subscription> {
    return apiClient.post<Subscription>('/subscriptions/current/cancel');
  }
  
  /**
   * Reactivate a canceled subscription
   */
  async reactivateSubscription(): Promise<Subscription> {
    return apiClient.post<Subscription>('/subscriptions/current/reactivate');
  }
  
  /**
   * Get subscription invoices
   */
  async getInvoices(): Promise<Invoice[]> {
    return apiClient.get<Invoice[]>('/subscriptions/invoices');
  }
  
  /**
   * Get a specific invoice
   */
  async getInvoice(invoiceId: number): Promise<Invoice> {
    return apiClient.get<Invoice>(`/subscriptions/invoices/${invoiceId}`);
  }
  
  /**
   * Add a payment method
   */
  async addPaymentMethod(paymentMethodId: string): Promise<PaymentMethod> {
    return apiClient.post<PaymentMethod>('/subscriptions/payment-methods', {
      paymentMethodId,
    });
  }
  
  /**
   * Get all payment methods
   */
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return apiClient.get<PaymentMethod[]>('/subscriptions/payment-methods');
  }
  
  /**
   * Set default payment method
   */
  async setDefaultPaymentMethod(paymentMethodId: string): Promise<PaymentMethod> {
    return apiClient.put<PaymentMethod>(`/subscriptions/payment-methods/${paymentMethodId}/default`);
  }
  
  /**
   * Delete a payment method
   */
  async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    return apiClient.delete<void>(`/subscriptions/payment-methods/${paymentMethodId}`);
  }
  
  /**
   * Get subscription limits for the current user
   */
  async getSubscriptionLimits(): Promise<{
    maxCars: number;
    featuredListings: number;
    prioritySupport: boolean;
    instantBooking: boolean;
    enhancedVisibility: boolean;
    carCount: number;
  }> {
    return apiClient.get<{
      maxCars: number;
      featuredListings: number;
      prioritySupport: boolean;
      instantBooking: boolean;
      enhancedVisibility: boolean;
      carCount: number;
    }>('/subscriptions/limits');
  }
}

export const subscriptionService = new SubscriptionService(); 