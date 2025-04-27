"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { carService, type Car, type CarFilters } from "@/lib/api/cars/carService"
import { toast } from "sonner"

// Hook for fetching cars with filters
export function useCars(filters?: CarFilters) {
  return useQuery({
    queryKey: ["cars", filters],
    queryFn: () => carService.getCars(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for fetching a single car by ID
export function useCar(id: number) {
  return useQuery({
    queryKey: ["car", id],
    queryFn: () => carService.getCar(id),
    enabled: !!id,
  })
}

// Hook for fetching featured cars
export function useFeaturedCars(limit: number = 6) {
  return useQuery({
    queryKey: ["featuredCars", limit],
    queryFn: () => carService.getFeaturedCars(limit),
  })
}

// Hook for checking if a car is in user's favorites
export function useIsFavorite(carId: number) {
  return useQuery({
    queryKey: ["isFavorite", carId],
    queryFn: () => carService.isFavorite(carId),
    enabled: !!carId,
  })
}

// Hook for adding a car to favorites
export function useAddToFavorites() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (carId: number) => carService.addToFavorites(carId),
    onSuccess: (_, carId) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["isFavorite", carId] })
      queryClient.invalidateQueries({ queryKey: ["favorites"] })
      toast.success("Voiture ajoutée aux favoris")
    },
    onError: (error) => {
      console.error("Failed to add to favorites:", error)
      toast.error("Impossible d'ajouter aux favoris")
    },
  })
}

// Hook for removing a car from favorites
export function useRemoveFromFavorites() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (carId: number) => carService.removeFromFavorites(carId),
    onSuccess: (_, carId) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["isFavorite", carId] })
      queryClient.invalidateQueries({ queryKey: ["favorites"] })
      toast.success("Voiture retirée des favoris")
    },
    onError: (error) => {
      console.error("Failed to remove from favorites:", error)
      toast.error("Impossible de retirer des favoris")
    },
  })
}

// Hook for creating a new car listing
export function useCreateCar() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (formData: FormData) => carService.createCar(formData),
    onSuccess: () => {
      // Invalidate owner cars
      queryClient.invalidateQueries({ queryKey: ["ownerCars"] })
      toast.success("Voiture ajoutée avec succès")
    },
    onError: (error) => {
      console.error("Failed to create car:", error)
      toast.error("Impossible d'ajouter la voiture")
    },
  })
}

// Hook for updating a car
export function useUpdateCar() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => 
      carService.updateCar(id, formData),
    onSuccess: (updatedCar) => {
      // Invalidate specific car and owner cars
      queryClient.invalidateQueries({ queryKey: ["car", updatedCar.id] })
      queryClient.invalidateQueries({ queryKey: ["ownerCars"] })
      toast.success("Voiture mise à jour avec succès")
    },
    onError: (error) => {
      console.error("Failed to update car:", error)
      toast.error("Impossible de mettre à jour la voiture")
    },
  })
}

// Hook for deleting a car
export function useDeleteCar() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => carService.deleteCar(id),
    onSuccess: (_, id) => {
      // Invalidate owner cars and remove specific car from cache
      queryClient.invalidateQueries({ queryKey: ["ownerCars"] })
      queryClient.removeQueries({ queryKey: ["car", id] })
      toast.success("Voiture supprimée avec succès")
    },
    onError: (error) => {
      console.error("Failed to delete car:", error)
      toast.error("Impossible de supprimer la voiture")
    },
  })
}

// Hook for fetching owner's cars
export function useOwnerCars(status?: string) {
  return useQuery({
    queryKey: ["ownerCars", status],
    queryFn: () => carService.getOwnerCars(status),
  })
}

// Hook for calculating price
export function useCalculatePrice(carId: number, startDate?: Date, endDate?: Date) {
  return useQuery({
    queryKey: ["priceCalculation", carId, startDate, endDate],
    queryFn: () => {
      if (!startDate || !endDate) {
        throw new Error("Start and end dates are required")
      }
      return carService.calculatePrice(carId, startDate, endDate)
    },
    enabled: !!carId && !!startDate && !!endDate,
  })
}

// Hook for checking availability
export function useCheckAvailability(carId: number, startDate?: Date, endDate?: Date) {
  return useQuery({
    queryKey: ["availability", carId, startDate, endDate],
    queryFn: () => {
      if (!startDate || !endDate) {
        throw new Error("Start and end dates are required")
      }
      return carService.checkAvailability(carId, startDate, endDate)
    },
    enabled: !!carId && !!startDate && !!endDate,
  })
} 