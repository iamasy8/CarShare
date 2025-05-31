"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { BillingPeriod, SubscriptionTier } from "./subscription-plans"
import { authService } from "./api/auth/authService"

// Define user types
export type UserRole = "client" | "owner" | "admin" | "superadmin" | null
export type UserStatus = "authenticated" | "unauthenticated" | "loading"
export type AdminPermission = "view" | "edit" | "create" | "delete" | "manage_users" | "manage_admins"

export interface Subscription {
  tier: SubscriptionTier
  billingPeriod: BillingPeriod
  startDate: Date
  nextBillingDate: Date
}

export interface User {
  id: number
  name: string
  email: string
  role: "client" | "owner" | "admin" | "superadmin"
  permissions?: AdminPermission[]
  avatar: string
  subscription?: Subscription
  isVerified?: boolean
  lastLogin?: Date
  sessionExpiry?: Date
}

// User registration data type
export interface RegisterUserData {
  name: string
  email: string
  password: string
  password_confirmation?: string
  [key: string]: any  // For additional fields
}

// Create interface for admin audit logs
export interface AdminAuditLog {
  id: number
  adminId: number
  action: string
  targetId?: number
  targetType?: string
  timestamp: Date
  ipAddress?: string
  details?: string
}

interface AuthContextType {
  user: User | null
  status: UserStatus
  loading: {
    login: boolean
    register: boolean
    updateSubscription: boolean
  }
  error: string | null
  login: (email: string, password: string) => Promise<User>
  register: (userData: RegisterUserData, role: UserRole) => Promise<User>
  logout: () => void
  updateSubscription: (subscription: { tier: SubscriptionTier; billingPeriod: BillingPeriod }) => Promise<void>
  clearError: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  isOwner: boolean
  isClient: boolean
  hasPermission: (permission: AdminPermission) => boolean
  logAdminAction: (action: string, details?: any) => Promise<void>
  extendSession: () => Promise<void>
  checkSessionExpiry: () => boolean
  updateProfile: (profileData: Partial<User>) => Promise<User>
  setMockUser: (role: UserRole) => void
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  status: "unauthenticated",
  loading: {
    login: false,
    register: false,
    updateSubscription: false
  },
  error: null,
  login: async () => ({ id: 0, name: "", email: "", role: "client", avatar: "" }),
  register: async () => ({ id: 0, name: "", email: "", role: "client", avatar: "" }),
  logout: () => {},
  updateSubscription: async () => {},
  clearError: () => {},
  isAuthenticated: false,
  isAdmin: false,
  isSuperAdmin: false,
  isOwner: false,
  isClient: false,
  hasPermission: () => false,
  logAdminAction: async () => {},
  extendSession: async () => {},
  checkSessionExpiry: () => false,
  updateProfile: async () => ({ id: 0, name: "", email: "", role: "client", avatar: "" }),
  setMockUser: () => {}
})

