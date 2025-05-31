import { apiClient } from '../apiClient';
import type { User, RegisterUserData } from '@/lib/auth-context';

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<{success: boolean, data: AuthResponse, message: string}>('/auth/login', { email, password });
    // The apiClient automatically extracts response.data.data, so we get the AuthResponse directly
    return response;
  }
  
  /**
   * Register a new user
   */
  async register(userData: RegisterUserData, role: string): Promise<AuthResponse> {
    // Transform frontend firstName/lastName to backend name
    const backendUserData = {
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      password: userData.password,
      role
    };
    
    const response = await apiClient.post<{success: boolean, data: AuthResponse, message: string}>('/auth/register', backendUserData);
    return response;
  }
  
  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post<void>('/auth/logout');
    } finally {
      // Clear token regardless of API response
      apiClient.clearToken();
    }
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
  async refreshToken(): Promise<AuthResponse | null> {
    try {
      const response = await apiClient.post<{success: boolean, data: AuthResponse, message: string}>('/auth/refresh-token');
      return response;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  }
  
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
  
  /**
   * Get the stored auth token
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }
  
  /**
   * Check if the user has a stored token
   */
  hasToken(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService(); 