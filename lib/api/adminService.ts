import { apiClient } from "./apiClient"
import type { 
  Admin,
  BaseUser,
  UserListResponse,
  CarListResponse,
  BookingListResponse
} from "./types"

export type AdminDocument = Admin.Document

export const adminService = {
  // Dashboard Statistics
  getStats: async (): Promise<Admin.Stats> => {
    const response = await apiClient.get<Admin.Stats>("/admin/stats")
    return response
  },

  // User Management
  getUsers: async (page: number = 1, filters?: { role?: string; search?: string }): Promise<UserListResponse> => {
    const response = await apiClient.get<UserListResponse>("/admin/users", {
      params: {
        page,
        ...filters
      }
    })
    return response
  },

  updateUser: async (userId: number, userData: Partial<BaseUser>): Promise<BaseUser> => {
    const response = await apiClient.put<BaseUser>(`/admin/users/${userId}`, userData)
    return response
  },

  deleteUser: async (userId: number): Promise<void> => {
    await apiClient.delete(`/admin/users/${userId}`)
  },

  // Activity Logs
  getActivityLogs: async (page: number = 1): Promise<{ logs: Admin.ActivityLog[]; total: number }> => {
    const response = await apiClient.get<{ logs: Admin.ActivityLog[]; total: number }>("/admin/activity-logs", {
      params: { page }
    })
    return response
  },

  // Car Management
  getPendingCars: async (page: number = 1, filters?: { status?: string }): Promise<CarListResponse> => {
    const response = await apiClient.get<CarListResponse>("/admin/cars", {
      params: { page, ...filters }
    })
    return response
  },

  approveCar: async (carId: number): Promise<void> => {
    await apiClient.post(`/admin/cars/${carId}/approve`)
  },

  rejectCar: async (carId: number, reason: string): Promise<void> => {
    await apiClient.post(`/admin/cars/${carId}/reject`, { reason })
  },

  // Booking Management
  getBookings: async (page: number = 1, filters?: { status?: string }): Promise<BookingListResponse> => {
    const response = await apiClient.get<BookingListResponse>("/admin/bookings", {
      params: {
        page,
        ...filters
      }
    })
    return response
  },

  updateBookingStatus: async (bookingId: number, status: string): Promise<void> => {
    await apiClient.put(`/admin/bookings/${bookingId}/status`, { status })
  },

  // Document Management
  getDocuments: async (page: number = 1): Promise<{ documents: AdminDocument[] }> => {
    const response = await apiClient.get<{ documents: AdminDocument[] }>("/admin/documents", {
      params: { page }
    })
    return response
  },

  updateDocumentStatus: async (documentId: number, status: 'approved' | 'rejected', reason?: string): Promise<void> => {
    await apiClient.put(`/admin/documents/${documentId}/status`, { status, reason })
  }
}