// Mock users for testing
const mockUsers = {
  admin: {
    id: 1,
    name: "Admin User",
    email: "admin@carshare.com",
    role: "admin" as const,
    avatar: "",
    permissions: ["view", "edit", "create", "delete", "manage_users"] as AdminPermission[],
    isVerified: true,
    lastLogin: new Date(),
    sessionExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours from now
  },
  superadmin: {
    id: 2,
    name: "Super Admin",
    email: "superadmin@carshare.com",
    role: "superadmin" as const,
    avatar: "",
    permissions: ["view", "edit", "create", "delete", "manage_users", "manage_admins"] as AdminPermission[],
    isVerified: true,
    lastLogin: new Date(),
    sessionExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24)
    },
  owner: {
    id: 3,
    name: "Car Owner",
    email: "owner@carshare.com",
    role: "owner" as const,
    avatar: "",
    isVerified: true,
    lastLogin: new Date(),
    sessionExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24)
  },
  client: {
    id: 4,
    name: "Client User",
    email: "client@carshare.com",
    role: "client" as const,
    avatar: "",
    isVerified: true,
    lastLogin: new Date(),
    sessionExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24)
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<UserStatus>("loading")
  const [loading, setLoading] = useState({
    login: false,
    register: false,
    updateSubscription: false
  })
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setStatus("loading")
        
        // Check if we have a token stored
        if (authService.hasToken()) {
          try {
            // Fetch user profile from the API
            const userData = await authService.getProfile()
            
            // Make sure we have valid user data before proceeding
            if (userData) {
              // Transform dates into Date objects if needed
              if (userData.subscription) {
                userData.subscription.startDate = new Date(userData.subscription.startDate)
                userData.subscription.nextBillingDate = new Date(userData.subscription.nextBillingDate)
              }
              
              if (userData.sessionExpiry) {
                userData.sessionExpiry = new Date(userData.sessionExpiry)
              }
              
              if (userData.lastLogin) {
                userData.lastLogin = new Date(userData.lastLogin)
              }
              
              setUser(userData)
              setStatus("authenticated")
            } else {
              // If no user data is returned, set status to unauthenticated
              setStatus("unauthenticated")
            }
          } catch (err) {
            console.error("Failed to validate authentication:", err)
            // Clear invalid token
            authService.logout()
            setStatus("unauthenticated")
          }
        } else {
          // No token found
          setStatus("unauthenticated")
        }
      } catch (err) {
        console.error("Auth check failed:", err)
        setStatus("unauthenticated")
        setError("Failed to verify authentication status")
      }
    }
    
    checkAuth()
  }, [])

  // Mock user setting function for testing
  const setMockUser = (role: UserRole) => {
    if (!role || role === null) {
      setUser(null)
      setStatus("unauthenticated")
      return
    }
    
    const mockUser = mockUsers[role as keyof typeof mockUsers]
    setUser(mockUser)
    setStatus("authenticated")
    
    // Redirect based on role
    if (role === "admin" || role === "superadmin") {
      router.push("/admin")
    } else if (role === "owner") {
      router.push("/owner/dashboard")
    } else if (role === "client") {
      router.push("/client/dashboard")
    }
  }

  // Login function
  const login = async (email: string, password: string): Promise<User> => {
    try {
      setLoading(prev => ({ ...prev, login: true }))
      setError(null)
      
      // Use the API for login
      const response = await authService.login(email, password)
      setUser(response.user)
      setStatus("authenticated")
      return response.user
    } catch (error: any) {
      console.error("Login failed:", error)
      setError(error?.message || "Login failed. Please check your credentials.")
      throw error
    } finally {
      setLoading(prev => ({ ...prev, login: false }))
    }
  }

  // Register function
  const register = async (userData: RegisterUserData, role: UserRole = "client"): Promise<User> => {
    try {
      setLoading(prev => ({ ...prev, register: true }))
      setError(null)
      
      if (!role) {
        throw new Error("Role is required for registration")
      }
      
      // Use the API for registration
      const response = await authService.register(userData, role)
      setUser(response.user)
      setStatus("authenticated")
      return response.user
    } catch (error: any) {
      console.error("Registration failed:", error)
      setError(error?.message || "Registration failed. Please try again.")
      throw error
    } finally {
      setLoading(prev => ({ ...prev, register: false }))
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Always clear user state regardless of API response
      setUser(null)
      setStatus("unauthenticated")
      router.push("/login")
    }
  }

  // Update subscription
  const updateSubscription = async (subscription: { tier: SubscriptionTier; billingPeriod: BillingPeriod }): Promise<void> => {
    try {
      setLoading(prev => ({ ...prev, updateSubscription: true }))
      setError(null)
      
      // Call API to update subscription
      await authService.updateProfile({ 
        subscription: {
          ...subscription,
          startDate: new Date(),
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        } 
      })
      
      // Update user state with new subscription
      if (user) {
        setUser({
          ...user,
          subscription: {
            ...subscription,
            startDate: new Date(),
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        })
      }
    } catch (error: any) {
      console.error("Subscription update failed:", error)
      setError(error?.message || "Failed to update subscription. Please try again.")
      throw error
    } finally {
      setLoading(prev => ({ ...prev, updateSubscription: false }))
    }
  }

  const clearError = () => setError(null)

  // Check if session is expired
  const checkSessionExpiry = (): boolean => {
    if (!user?.sessionExpiry) return false
    
    const now = new Date()
    const sessionExpiry = new Date(user.sessionExpiry)
    
    return now > sessionExpiry
  }

  // Log admin actions for audit trail
  const logAdminAction = async (action: string, details: any = {}): Promise<void> => {
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      console.error("Only admins can log actions")
      return
    }
    
    try {
      // In a real implementation, this would call an API endpoint
      console.log(`Admin action logged: ${action}`, {
        adminId: user.id,
        action,
        timestamp: new Date(),
        details
      })
    } catch (error) {
      console.error("Failed to log admin action:", error)
    }
  }

  // Extend session
  const extendSession = async (): Promise<void> => {
    try {
      if (!user) return
      
      // Refresh token
      const refreshResponse = await authService.refreshToken()
      
      if (refreshResponse) {
        // Update session expiry
        const newExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
        setUser({
          ...user,
          sessionExpiry: newExpiry
        })
      } else {
        // If refresh failed, logout
        logout()
      }
    } catch (error) {
      console.error("Failed to extend session:", error)
      // If extending session fails, logout
      logout()
    }
  }

  // Update user profile
  const updateProfile = async (profileData: Partial<User>): Promise<User> => {
    try {
      if (!user) {
        throw new Error("User not authenticated")
      }
      
      // Call API to update profile
      const updatedUser = await authService.updateProfile(profileData)
      
      // Update local user state
      setUser({
        ...user,
        ...updatedUser
      })
      
      return updatedUser
    } catch (error: any) {
      console.error("Profile update failed:", error)
      setError(error?.message || "Failed to update profile. Please try again.")
      throw error
    }
  }

  // Check if user has specific permission
  const hasPermission = (permission: AdminPermission): boolean => {
    if (!user) return false
    
    // Super admins have all permissions
    if (user.role === "superadmin") return true
    
    // Admins need to check their permissions array
    if (user.role === "admin") {
      return user.permissions?.includes(permission) || false
    }
    
    // Other roles don't have admin permissions
    return false
  }

  // Computed properties
  const isAuthenticated = status === "authenticated" && !!user
  const isAdmin = isAuthenticated && user?.role === "admin"
  const isSuperAdmin = isAuthenticated && user?.role === "superadmin"
  const isOwner = isAuthenticated && user?.role === "owner"
  const isClient = isAuthenticated && user?.role === "client"

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        loading,
        error,
        login,
        register,
        logout,
        updateSubscription,
        clearError,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
        isOwner,
        isClient,
        hasPermission,
        logAdminAction,
        extendSession,
        checkSessionExpiry,
        updateProfile,
        setMockUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  
  return context
}
