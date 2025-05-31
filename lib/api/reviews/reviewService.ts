import { apiClient } from '../apiClient';
import type { User } from '@/lib/auth-context';

export interface Review {
  id: number;
  carId?: number;
  reviewedUserId?: number;
  reviewerId: number;
  bookingId: number;
  rating: number;
  comment: string;
  isCarReview: boolean;
  createdAt: Date;
  updatedAt: Date;
  reviewer?: {
    id: number;
    name: string;
    avatar?: string;
  };
}

export interface CarReviewData {
  car_id: number;
  booking_id: number;
  rating: number;
  comment: string;
}

export interface UserReviewData {
  reviewed_user_id: number;
  booking_id: number;
  rating: number;
  comment: string;
}

class ReviewService {
  /**
   * Get reviews for a specific car
   */
  async getCarReviews(carId: number): Promise<Review[]> {
    const response = await apiClient.get<{success: boolean, data: Review[], message: string}>(`/cars/${carId}/reviews`);
    return response.data;
  }
  
  /**
   * Get reviews for a specific user
   */
  async getUserReviews(userId: number): Promise<Review[]> {
    const response = await apiClient.get<{success: boolean, data: Review[], message: string}>(`/users/${userId}/reviews`);
    return response.data;
  }
  
  /**
   * Submit a review for a car
   */
  async submitCarReview(reviewData: CarReviewData): Promise<Review> {
    const response = await apiClient.post<{success: boolean, data: Review, message: string}>('/reviews/car', reviewData);
    return response.data;
  }
  
  /**
   * Submit a review for a user
   */
  async submitUserReview(reviewData: UserReviewData): Promise<Review> {
    const response = await apiClient.post<{success: boolean, data: Review, message: string}>('/reviews/user', reviewData);
    return response.data;
  }
  
  /**
   * Update a review
   */
  async updateReview(id: number, reviewData: Partial<CarReviewData | UserReviewData>): Promise<Review> {
    const response = await apiClient.put<{success: boolean, data: Review, message: string}>(`/reviews/${id}`, reviewData);
    return response.data;
  }
  
  /**
   * Delete a review
   */
  async deleteReview(id: number): Promise<void> {
    await apiClient.delete<{success: boolean, message: string}>(`/reviews/${id}`);
  }
  
  /**
   * Report a review
   */
  async reportReview(id: number, reason: string): Promise<void> {
    await apiClient.post<{success: boolean, message: string}>(`/reviews/${id}/report`, { reason });
  }
}

export const reviewService = new ReviewService(); 