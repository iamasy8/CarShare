import { apiClient } from '../apiClient';
import type { Car } from '../cars/carService';
import type { User } from '@/lib/auth-context';

export interface Booking {
  id: number;
  carId: number;
  clientId: number;
  ownerId: number;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'rejected';
  totalPrice: number;
  serviceFee: number;
  ownerPayout: number;
  message?: string;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
  car?: Car;
  client?: User;
  owner?: User;
}

export interface BookingCreateData {
  carId: number;
  startDate: Date;
  endDate: Date;
  message?: string;
}

export interface BookingStatusUpdateData {
  status: Booking['status'];
  reason?: string;
}

export interface BookingFilters {
  status?: Booking['status'] | Booking['status'][];
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

class BookingService {
  /**
   * Create a new booking
   */
  async createBooking(bookingData: BookingCreateData): Promise<Booking> {
    return apiClient.post<Booking>('/bookings', bookingData);
  }
  
  /**
   * Get bookings for the current user (client or owner)
   */
  async getBookings(filters?: BookingFilters): Promise<Booking[]> {
    return apiClient.get<Booking[]>('/bookings', { params: filters });
  }
  
  /**
   * Get a single booking by ID
   */
  async getBooking(id: number): Promise<Booking> {
    return apiClient.get<Booking>(`/bookings/${id}`);
  }
  
  /**
   * Update booking status
   */
  async updateBookingStatus(id: number, statusData: BookingStatusUpdateData): Promise<Booking> {
    return apiClient.put<Booking>(`/bookings/${id}/status`, statusData);
  }
  
  /**
   * Cancel a booking (for client)
   */
  async cancelBooking(id: number, reason?: string): Promise<Booking> {
    return apiClient.put<Booking>(`/bookings/${id}/cancel`, { reason });
  }
  
  /**
   * Reject a booking (for owner)
   */
  async rejectBooking(id: number, reason: string): Promise<Booking> {
    return apiClient.put<Booking>(`/bookings/${id}/reject`, { reason });
  }
  
  /**
   * Confirm a booking (for owner)
   */
  async confirmBooking(id: number): Promise<Booking> {
    return apiClient.put<Booking>(`/bookings/${id}/confirm`);
  }
  
  /**
   * Mark booking as started (for owner)
   */
  async startBooking(id: number): Promise<Booking> {
    return apiClient.put<Booking>(`/bookings/${id}/start`);
  }
  
  /**
   * Mark booking as completed (for owner)
   */
  async completeBooking(id: number): Promise<Booking> {
    return apiClient.put<Booking>(`/bookings/${id}/complete`);
  }
  
  /**
   * Get client bookings
   */
  async getClientBookings(filters?: BookingFilters): Promise<Booking[]> {
    return apiClient.get<Booking[]>('/client/bookings', { params: filters });
  }
  
  /**
   * Get owner bookings
   */
  async getOwnerBookings(filters?: BookingFilters): Promise<Booking[]> {
    return apiClient.get<Booking[]>('/owner/bookings', { params: filters });
  }
  
  /**
   * Check car availability for given dates
   */
  async checkAvailability(carId: number, startDate: Date, endDate: Date): Promise<{ available: boolean }> {
    return apiClient.get<{ available: boolean }>(`/cars/${carId}/availability`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
  }
  
  /**
   * Get booking price calculation
   */
  async calculatePrice(carId: number, startDate: Date, endDate: Date): Promise<{
    days: number;
    basePrice: number;
    serviceFee: number;
    totalPrice: number;
  }> {
    return apiClient.get<{
      days: number;
      basePrice: number;
      serviceFee: number;
      totalPrice: number;
    }>(`/cars/${carId}/calculate-price`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
  }
}

export const bookingService = new BookingService(); 