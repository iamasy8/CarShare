"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  bookingService, 
  type Booking, 
  type BookingCreateData, 
  type BookingStatusUpdateData,
  type BookingFilters
} from "@/lib/api/bookings/bookingService"
import { toast } from "sonner"

// Hook for fetching all bookings
export function useBookings(filters?: BookingFilters) {
  return useQuery({
    queryKey: ["bookings", filters],
    queryFn: () => bookingService.getBookings(filters),
  })
}

// Hook for fetching a single booking
export function useBooking(id: number) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingService.getBooking(id),
    enabled: !!id,
  })
}

// Hook for creating a booking
export function useCreateBooking() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: BookingCreateData) => bookingService.createBooking(data),
    onSuccess: (newBooking) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      queryClient.invalidateQueries({ queryKey: ["clientBookings"] })
      toast.success("Réservation créée avec succès")
      return newBooking
    },
    onError: (error) => {
      console.error("Failed to create booking:", error)
      toast.error("Impossible de créer la réservation")
    },
  })
}

// Hook for updating booking status
export function useUpdateBookingStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: BookingStatusUpdateData }) => 
      bookingService.updateBookingStatus(id, status),
    onSuccess: (updatedBooking) => {
      // Invalidate and update cache
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      queryClient.invalidateQueries({ queryKey: ["booking", updatedBooking.id] })
      queryClient.invalidateQueries({ queryKey: ["clientBookings"] })
      queryClient.invalidateQueries({ queryKey: ["ownerBookings"] })
      toast.success("Statut de réservation mis à jour")
    },
    onError: (error) => {
      console.error("Failed to update booking status:", error)
      toast.error("Impossible de mettre à jour le statut")
    },
  })
}

// Hook for canceling a booking (client)
export function useCancelBooking() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => 
      bookingService.cancelBooking(id, reason),
    onSuccess: (updatedBooking) => {
      // Invalidate and update cache
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      queryClient.invalidateQueries({ queryKey: ["booking", updatedBooking.id] })
      queryClient.invalidateQueries({ queryKey: ["clientBookings"] })
      toast.success("Réservation annulée")
    },
    onError: (error) => {
      console.error("Failed to cancel booking:", error)
      toast.error("Impossible d'annuler la réservation")
    },
  })
}

// Hook for confirming a booking (owner)
export function useConfirmBooking() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => bookingService.confirmBooking(id),
    onSuccess: (updatedBooking) => {
      // Invalidate and update cache
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      queryClient.invalidateQueries({ queryKey: ["booking", updatedBooking.id] })
      queryClient.invalidateQueries({ queryKey: ["ownerBookings"] })
      toast.success("Réservation confirmée")
    },
    onError: (error) => {
      console.error("Failed to confirm booking:", error)
      toast.error("Impossible de confirmer la réservation")
    },
  })
}

// Hook for rejecting a booking (owner)
export function useRejectBooking() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => 
      bookingService.rejectBooking(id, reason),
    onSuccess: (updatedBooking) => {
      // Invalidate and update cache
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      queryClient.invalidateQueries({ queryKey: ["booking", updatedBooking.id] })
      queryClient.invalidateQueries({ queryKey: ["ownerBookings"] })
      toast.success("Réservation refusée")
    },
    onError: (error) => {
      console.error("Failed to reject booking:", error)
      toast.error("Impossible de refuser la réservation")
    },
  })
}

// Hook for fetching client bookings
export function useClientBookings(filters?: BookingFilters) {
  return useQuery({
    queryKey: ["clientBookings", filters],
    queryFn: () => bookingService.getClientBookings(filters),
  })
}

// Hook for fetching owner bookings
export function useOwnerBookings(filters?: BookingFilters) {
  return useQuery({
    queryKey: ["ownerBookings", filters],
    queryFn: () => bookingService.getOwnerBookings(filters),
  })
} 