"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
// Assuming you still need these types for your User interface
import type { BillingPeriod, SubscriptionTier } from "./subscription-plans"
import { authService } from "./api/auth/authService"
import { ApiError } from "./api/apiClient" // Import ApiError

// Import BackendSubscriptionPlan if your backend nests the full plan object
import { type BackendSubscriptionPlan } from './api/subscriptionService'; // <-- Import this if needed

// Define user types
export type UserRole = "client" | "owner" | "admin" | "superadmin" | null
export type UserStatus = "authenticated" | "unauthenticated" | "loading"
export type AdminPermission = "view" | "edit" | "create" | "delete" | "manage_users" | "manage_admins"

// Keep your interfaces, but ensure they match what your backend returns
export interface Subscription {
  // Include the backend database ID for the plan
  plan_id: number; // <-- Add this line
  tier: SubscriptionTier; // <-- Keep if backend returns directly
  billingPeriod: BillingPeriod; // <-- Keep if backend returns directly
  // Date properties
  startDate: Date; // <-- Assume string from backend, parse in fetchUserProfile
  nextBillingDate?: Date | null; // <-- Assume optional string, parse in fetchUserProfile
  // If your backend includes a nested 'plan' object with details, add it here:
  plan?: BackendSubscriptionPlan | null; // <-- Add this if your backend nests the plan details
}

export interface User {
  id: number
  name: string
  email: string
  role: "client" | "owner" | "admin" | "superadmin"
  permissions?: AdminPermission[] // Ensure your backend includes this for admin roles
  avatar: string | null // Assuming avatar can be null
  subscription?: Subscription | null // Subscription can be optional and null
  isVerified?: boolean
  lastLogin?: Date | null // lastLogin can be null
  // sessionExpiry is not needed on the frontend for Sanctum SPA
  // sessionExpiry?: Date
}

// User registration data type (Keep if needed for frontend registration form)
export interface RegisterUserData {
  email: string
  password: string
  firstName: string
  lastName: string
  [key: string]: any  // For additional fields
}

// Admin audit log interface (Keep if you plan to display these on frontend)
export interface AdminAuditLog {
  id: number
  adminId: number
  action: string
  targetId?: number
  targetType?: string
  timestamp: Date // Or string
  ipAddress?: string | null
  details?: string | null
}

interface AuthContextType {
  user: User | null
  status: UserStatus
  loading: {
    initial: boolean; // <-- Add initial loading state
    login: boolean
    register: boolean
    updateSubscription: boolean
    profile: boolean; // <-- Add the profile loading state here
    updateProfile: boolean
  }
  error: string | null
  login: (email: string, password: string) => Promise<void> // Returns void now
  register: (userData: RegisterUserData, role: UserRole) => Promise<void> // Returns void now
  logout: () => Promise<void> // Logout is async
  updateSubscription: (data: { plan_id: number }) => Promise<void>; // <-- Corrected argument type
  updateProfile: (profileData: Partial<User>) => Promise<void>
  clearError: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  isOwner: boolean
  isClient: boolean
  hasPermission: (permission: AdminPermission) => boolean
  // logAdminAction: (action: string, details?: any) => Promise<void> // Remove if logging is backend-only
  // extendSession: () => Promise<void> // Remove - Sanctum session handled by backend/cookies
  // checkSessionExpiry: () => boolean // Remove - Sanctum session expiry handled by backend/cookies
  // setMockUser: (role: UserRole) => void // Remove mock user functionality
}

