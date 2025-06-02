"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { carService } from "@/lib/api/cars/carService"

interface FavoriteButtonProps {
  carId: number
  className?: string
  iconClassName?: string
  fillOnFavorite?: boolean
  onFavoriteChange?: (isFavorited: boolean) => void
}

export default function FavoriteButton({
  carId,
  className = "absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 text-foreground",
  iconClassName = "h-5 w-5",
  fillOnFavorite = true,
  onFavoriteChange
}: FavoriteButtonProps) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isProcessing, setIsProcessing] = useState(false)

  // Use React Query to check if car is favorited
  const { 
    data: isFavorited = false,
    isLoading
  } = useQuery({
    queryKey: ['favorite', carId],
    queryFn: () => carService.isFavorite(carId),
    enabled: isAuthenticated && !!carId,
    initialData: false,
  })

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isProcessing) return

    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des voitures à vos favoris.",
        variant: "destructive"
      })
      router.push("/login")
      return
    }

    setIsProcessing(true)

    try {
      if (isFavorited) {
        await carService.removeFromFavorites(carId)
        toast({
          title: "Retiré des favoris",
          description: "Cette voiture a été retirée de vos favoris."
        })
      } else {
        await carService.addToFavorites(carId)
        toast({
          title: "Ajouté aux favoris",
          description: "Cette voiture a été ajoutée à vos favoris."
        })
      }

      // Invalidate the favorite query to refetch the status
      queryClient.invalidateQueries({ queryKey: ['favorite', carId] })
      
      // Also invalidate the favorites list if it exists in the cache
      queryClient.invalidateQueries({ queryKey: ['favorites'] })

      // Notify parent component if callback is provided
      if (onFavoriteChange) {
        onFavoriteChange(!isFavorited)
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <button
      className={className}
      onClick={handleToggleFavorite}
      disabled={isLoading || isProcessing}
      aria-label={isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart 
        className={iconClassName} 
        fill={isFavorited && fillOnFavorite ? "currentColor" : "none"} 
      />
    </button>
  )
}
