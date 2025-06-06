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
  startDate: Date | string;
  endDate: Date | string;
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
    try {
      // Add a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await apiClient.get<Booking[]>('/bookings', { 
        params: filters,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Ensure dates are properly converted to Date objects
      if (Array.isArray(response)) {
        return response.map(booking => ({
          ...booking,
          startDate: booking.startDate ? new Date(booking.startDate) : new Date(),
          endDate: booking.endDate ? new Date(booking.endDate) : new Date(),
          createdAt: booking.createdAt ? new Date(booking.createdAt) : new Date(),
          updatedAt: booking.updatedAt ? new Date(booking.updatedAt) : new Date()
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching bookings:", error);
      
      // Check if it's a JSON parsing error (common when receiving HTML instead of JSON)
      if (error instanceof Error && error.message.includes('JSON')) {
        console.error("JSON parsing error - likely received HTML instead of JSON. Session may have expired.");
        // Force a redirect to login page
        if (typeof window !== 'undefined') {
          // Clear any stored auth tokens
          localStorage.removeItem('auth_token');
          // Redirect with a query param indicating session expiry
          window.location.href = '/login?expired=1';
        }
      }
      
      // Rethrow for upstream handling
      throw error;
    }
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
    return apiClient.post<Booking>(`/bookings/${id}/cancel`, { reason });
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
  async checkAvailability(carId: number, startDate: Date | string, endDate: Date | string): Promise<{ available: boolean }> {
    const formattedStartDate = startDate instanceof Date ? startDate.toISOString().split('T')[0] : startDate;
    const formattedEndDate = endDate instanceof Date ? endDate.toISOString().split('T')[0] : endDate;
    
    return apiClient.get<{ available: boolean }>(`/cars/${carId}/availability`, {
      params: {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
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