// Create context with default values (Update defaults to match the new interface)
const AuthContext = createContext<AuthContextType>({
  user: null,
  status: "loading",
  loading: {
    initial: true, // <-- Set initial loading to true in context default
    login: false,
    register: false,
    updateSubscription: false,
    updateProfile: false,
    profile: false, // <-- ADD THIS LINE: Add the profile property to the default loading object
  },
  error: null,
  login: async () => {}, // Default login does nothing async
  register: async () => {}, // Default register does nothing async
  logout: async () => {}, // Default logout does nothing async
  updateSubscription: async ({ plan_id }) => { console.log(`Default updateSubscription called with plan_id: ${plan_id}`); }, // Default updateSubscription does nothing async
  updateProfile: async () => {}, // Default updateProfile does nothing async
  clearError: () => {},
  isAuthenticated: false,
  isAdmin: false,
  isSuperAdmin: false,
  isOwner: false,
  isClient: false,
  hasPermission: () => false,
})


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<UserStatus>("loading")
  const [loading, setLoading] =useState<AuthContextType['loading']>({
    initial: true, // <-- Initial state for initial loading is true
    login: false,
    register: false,
    updateSubscription: false,
    updateProfile: false, // Add loading state
    profile: true, // <-- ADD THIS LINE: Initialize profile loading state
  })
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Function to fetch user profile after successful auth or on mount
  const fetchUserProfile = async () => {
    setLoading(prev => ({ ...prev, profile: true })); // Set profile loading to true
    try {
      const userData = await authService.getProfile(); // This call should handle the cookie check

      if (userData) {
        // User data received, they are authenticated
        // ... (date parsing logic)
        setUser(userData);
        setStatus("authenticated"); // Set status to "authenticated" on success
      } else {
        // No user data received, they are not authenticated
        console.log("No user data received, setting status to unauthenticated."); // Add logging
        setUser(null);
        setStatus("unauthenticated"); // Set status to "unauthenticated" if no user data
      }
    } catch(err) {
       // If fetching profile fails (e.g., 401 Unauthorized because session expired or no cookie)
       console.error("Failed to fetch user profile:", err); // Add logging
       setUser(null); // Clear user state
       setStatus("unauthenticated"); // Set status to "unauthenticated" on error

       // Optionally, handle specific API errors
       if (err instanceof ApiError && err.status === 401) {
          console.error("API returned 401, unauthenticated."); // Add logging
          // The apiClient's response interceptor should already be handling the redirect to login.
          // We just ensure the frontend state is clean.
       } else {
          // Handle other potential errors
          const errorMessage = (err as any).message || "Failed to load user data.";
          setError(errorMessage);
       }
    }finally {
       // Crucially, set initial loading and profile loading to false after fetch completes
       console.log("fetchUserProfile completed, setting loading to false."); // Add logging
       setLoading(prev => ({ ...prev, initial: false, profile: false }));
    }
  };




  // Check authentication status on mount
  useEffect(() => {
     fetchUserProfile();
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Authentication Actions ---

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(prev => ({ ...prev, login: true }));
    setError(null);
    try {
      // Call authentication service to log in (sets the cookie)
      await authService.login(email, password); // authService.login now returns Promise<void>

      // Fetch user profile after successful login to update context state
      await fetchUserProfile(); // Use the dedicated fetch function

      // No need to return user data here, the state is updated via setUser
      // The calling component can check the isAuthenticated/user state
    } catch (err) {
      console.error("Login failed:", err);
      setUser(null); // Ensure user state is null on login failure
      setStatus("unauthenticated"); // Ensure status is unauthenticated on login failure

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during login");
      }
      throw err; // Re-throw the error so the calling component can handle it (e.g., display error message)
    } finally {
      setLoading(prev => ({ ...prev, login: false }));
    }
  };

  // Register function
  // Assuming your backend /api/register also sets the session cookie and returns user data
  const register = async (userData: RegisterUserData, role: UserRole = "client"): Promise<void> => {
    setLoading(prev => ({ ...prev, register: true }));
    setError(null);
    try {
      if (role === null) {
        throw new Error("Invalid role specified");
      }

      // Call the register API (Assuming it sets cookie and returns user data)
      await authService.register(userData, role as string); // authService.register now returns Promise<void>

       // Fetch user profile after successful registration to update context state
      await fetchUserProfile(); // Use the dedicated fetch function

      // No need to return user data here
    } catch (err) {
      console.error("Registration failed:", err);
       setUser(null); // Ensure user state is null on registration failure
      setStatus("unauthenticated"); // Ensure status is unauthenticated on registration failure
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during registration");
      }
       throw err; // Re-throw the error
    } finally {
      setLoading(prev => ({ ...prev, register: false }));
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await authService.logout(); // Call the backend logout endpoint
      // On successful backend logout, the session cookie is removed by the browser.
    } catch (err) {
      console.error("Logout API call failed:", err);
      // Continue with frontend cleanup even if API call fails (e.g., network issue during logout)
    } finally {
       // Always clear frontend state on logout attempt (success or failure)
       setUser(null);
       setStatus("unauthenticated");
       setError(null); // Clear any previous errors

       // Redirect to homepage or login page
       router.push("/"); // Or your preferred logout redirect path
    }
  };

  // Update subscription
   // Assuming your backend /api/user/subscription endpoint updates user data and returns the updated user
   const updateSubscription = async (data: { plan_id: number }): Promise<void> => { // <-- Corrected argument type
    setLoading(prev => ({ ...prev, updateSubscription: true }));
    setError(null);
    try {
      // Call subscription update API - pass the plan_id
      await authService.updateSubscription(data); // Pass the data object

       // Fetch the updated user profile to refresh context state
       await fetchUserProfile();

    } catch (err) {
      console.error("Failed to update subscription:", err);
       if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while updating subscription");
      }
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, updateSubscription: false }));
    }
  };

   // Update user profile
   // Assuming your backend /api/user endpoint updates user data and returns the updated user
  const updateProfile = async (profileData: Partial<User>): Promise<void> => {
    setLoading(prev => ({ ...prev, updateProfile: true }));
    setError(null);
    try {
      // Call the profile update API
      await authService.updateProfile(profileData);

       // Fetch the updated user profile to refresh context state
       await fetchUserProfile();

    } catch (err) {
      console.error("Profile update failed:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while updating profile");
      }
       throw err;
    } finally {
      setLoading(prev => ({ ...prev, updateProfile: false }));
    }
  }


  const clearError = () => setError(null)


  // --- Derived States and Helper Functions ---

  // Check permissions for admin users (Keep if needed for frontend UI gating)
  const hasPermission = (permission: AdminPermission): boolean => {
    // Permissions only apply to authenticated admin/superadmin users
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return false;
    }

    // Superadmin has all permissions
    if (user.role === "superadmin") {
      return true;
    }

    // Regular admin has permissions based on their assigned permissions array
    if (user.role === "admin" && user.permissions) {
      // Normalize permission name to handle case differences
      const normalizedPermission = permission.toLowerCase();
      return user.permissions.some(p => p.toLowerCase() === normalizedPermission);
    }

    return false; // Default to no permission
  }

  // Calculate derived states
  const isAuthenticated = status === "authenticated" && user !== null;
  const isAdmin = isAuthenticated && (user?.role === "admin" || user?.role === "superadmin");
  const isSuperAdmin = isAuthenticated && user?.role === "superadmin";
  const isOwner = isAuthenticated && user?.role === "owner";
  const isClient = isAuthenticated && user?.role === "client";

 // Remove checkSessionExpiry, extendSession, logAdminAction (if handled backend-only), setMockUser


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
        updateProfile,
        clearError,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
        isOwner,
        isClient,
        hasPermission,
        // logAdminAction, // Remove if removed from interface
        // extendSession, // Remove
        // checkSessionExpiry, // Remove
        // setMockUser, // Remove
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
