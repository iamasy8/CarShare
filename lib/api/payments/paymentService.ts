import { apiClient } from '../apiClient';
import type { Booking } from '../bookings/bookingService';

export interface Payment {
  id: number;
  booking_id: number;
  user_id: number;
  amount: number;
  transaction_id: string;
  payment_method: 'credit_card' | 'paypal' | 'bank_transfer';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  currency: string;
  completed_at?: Date;
  refund_status?: 'requested' | 'approved' | 'rejected';
  refund_reason?: string;
  refund_requested_at?: Date;
  refund_processed_at?: Date;
  error_message?: string;
  created_at: Date;
  updated_at: Date;
  booking?: Booking;
}

export interface PaymentInitiateData {
  booking_id: number;
  payment_method: 'credit_card' | 'paypal' | 'bank_transfer';
  card_number?: string;
  card_holder?: string;
  expiry_date?: string;
  cvv?: string;
}

class PaymentService {
  /**
   * Initiate a payment for a booking
   */
  async initiatePayment(paymentData: PaymentInitiateData): Promise<{
    message: string;
    payment: Payment;
    redirect_url: string;
  }> {
    return apiClient.post<{
      message: string;
      payment: Payment;
      redirect_url: string;
    }>('/payments/initiate', paymentData);
  }
  
  /**
   * Get payment details
   */
  async getPayment(paymentId: number): Promise<Payment> {
    return apiClient.get<Payment>(`/payments/${paymentId}`);
  }
  
  /**
   * Get user's payment history
   */
  async getUserPayments(): Promise<{
    data: Payment[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  }> {
    return apiClient.get<{
      data: Payment[];
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    }>('/user/payments');
  }
  
  /**
   * Request a refund
   */
  async requestRefund(paymentId: number, reason: string): Promise<{
    message: string;
    payment: Payment;
  }> {
    return apiClient.post<{
      message: string;
      payment: Payment;
    }>(`/payments/${paymentId}/refund`, { reason });
  }
  
  /**
   * Process a refund (admin only)
   */
  async processRefund(paymentId: number, status: 'approved' | 'rejected', notes?: string): Promise<{
    message: string;
    payment: Payment;
  }> {
    return apiClient.post<{
      message: string;
      payment: Payment;
    }>(`/payments/${paymentId}/process-refund`, { status, notes });
  }
}

export const paymentService = new PaymentService(); 