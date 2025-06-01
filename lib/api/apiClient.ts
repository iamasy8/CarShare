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
  
  // Field mapping between frontend and backend
  private fieldMappings = {
    // Frontend to backend
    toBackend: {
      postalCode: 'postal_code',
    },
    // Backend to frontend
    toFrontend: {
      postal_code: 'postalCode',
    }
  };
  
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
        
        // Map frontend field names to backend field names in request data
        // Skip for FormData objects
        if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
          config.data = this.mapFieldsToBackend(config.data);
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
        
        // Map backend field names to frontend field names in response data
        if (response.data) {
          if (response.data.data) {
            response.data.data = this.mapFieldsToFrontend(response.data.data);
          } else {
            response.data = this.mapFieldsToFrontend(response.data);
          }
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
        
        // For validation errors (422), include the validation errors in the message
        if (status === 422 && data && (data as any).errors) {
          const validationErrors = (data as any).errors;
          const errorMessages = Object.values(validationErrors).flat() as string[];
          const formattedMessage = errorMessages.join(', ');
          return Promise.reject(new ApiError(formattedMessage, status, data));
        }
        
        return Promise.reject(new ApiError(message, status, data));
      }
    );
  }
  
  /**
   * Maps frontend field names to backend field names
   */
  private mapFieldsToBackend(data: any): any {
    if (!data || typeof data !== 'object') return data;
    
    // If it's an array, map each item
    if (Array.isArray(data)) {
      return data.map(item => this.mapFieldsToBackend(item));
    }
    
    // Create a new object with mapped fields
    const result: any = {};
    
    for (const [key, value] of Object.entries(data)) {
      const mappedKey = this.fieldMappings.toBackend[key as keyof typeof this.fieldMappings.toBackend] || key;
      result[mappedKey] = typeof value === 'object' ? this.mapFieldsToBackend(value) : value;
    }
    
    return result;
  }
  
  /**
   * Maps backend field names to frontend field names
   */
  private mapFieldsToFrontend(data: any): any {
    if (!data || typeof data !== 'object') return data;
    
    // If it's an array, map each item
    if (Array.isArray(data)) {
      return data.map(item => this.mapFieldsToFrontend(item));
    }
    
    // Create a new object with mapped fields
    const result: any = {};
    
    for (const [key, value] of Object.entries(data)) {
      const mappedKey = this.fieldMappings.toFrontend[key as keyof typeof this.fieldMappings.toFrontend] || key;
      result[mappedKey] = typeof value === 'object' ? this.mapFieldsToFrontend(value) : value;
    }
    
    return result;
  }
  
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get(url, config);
      // Handle both formats: { data, success, message } or direct data
      if (response.data && typeof response.data === 'object' && 'data' in response.data && 'success' in response.data) {
        return response.data.data as T;
      }
      return response.data as T;
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      if (error instanceof AxiosError && error.response?.data) {
        // Extract error message from response if available
        const errorMessage = error.response.data.message || 'An error occurred while fetching data';
        throw new ApiError(errorMessage, error.response.status, error.response.data);
      }
      throw error;
    }
  }
  
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    // Special handling for FormData
    if (data instanceof FormData) {
      console.log("Sending FormData to:", url);
      console.log("FormData contents:", Array.from(data.entries()));
      
      // Make sure we're using the right content type
      const formConfig = {
        ...config,
        headers: {
          ...(config?.headers || {}),
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        }
      };
      
      try {
        const response = await this.client.post(url, data, formConfig);
        // Handle both formats: { data, success, message } or direct data
        if (response.data && typeof response.data === 'object' && 'data' in response.data && 'success' in response.data) {
          return response.data.data as T;
        }
        return response.data as T;
      } catch (error) {
        console.error("API Error:", error);
        throw error;
      }
    } else {
      // Regular JSON request
    const response = await this.client.post(url, data, config);
    // Handle both formats: { data, success, message } or direct data
    if (response.data && typeof response.data === 'object' && 'data' in response.data && 'success' in response.data) {
      return response.data.data as T;
    }
    return response.data as T;
    }
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