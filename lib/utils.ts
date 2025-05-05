import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"
import { z } from "zod"

// Utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Error handling utilities
export const ErrorMessage = {
  show: (message: string, type: "error" | "warning" | "info" = "error") => {
    toast[type](message, {
      duration: 5000,
      position: "top-right",
    })
  },
}

// Loading state utilities
export const LoadingState = {
  show: () => {
    // Implement loading state logic
  },
  hide: () => {
    // Implement loading state hide logic
  },
}

// Form validation schemas
export const validationSchemas = {
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  phone: z.string().regex(/^\+?[0-9]{10,}$/, "Numéro de téléphone invalide"),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
}

// Security utilities
export const securityUtils = {
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
  
  // CSRF token generation
  generateCSRFToken: () => {
    return Math.random().toString(36).substring(2)
  },
  
  // Input sanitization
  sanitizeInput: (input: string) => {
    return input.replace(/[<>]/g, "")
  },
  
  // Security headers
  securityHeaders: {
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  },
}

// Session management
export const sessionUtils = {
  timeout: 30 * 60 * 1000, // 30 minutes
  checkSession: () => {
    // Implement session check logic
  },
  refreshSession: () => {
    // Implement session refresh logic
  },
}

// Offline support
export const offlineUtils = {
  isOnline: () => navigator.onLine,
  handleOffline: () => {
    // Implement offline handling logic
  },
  handleOnline: () => {
    // Implement online handling logic
  },
}

// Accessibility utilities
export const a11yUtils = {
  focusTrap: (element: HTMLElement) => {
    // Implement focus trap logic
  },
  announceToScreenReader: (message: string) => {
    // Implement screen reader announcement
  },
}

// Data persistence
export const persistenceUtils = {
  saveToLocalStorage: (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  },
  getFromLocalStorage: (key: string) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      return null
    }
  },
}

/**
 * Provides consistent error handling across the application
 */
export const handleError = (error: unknown, defaultMessage: string): string => {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return defaultMessage;
  }
};

/**
 * Provides consistent date formatting across the application
 */
export const formatDate = (dateInput: string | Date | undefined, format: 'short' | 'long' = 'long'): string => {
  if (!dateInput) return "N/A";
  
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "Invalid date";
  }
  
  const options: Intl.DateTimeFormatOptions = format === 'long' 
    ? { day: "numeric", month: "long", year: "numeric" }
    : { day: "numeric", month: "numeric", year: "numeric" };
    
  return date.toLocaleDateString("fr-FR", options);
};

/**
 * Validates file uploads
 */
export const validateFiles = (
  files: File[], 
  options: { 
    maxSize?: number, 
    allowedTypes?: string[], 
    required?: boolean 
  } = {}
): { valid: boolean, message?: string } => {
  const { 
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    required = true
  } = options;
  
  if (required && (!files || files.length === 0)) {
    return { valid: false, message: "Please select at least one file" };
  }
  
  for (const file of files) {
    if (file.size > maxSize) {
      return { 
        valid: false, 
        message: `The file ${file.name} exceeds the maximum size of ${Math.round(maxSize / (1024 * 1024))}MB`
      };
    }
    
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        message: `The file type for ${file.name} is not supported. Please use ${allowedTypes.join(', ')}`
      };
    }
  }
  
  return { valid: true };
};
