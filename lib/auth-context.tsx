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
  email: string
  password: string
  firstName: string
  lastName: string
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
  const [status, setStatus] = useState<UserStatus>("unauthenticated")
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
        
        try {
          // COMMENTED FOR TESTING - NO BACKEND NEEDED
          // Fetch user profile from the API
          // const userData = await authService.getProfile()
          
          // // Transform dates into Date objects if needed
          // if (userData.subscription) {
          //   userData.subscription.startDate = new Date(userData.subscription.startDate)
          //   userData.subscription.nextBillingDate = new Date(userData.subscription.nextBillingDate)
          // }
          
          // if (userData.sessionExpiry) {
          //   userData.sessionExpiry = new Date(userData.sessionExpiry)
          // }
          
          // if (userData.lastLogin) {
          //   userData.lastLogin = new Date(userData.lastLogin)
          // }
          
          // setUser(userData)
          
          // UNCOMMENT THIS LINE TO AUTO-LOGIN AS ADMIN FOR TESTING
          // setUser(mockUsers.admin)
          
              setStatus("unauthenticated")
          } catch (err) {
          console.error("Failed to validate authentication:", err)
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
      
      // FOR TESTING - No backend needed
      // Check if email matches one of our mock users
      if (email === "admin@carshare.com") {
        setUser(mockUsers.admin)
        setStatus("authenticated")
        return mockUsers.admin
      } else if (email === "superadmin@carshare.com") {
        setUser(mockUsers.superadmin)
        setStatus("authenticated")
        return mockUsers.superadmin
      } else if (email === "owner@carshare.com") {
        setUser(mockUsers.owner)
        setStatus("authenticated")
        return mockUsers.owner
      } else if (email === "client@carshare.com") {
        setUser(mockUsers.client)
        setStatus("authenticated")
        return mockUsers.client
      }
      
      // Validate inputs
      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      // Admin login security check - enforce specific admin email format
      if (email.includes("admin") && !email.endsWith("@carshare.com")) {
        throw new Error("Invalid admin credentials")
      }
      
      // Create audit log entry for admin login attempts
      const isAdminAttempt = email.includes("admin")
      if (isAdminAttempt) {
        // In production, this would call the API to log the attempt
        console.log(`Admin login attempt: ${email} at ${new Date().toISOString()}`)
      }
      
      // Call authentication service
      const response = await authService.login(email, password)
      
      // Verify and process the user data
      const userData = response.user
      
      // Transform dates back into Date objects
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
      
      return userData
    } catch (err) {
      console.error("Login failed:", err)
      if (err instanceof Error) {
        setError(err.message)
        throw new Error(err.message)
          } else {
        setError("An unknown error occurred during login")
        throw new Error("An unknown error occurred during login")
          }
    } finally {
      setLoading(prev => ({ ...prev, login: false }))
    }
  }

  // Register function
  const register = async (userData: RegisterUserData, role: UserRole = "client"): Promise<User> => {
    try {
      if (role === null) {
        throw new Error("Invalid role specified")
      }
      
      setLoading(prev => ({ ...prev, register: true }))
      setError(null)
      
      // Basic validation
      if (!userData.email || !userData.password) {
        throw new Error("Email and password are required")
      }

      // FOR TESTING - No backend needed
      // Create a mock user based on the registration data
      const mockUser: User = {
              id: Math.floor(Math.random() * 1000) + 10,
              name: `${userData.firstName} ${userData.lastName}`,
              email: userData.email,
              role: role as "client" | "owner" | "admin" | "superadmin",
        avatar: "",
        isVerified: false, // Changed from true to false as new users shouldn't be verified automatically
        lastLogin: new Date(),
        sessionExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24)
      }
      
      setUser(mockUser)
      setStatus("authenticated")
      return mockUser
      
      // COMMENTED FOR TESTING - No backend needed
      // Call the register API
      // const response = await authService.register(userData, role as string)
      
      // // Process user data
      // const user = response.user
      
      // // Transform dates back into Date objects
      // if (user.subscription) {
      //   user.subscription.startDate = new Date(user.subscription.startDate)
      //   user.subscription.nextBillingDate = new Date(user.subscription.nextBillingDate)
      // }
      
      // setUser(user)
      // setStatus("authenticated")
      
      // return user
    } catch (err) {
      console.error("Registration failed:", err)
      if (err instanceof Error) {
        setError(err.message)
        throw new Error(err.message)
      } else {
        setError("An unknown error occurred during registration")
        throw new Error("An unknown error occurred during registration")
      }
    } finally {
      setLoading(prev => ({ ...prev, register: false }))
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error("Logout API call failed:", err)
      // Continue with cleanup even if API call fails
    }
    
      setUser(null)
      setStatus("unauthenticated")
    
    // Redirect to homepage
      router.push("/")
  }

  // Update subscription
  const updateSubscription = async (subscription: { tier: SubscriptionTier; billingPeriod: BillingPeriod }): Promise<void> => {
    try {
      setLoading(prev => ({ ...prev, updateSubscription: true }))
      setError(null)
      
      // Call subscription update API through the subscription service
      // const updatedUser = await subscriptionService.updateSubscription(subscription)
      
      // For now, just update the user state directly
      // This should be replaced with an actual API call when backend is ready
      if (user) {
            const updatedUser = { 
              ...user, 
              subscription: {
            ...subscription,
                startDate: new Date(),
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              } 
            }
            
            setUser(updatedUser)
      }
      
    } catch (err) {
      console.error("Failed to update subscription:", err)
      if (err instanceof Error) {
        setError(err.message)
        throw new Error(err.message)
      } else {
        setError("An unknown error occurred while updating subscription")
        throw new Error("An unknown error occurred while updating subscription")
      }
    } finally {
      setLoading(prev => ({ ...prev, updateSubscription: false }))
    }
  }

  const clearError = () => setError(null)

  // Check if session is expired
  const checkSessionExpiry = (): boolean => {
    if (!user?.sessionExpiry) return false
    
    const now = new Date()
    const isExpired = now > user.sessionExpiry
    
    if (isExpired) {
      // Trigger logout automatically
      logout()
    }
    
    return isExpired
  }

  // Log admin actions
  const logAdminAction = async (action: string, details: any = {}): Promise<void> => {
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return
    }
    
    try {
      // In production, this would call the API to log admin actions
      console.log(`Admin action: ${action} by ${user.email} at ${new Date().toISOString()}`, details)
      
      // const response = await api.post('/admin/audit-log', {
      //   action,
      //   details: JSON.stringify(details),
      // })
    } catch (error) {
      console.error("Failed to log admin action:", error)
    }
  }

  // Extend session
  const extendSession = async (): Promise<void> => {
    if (!user) return
    
    try {
      // Call token refresh API
      await authService.refreshToken()
      
      // Update session expiry with a configurable duration
      const SESSION_DURATION_MS = 60 * 60 * 1000 // 1 hour in milliseconds
      const extendedUser = {
        ...user,
        sessionExpiry: new Date(Date.now() + SESSION_DURATION_MS)
      }
      
      setUser(extendedUser)
    } catch (error) {
      console.error("Failed to extend session:", error)
      // If refresh token fails, log the user out
      logout()
    }
  }
  
  // Update user profile
  const updateProfile = async (profileData: Partial<User>): Promise<User> => {
    try {
      setError(null)
      
      // Call the profile update API
      const updatedUser = await authService.updateProfile(profileData)
      
      // Transform dates back into Date objects
      if (updatedUser.subscription) {
        updatedUser.subscription.startDate = new Date(updatedUser.subscription.startDate)
        updatedUser.subscription.nextBillingDate = new Date(updatedUser.subscription.nextBillingDate)
      }
      
      if (updatedUser.sessionExpiry) {
        updatedUser.sessionExpiry = new Date(updatedUser.sessionExpiry)
      }
      
      if (updatedUser.lastLogin) {
        updatedUser.lastLogin = new Date(updatedUser.lastLogin)
    }
    
    setUser(updatedUser)
      
      return updatedUser
    } catch (err) {
      console.error("Profile update failed:", err)
      if (err instanceof Error) {
        setError(err.message)
        throw new Error(err.message)
      } else {
        setError("An unknown error occurred while updating profile")
        throw new Error("An unknown error occurred while updating profile")
      }
    }
  }

  // Check permissions for admin users
  const hasPermission = (permission: AdminPermission): boolean => {
    if (!user) return false
    
    // Superadmin has all permissions
    if (user.role === "superadmin") return true
    
    // Regular admin has permissions based on their assigned permissions
    if (user.role === "admin" && user.permissions) {
      // Normalize permission name to handle case differences
      const normalizedPermission = permission.toLowerCase()
      return user.permissions.some(p => p.toLowerCase() === normalizedPermission)
  }
    
    return false
  }

  // Calculate derived states
  const isAuthenticated = status === "authenticated" && user !== null
  const isAdmin = isAuthenticated && (user?.role === "admin" || user?.role === "superadmin")
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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
