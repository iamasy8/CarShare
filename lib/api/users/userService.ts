import { apiClient } from '../apiClient';
import type { User } from '@/lib/auth-context';

export interface UserFilters {
  role?: 'client' | 'owner' | 'admin';
  status?: 'active' | 'inactive' | 'suspended';
  search?: string;
  page?: number;
  limit?: number;
}

export interface UserRating {
  id: number;
  userId: number;
  ratingUserId: number;
  bookingId: number;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  ratingUser?: Partial<User>;
}

class UserService {
  /**
   * Get all users (admin only)
   */
  async getUsers(filters?: UserFilters): Promise<User[]> {
    return apiClient.get<User[]>('/admin/users', { params: filters });
  }
  
  /**
   * Get a single user by ID
   */
  async getUser(id: number): Promise<User> {
    return apiClient.get<User>(`/users/${id}`);
  }
  
  /**
   * Update a user (admin only)
   */
  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    return apiClient.put<User>(`/admin/users/${id}`, userData);
  }
  
  /**
   * Delete a user (admin only)
   */
  async deleteUser(id: number): Promise<void> {
    return apiClient.delete<void>(`/admin/users/${id}`);
  }
  
  /**
   * Suspend a user (admin only)
   */
  async suspendUser(id: number, reason: string): Promise<User> {
    return apiClient.put<User>(`/admin/users/${id}/suspend`, { reason });
  }
  
  /**
   * Reactivate a suspended user (admin only)
   */
  async reactivateUser(id: number): Promise<User> {
    return apiClient.put<User>(`/admin/users/${id}/reactivate`);
  }
  
  /**
   * Get user public profile
   */
  async getUserProfile(id: number): Promise<Partial<User>> {
    return apiClient.get<Partial<User>>(`/users/${id}/profile`);
  }
  
  /**
   * Get ratings for a user
   */
  async getUserRatings(userId: number): Promise<UserRating[]> {
    return apiClient.get<UserRating[]>(`/users/${userId}/ratings`);
  }
  
  /**
   * Rate a user
   */
  async rateUser(userId: number, bookingId: number, rating: number, comment: string): Promise<UserRating> {
    return apiClient.post<UserRating>(`/users/${userId}/ratings`, {
      bookingId,
      rating,
      comment,
    });
  }
  
  /**
   * Get current user's ratings
   */
  async getMyRatings(): Promise<UserRating[]> {
    return apiClient.get<UserRating[]>('/users/me/ratings');
  }
  
  /**
   * Upload avatar
   */
  async uploadAvatar(formData: FormData): Promise<{ avatarUrl: string }> {
    return apiClient.post<{ avatarUrl: string }>('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
  
  /**
   * Get user statistics (for profile)
   */
  async getUserStats(userId: number): Promise<{
    totalBookings: number;
    completedBookings: number;
    averageRating: number;
    memberSince: Date;
    responseRate?: number;
    acceptanceRate?: number;
  }> {
    return apiClient.get<{
      totalBookings: number;
      completedBookings: number;
      averageRating: number;
      memberSince: Date;
      responseRate?: number;
      acceptanceRate?: number;
    }>(`/users/${userId}/stats`);
  }
}

export const userService = new UserService(); 