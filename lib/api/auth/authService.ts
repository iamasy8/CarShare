import { apiClient, ApiResponse } from '../apiClient';
import type { User, RegisterUserData } from '@/lib/auth-context';
import type { BillingPeriod, SubscriptionTier } from '@/lib/subscription-plans';

interface SubscriptionUpdatePayload {
  plan_id: number;
  // billing_period?: string; // Include if your backend needs this separately
}
export interface LoginResponse {
  user: User;
}

class AuthService {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<void> {
    await apiClient.post<void>('/auth/login', { email, password });
  }  
  
  /**
   * Register a new user
   */
  async register(userData: RegisterUserData, role: string): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/register', { ...userData, role });
  }
  
  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    return apiClient.post<void>('/auth/logout');
  }
  
  /**
   * Get the current authenticated user profile
   */
  async getProfile(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  }
  
  /**
   * Verify user's identity with documents
   */
  async verifyIdentity(formData: FormData): Promise<User> {
    return apiClient.post<User>('/auth/verify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
  
  /**
   * Refresh the authentication token
   */
  async refreshToken(): Promise<void> {
    return apiClient.post<void>('/auth/refresh-token');
  }
  async updateSubscription (payload: SubscriptionUpdatePayload): Promise<void> {
  try {
    await apiClient.put<ApiResponse<User>>('/user/subscription', payload);

     // No need to return anything specific here as the calling context
     
  } catch (error) {
    console.error("authService.updateSubscription failed:", error);
    throw error; // Re-throw the error for handling in the calling context
  }
};
  
  /**
   * Update user profile
   */
  async updateProfile(profileData: Partial<User>): Promise<User> {
    return apiClient.put<User>('/auth/profile', profileData);
  }
  
  /**
   * Change user password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return apiClient.post<void>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }
  
  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    return apiClient.post<void>('/auth/forgot-password', { email });
  }
  
  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    return apiClient.post<void>('/auth/reset-password', {
      token,
      newPassword,
    });
  }
  
  /**
   * Check if user is authenticated
   */
  async checkAuth(): Promise<boolean> {
    try {
      await this.getProfile();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const authService = new AuthService(); 