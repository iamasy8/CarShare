// Admin Types
export namespace Admin {
  export interface Stats {
    totalUsers: number
    previousTotalUsers?: number
    activeListings: number
    previousActiveListings?: number
    pendingApprovals: number
    previousPendingApprovals?: number
    activityCount: number
    previousActivityCount?: number
    lastUpdated: string
    revenue?: {
      daily: number
      weekly: number
      monthly: number
    }
  }

  export interface ActivityLog {
    id: number
    userId: number
    action: string
    details: string
    timestamp: string
    userName: string
    userRole: string
  }

  export interface Document {
    id: number
    filename: string
    type: string
    status: 'pending' | 'approved' | 'rejected'
    userName: string
    uploadedAt: string
  }
}

export type AdminDocument = Admin.Document

export interface PaginationMeta {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
}

export interface BaseUser {
  id: number
  name: string
  email: string
  role: string
  avatar?: string | null
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface BaseCar {
  id: number
  make: string
  model: string
  year: number
  pricePerDay: number
  location: string
  description: string
  images: string[]
  ownerId: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface BaseBooking {
  id: number
  carId: number
  userId: number
  startDate: string
  endDate: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  totalPrice: number
  createdAt: string
  updatedAt: string
  car?: BaseCar
  user?: BaseUser
}

export interface UserListResponse {
  data: BaseUser[]
  meta: PaginationMeta
}

export interface CarListResponse {
  data: BaseCar[]
  meta: PaginationMeta
}

export interface BookingListResponse {
  data: BaseBooking[]
  meta: PaginationMeta
}

export interface User {
  id: number
  name: string
  email: string
  role: string
  avatar?: string | null
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Car {
  id: number
  make: string
  model: string
  year: number
  pricePerDay: number
  location: string
  description: string
  images: string[]
  ownerId: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: number
  carId: number
  userId: number
  startDate: string
  endDate: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  totalPrice: number
  createdAt: string
  updatedAt: string
  car?: Car
  user?: User
} 