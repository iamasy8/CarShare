import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

class ApiError extends Error {
  status: number;
  data: any;
  
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export default class ApiClient {
  private client: AxiosInstance;
  
  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || '/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true, // This enables sending cookies with requests
    });
    
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
          }
        }
        
        // Add CSRF token if available
        const csrfToken = typeof document !== 'undefined' ? 
          document.cookie
            .split('; ')
            .find(row => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1] : null;
        
        if (csrfToken) {
          config.headers['X-XSRF-TOKEN'] = csrfToken;
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Store token if it's in the response
        if (response.data?.data?.token && typeof window !== 'undefined') {
          localStorage.setItem('auth_token', response.data.data.token);
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        
        // Handle 401 Unauthorized - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh token
            const refreshResponse = await this.refreshToken();
            
            // If token refresh was successful, retry the original request
            if (refreshResponse && typeof window !== 'undefined') {
              const newToken = refreshResponse.token;
              if (newToken) {
                localStorage.setItem('auth_token', newToken);
                this.client.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                return this.client(originalRequest);
              }
            }
            
            // If we couldn't get a new token, redirect to login
            if (typeof window !== 'undefined') {
              localStorage.removeItem('auth_token');
              window.location.href = '/login';
            }
            return Promise.reject(error);
          } catch (refreshError) {
            // If refresh fails, clear token and redirect to login
            if (typeof window !== 'undefined') {
              localStorage.removeItem('auth_token');
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        }
        
        // Create a standardized error
        const message = (error.response?.data as any)?.message || error.message || 'An unknown error occurred';
        const status = error.response?.status || 500;
        const data = error.response?.data;
        
        return Promise.reject(new ApiError(message, status, data));
      }
    );
  }
  
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(url, config);
    // Handle both formats: { data, success, message } or direct data
    if (response.data && typeof response.data === 'object' && 'data' in response.data && 'success' in response.data) {
      return response.data.data as T;
    }
    return response.data as T;
  }
  
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post(url, data, config);
    // Handle both formats: { data, success, message } or direct data
    if (response.data && typeof response.data === 'object' && 'data' in response.data && 'success' in response.data) {
      return response.data.data as T;
    }
    return response.data as T;
  }
  
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put(url, data, config);
    // Handle both formats: { data, success, message } or direct data
    if (response.data && typeof response.data === 'object' && 'data' in response.data && 'success' in response.data) {
      return response.data.data as T;
    }
    return response.data as T;
  }
  
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(url, config);
    // Handle both formats: { data, success, message } or direct data
    if (response.data && typeof response.data === 'object' && 'data' in response.data && 'success' in response.data) {
      return response.data.data as T;
    }
    return response.data as T;
  }
  
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch(url, data, config);
    // Handle both formats: { data, success, message } or direct data
    if (response.data && typeof response.data === 'object' && 'data' in response.data && 'success' in response.data) {
      return response.data.data as T;
    }
    return response.data as T;
  }
  
  private async refreshToken(): Promise<{token: string} | null> {
    try {
      const response = await this.client.post('/auth/refresh-token');
      return response.data?.data || null;
    } catch (error) {
      return null;
    }
  }
  
  // Method to clear authentication token
  public clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient(); 