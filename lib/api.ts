import axios from "axios";
import type { SubscriptionTier, BillingPeriod } from "./subscription-plans";
import type { RegisterUserData } from "./auth-context";

// Define API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Create API client with interceptors
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config: any) => {
    // For now using localStorage, but will be replaced with cookies
    // in the production implementation
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// User related types
export interface User {
  id: number;
  name: string;
  email: string;
  role: "client" | "owner" | "admin";
  avatar: string;
  isVerified: boolean;
  subscription?: {
    tier: SubscriptionTier;
    billingPeriod: BillingPeriod;
    startDate: Date;
    nextBillingDate: Date;
  };
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Car related types
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
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

// Booking related types
export interface Booking {
  id: number;
  carId: number;
  clientId: number;
  startDate: Date;
  endDate: Date;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  totalPrice: number;
  serviceFee: number;
  ownerPayout: number;
  createdAt: Date;
  updatedAt: Date;
}

// Auth services
export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", { email, password });
    return response.data.data;
  },
  
  register: async (userData: RegisterUserData, role: string): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>("/auth/register", { ...userData, role });
    return response.data.data;
  },
  
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
  
  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>("/auth/me");
    return response.data.data;
  },
  
  verifyIdentity: async (formData: FormData): Promise<User> => {
    const response = await api.post<ApiResponse<User>>("/auth/verify", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  }
};

// Car services
export const carService = {
  getCars: async (filters?: any): Promise<Car[]> => {
    const response = await api.get<ApiResponse<Car[]>>("/cars", { params: filters });
    return response.data.data;
  },
  
  getCar: async (id: number): Promise<Car> => {
    const response = await api.get<ApiResponse<Car>>(`/cars/${id}`);
    return response.data.data;
  },
  
  createCar: async (formData: FormData): Promise<Car> => {
    const response = await api.post<ApiResponse<Car>>("/cars", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },
  
  updateCar: async (id: number, formData: FormData): Promise<Car> => {
    const response = await api.put<ApiResponse<Car>>(`/cars/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },
  
  deleteCar: async (id: number): Promise<void> => {
    await api.delete(`/cars/${id}`);
  },
  
  getOwnerCars: async (status?: string): Promise<Car[]> => {
    const response = await api.get<ApiResponse<Car[]>>("/owner/cars", {
      params: { status },
    });
    return response.data.data;
  },
  
  getOwnerCarCount: async (): Promise<number> => {
    const response = await api.get<ApiResponse<{ count: number }>>("/owner/cars/count");
    return response.data.data.count;
  }
};

// Booking services
export const bookingService = {
  createBooking: async (bookingData: {
    carId: number;
    startDate: Date;
    endDate: Date;
    message?: string;
  }): Promise<Booking> => {
    const response = await api.post<ApiResponse<Booking>>("/bookings", bookingData);
    return response.data.data;
  },
  
  getBookings: async (status?: string): Promise<Booking[]> => {
    const response = await api.get<ApiResponse<Booking[]>>("/bookings", {
      params: { status },
    });
    return response.data.data;
  },
  
  getBooking: async (id: number): Promise<Booking> => {
    const response = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data.data;
  },
  
  updateBookingStatus: async (id: number, status: string): Promise<Booking> => {
    const response = await api.put<ApiResponse<Booking>>(`/bookings/${id}/status`, { status });
    return response.data.data;
  }
};

// Subscription services
export const subscriptionService = {
  updateSubscription: async (subscription: {
    tier: SubscriptionTier;
    billingPeriod: BillingPeriod;
  }): Promise<User> => {
    const response = await api.put<ApiResponse<User>>("/subscriptions", subscription);
    return response.data.data;
  },
  
  getBillingHistory: async (): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>("/subscriptions/billing-history");
    return response.data.data;
  }
};

// Message services
export const messageService = {
  sendMessage: async (data: {
    recipientId: number;
    content: string;
    carId?: number;
  }): Promise<any> => {
    const response = await api.post<ApiResponse<any>>("/messages", data);
    return response.data.data;
  },
  
  getConversations: async (): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>("/messages/conversations");
    return response.data.data;
  },
  
  getMessages: async (conversationId: number): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>(`/messages/conversations/${conversationId}`);
    return response.data.data;
  }
}; 