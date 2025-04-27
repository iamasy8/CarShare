import { Booking, Car } from "./api";

/**
 * Helper functions for API interactions, especially for the owner side
 * These functions provide consistent error handling and data transformation
 */

// General error handler for API calls
export const handleApiError = (error: any, defaultMessage: string = "An error occurred") => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }
  
  return defaultMessage;
};

// Booking-related helpers
export const bookingHelpers = {
  // Format booking dates for display
  formatBookingDates: (booking: Booking) => {
    const startDate = new Date(booking.startDate).toLocaleDateString();
    const endDate = new Date(booking.endDate).toLocaleDateString();
    return { startDate, endDate };
  },
  
  // Calculate booking duration in days
  calculateDuration: (booking: Booking) => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const durationMs = end.getTime() - start.getTime();
    return Math.ceil(durationMs / (1000 * 60 * 60 * 24));
  },
  
  // Get color classes for booking status badges
  getStatusBadgeClasses: (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  },
  
  // Format price with currency
  formatPrice: (price: number, currency: string = "€") => {
    return `${currency}${price.toFixed(2)}`;
  }
};

// Car-related helpers
export const carHelpers = {
  // Prepare car form data for API submission
  prepareCarFormData: (carData: any, images: File[]) => {
    const formData = new FormData();
    
    // Add basic car details
    Object.entries(carData).forEach(([key, value]) => {
      if (key !== 'features' && key !== 'availableImmediately' && value !== undefined) {
        formData.append(key, String(value));
      }
    });
    
    // Add features
    if (carData.features) {
      Object.entries(carData.features).forEach(([feature, enabled]) => {
        formData.append(`features[${feature}]`, String(enabled));
      });
    }
    
    // Add availability
    if (carData.availableImmediately !== undefined) {
      formData.append('availableImmediately', String(carData.availableImmediately));
    }
    
    // Add images
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });
    
    return formData;
  },
  
  // Get car type label
  getCarTypeLabel: (type: string) => {
    const types: Record<string, string> = {
      "sedan": "Sedan",
      "suv": "SUV",
      "hatchback": "Hatchback",
      "convertible": "Convertible",
      "coupe": "Coupe",
      "van": "Van",
      "pickup": "Pickup"
    };
    
    return types[type.toLowerCase()] || type;
  },
  
  // Get fuel type label
  getFuelTypeLabel: (fuelType: string) => {
    const types: Record<string, string> = {
      "gasoline": "Gasoline",
      "diesel": "Diesel",
      "hybrid": "Hybrid",
      "electric": "Electric",
      "plugin_hybrid": "Plug-in Hybrid",
      "hydrogen": "Hydrogen"
    };
    
    return types[fuelType.toLowerCase()] || fuelType;
  },
  
  // Get transmission type label
  getTransmissionLabel: (transmission: string) => {
    const types: Record<string, string> = {
      "automatic": "Automatic",
      "manual": "Manual",
      "semi-automatic": "Semi-automatic",
      "continuously_variable": "Continuously Variable"
    };
    
    return types[transmission.toLowerCase()] || transmission;
  }
};

// Owner dashboard helpers
export const ownerDashboardHelpers = {
  // Calculate earnings summary
  calculateEarningsSummary: (bookings: Booking[]) => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    const completedBookings = bookings.filter(b => b.status === "completed");
    
    // Monthly earnings (current month)
    const monthlyEarnings = completedBookings
      .filter(booking => {
        const bookingDate = new Date(booking.endDate);
        return bookingDate.getMonth() === thisMonth && bookingDate.getFullYear() === thisYear;
      })
      .reduce((sum, booking) => sum + booking.ownerPayout, 0);
    
    // Yearly earnings (current year)
    const yearlyEarnings = completedBookings
      .filter(booking => {
        const bookingDate = new Date(booking.endDate);
        return bookingDate.getFullYear() === thisYear;
      })
      .reduce((sum, booking) => sum + booking.ownerPayout, 0);
    
    // Pending earnings (from confirmed but not completed bookings)
    const pendingEarnings = bookings
      .filter(booking => booking.status === "confirmed" || booking.status === "active")
      .reduce((sum, booking) => sum + booking.ownerPayout, 0);
    
    return {
      monthly: monthlyEarnings,
      yearly: yearlyEarnings,
      pending: pendingEarnings
    };
  },
  
  // Format date for dashboard display
  formatDashboardDate: (dateString: Date | string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }
};

// Type definitions for the owner dashboard
export interface DashboardSummary {
  activeListings: number;
  pendingBookings: number;
  totalEarnings: number;
  pendingEarnings: number;
  recentBookings: Booking[];
  notifications: Notification[];
}

export interface Notification {
  id: number;
  type: "booking" | "system" | "review";
  message: string;
  time: string;
  read: boolean;
} 