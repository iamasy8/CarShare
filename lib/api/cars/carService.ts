import { apiClient } from '../apiClient';
import type { User } from '@/lib/auth-context';

export interface Car {
  id: number;
  title: string;
  make: string;
  model: string;
  year: number;
  type: string;
  price: number;
  location: string;
  seats: number;
  doors: number;
  fuel: string;
  transmission: string;
  description: string;
  features: string[];
  images: string[];
  availableFrom?: Date;
  availableTo?: Date;
  ownerId: number;
  owner?: User;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface CarFilters {
  make?: string;
  model?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  seats?: number;
  features?: string[];
  page?: number;
  limit?: number;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
}

class CarService {
  /**
   * Get cars with optional filters
   */
  async getCars(filters?: CarFilters): Promise<Car[]> {
    return apiClient.get<Car[]>('/cars', { params: filters });
  }
  
  /**
   * Get a single car by ID
   */
  async getCar(id: number): Promise<Car> {
    return apiClient.get<Car>(`/cars/${id}`);
  }
  
  /**
   * Create a new car (for owners)
   */
  async createCar(formData: FormData): Promise<Car> {
    // Log the form data for debugging
    console.log("FormData being sent:", Array.from(formData.entries()));
    
    return apiClient.post<Car>('/cars', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
    });
  }
  
  /**
   * Update a car (for owners)
   */
  async updateCar(id: number, formData: FormData): Promise<Car> {
    return apiClient.put<Car>(`/cars/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
  
  /**
   * Delete a car (for owners)
   */
  async deleteCar(id: number): Promise<void> {
    return apiClient.delete<void>(`/cars/${id}`);
  }
  
  /**
   * Get cars owned by the current user
   */
  async getOwnerCars(status?: string): Promise<Car[]> {
    return apiClient.get<Car[]>('/owner/cars', {
      params: { status },
    });
  }
  
  /**
   * Get count of cars owned by the current user
   */
  async getOwnerCarCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>('/owner/cars/count');
    return response.count;
  }
  
  /**
   * Add a car to favorites
   */
  async addToFavorites(carId: number): Promise<void> {
    return apiClient.post<void>(`/cars/${carId}/favorite`);
  }
  
  /**
   * Remove a car from favorites
   */
  async removeFromFavorites(carId: number): Promise<void> {
    return apiClient.delete<void>(`/cars/${carId}/favorite`);
  }
  
  /**
   * Get favorite cars for the current user
   */
  async getFavoriteCars(): Promise<Car[]> {
    return apiClient.get<Car[]>('/favorites');
  }
  
  /**
   * Check if a car is in user's favorites
   */
  async isFavorite(carId: number): Promise<boolean> {
    try {
      await apiClient.get<void>(`/cars/${carId}/favorite/check`);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Get featured cars for homepage
   */
  async getFeaturedCars(limit: number = 6): Promise<Car[]> {
    return apiClient.get<Car[]>('/cars/featured', {
      params: { limit },
    });
  }
  
  /**
   * Get similar cars to a given car
   */
  async getSimilarCars(carId: number, limit: number = 3): Promise<Car[]> {
    return apiClient.get<Car[]>(`/cars/${carId}/similar`, {
      params: { limit },
    });
  }
  
  /**
   * Get bookings for a specific car
   */
  async getCarBookings(carId: number): Promise<any[]> {
    // Use mock data instead of real API call since endpoint doesn't exist yet
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            start_date: new Date(2025, 5, 10).toISOString(),
            end_date: new Date(2025, 5, 12).toISOString(),
            status: "confirmed",
            renter_name: "Jean Dupont"
          },
          {
            id: 2,
            start_date: new Date(2025, 5, 20).toISOString(),
            end_date: new Date(2025, 5, 21).toISOString(),
            status: "confirmed",
            renter_name: "Marie Martin"
          }
        ]);
      }, 500);
    });
  }
  
  /**
   * Update car availability dates
   */
  async updateCarAvailability(carId: number, dates: string[]): Promise<void> {
    // Use mock implementation instead of real API call since endpoint doesn't exist yet
    return new Promise((resolve) => {
      console.log(`Mock: Updating availability for car ${carId} with dates:`, dates);
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }
}

export const carService = new CarService();