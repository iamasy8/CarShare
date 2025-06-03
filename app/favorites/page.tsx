"use client"

import { 
  Dialog,
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heart, Search, Star, MoreVertical, MapPin, Calendar, Car as CarIcon, Trash2, Loader2 } from "lucide-react"
import { CarContactButton } from "@/components/car-contact-button"
import { RouteProtection } from "@/components/route-protection"
import { carService, type Car } from "@/lib/api/cars/carService"
import { useRealApi } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { parseCarFeatures } from "@/lib/utils"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

// Interface for the UI favorite format
interface Favorite {
  id: number;
  title: string;
  type: string;
  price: number;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  available: boolean;
  addedDate: string;
  features?: string[];
}

// Extended Car interface to match the backend API response
interface ApiCar {
  id: number;
  title: string;
  make: string;
  model: string;
  year: number;
  type: string;
  price: number;
  price_per_day?: number;
  location: string;
  seats: number;
  doors: number;
  fuel: string;
  transmission: string;
  description: string;
  features: string[] | string;
  images: string[] | string;
  availableFrom?: Date | string;
  availableTo?: Date | string;
  ownerId: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date | string;
  updatedAt: Date | string;
  rating?: number;
  reviews_count?: number;
  is_available?: boolean;
  created_at?: string;
  [key: string]: any; // Allow for any additional properties from the API
}

// Mock data for development
const mockFavorites: Favorite[] = [
  {
    id: 1,
    title: "Renault Clio",
    type: "Citadine",
    price: 35,
    location: "Paris, France",
    rating: 4.8,
    reviews: 24,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
    addedDate: "10/04/2023",
  },
  {
    id: 2,
    title: "Peugeot 3008",
    type: "SUV",
    price: 65,
    location: "Lyon, France",
    rating: 4.6,
    reviews: 18,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
    addedDate: "05/04/2023",
  },
  {
    id: 3,
    title: "BMW Série 3",
    type: "Berline",
    price: 85,
    location: "Marseille, France",
    rating: 4.9,
    reviews: 32,
    image: "/placeholder.svg?height=200&width=300",
    available: false,
    addedDate: "01/04/2023",
  },
  {
    id: 4,
    title: "Audi A1",
    type: "Citadine",
    price: 45,
    location: "Bordeaux, France",
    rating: 4.7,
    reviews: 15,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
    addedDate: "28/03/2023",
  },
]

// Convert API car to UI favorite format
const convertApiCarToFavorite = (car: ApiCar): Favorite => {
  return {
    id: car.id,
    title: `${car.make} ${car.model}`,
    type: car.type || "Véhicule",
    price: car.price_per_day || car.price || 0,
    location: car.location || "Non spécifié",
    rating: car.rating || 4.5,
    reviews: car.reviews_count || 0,
    image: car.images && car.images.length > 0 ? 
      (typeof car.images === 'string' ? JSON.parse(car.images)[0] : car.images[0]) 
      : "/placeholder.svg",
    available: car.is_available !== false,
    addedDate: new Date(car.created_at || car.createdAt || Date.now()).toLocaleDateString('fr-FR'),
    features: parseCarFeatures(car.features),
  };
};

export default function FavoritesPage() {
  const { isAuthenticated, status } = useAuth()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [favoriteToRemove, setFavoriteToRemove] = useState<number | null>(null)
  
  // Fetch favorites using React Query
  const { 
    data: favoriteCars = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => carService.getFavoriteCars(),
    enabled: useRealApi() && isAuthenticated,
  })
  
  // Convert API cars to UI favorites format
  const [userFavorites, setUserFavorites] = useState<Favorite[]>([])
  
  useEffect(() => {
    console.log("useRealApi:", useRealApi())
    console.log("isAuthenticated:", isAuthenticated)
    console.log("favoriteCars:", favoriteCars)
    
    if (useRealApi() && isAuthenticated) {
      if (Array.isArray(favoriteCars) && favoriteCars.length > 0) {
        // Use real API data
        const formattedFavorites = favoriteCars.map(car => convertApiCarToFavorite(car as ApiCar))
        console.log("Formatted favorites:", formattedFavorites)
        setUserFavorites(formattedFavorites)
      } else {
        // Empty array for when user has no favorites
        setUserFavorites([])
      }
    } else {
      // Only use mock data when not using real API
      setUserFavorites(mockFavorites)
    }
  }, [favoriteCars, isAuthenticated])

  const filteredFavorites = userFavorites.filter(
    (favorite) =>
      favorite.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      favorite.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      favorite.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleRemoveFavorite = (id: number) => {
    setFavoriteToRemove(id)
    setShowConfirmDialog(true)
  }

  const confirmRemoveFavorite = async () => {
    if (favoriteToRemove !== null) {
      setShowConfirmDialog(false)
      
      if (useRealApi() && isAuthenticated) {
        try {
          // Call the API to remove from favorites
          await carService.removeFromFavorites(favoriteToRemove)
          // Invalidate the favorites query to refresh the data
          queryClient.invalidateQueries({ queryKey: ['favorites'] })
          // Also invalidate the specific car favorite status
          queryClient.setQueryData(['favorite', favoriteToRemove], false)
          toast.success("Véhicule retiré des favoris")
        } catch (err) {
          console.error("Error removing from favorites:", err)
          toast.error("Impossible de retirer des favoris")
        }
      } else {
        // Just update state for mock data
        setUserFavorites(userFavorites.filter((favorite) => favorite.id !== favoriteToRemove))
      }
      
      setFavoriteToRemove(null)
    }
  }

  return (
    <RouteProtection>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold">Mes favoris</h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Retrouvez les véhicules que vous avez ajoutés à vos favoris
                </p>
              </div>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher dans vos favoris..."
                  className="pl-9 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
                <span className="ml-2">Chargement de vos favoris...</span>
              </div>
            ) : isError ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border">
                <Heart className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Erreur lors du chargement des favoris</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {error?.message || "Une erreur s'est produite lors du chargement de vos favoris."}
                </p>
                <Button 
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['favorites'] })}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Réessayer
                </Button>
              </div>
            ) : filteredFavorites.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {filteredFavorites.map((favorite) => (
                  <Card key={favorite.id} className="overflow-hidden flex flex-col">
                    <div className="relative">
                      <img
                        src={favorite.image || "/placeholder.svg"}
                        alt={favorite.title}
                        className="w-full aspect-[4/3] object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600"
                        onClick={() => handleRemoveFavorite(favorite.id)}
                      >
                        <Heart className="h-5 w-5 fill-current" />
                      </Button>
                      {!favorite.available && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge className="bg-red-600 text-white px-3 py-1.5 text-sm font-medium">Non disponible</Badge>
                        </div>
                      )}
                    </div>

                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{favorite.title}</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/cars/${favorite.id}`}>Voir les détails</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRemoveFavorite(favorite.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Retirer des favoris
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-2 flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{favorite.type}</p>
                          <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="h-4 w-4 mr-1" />
                            {favorite.location}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {favorite.price}€
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/jour</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center mt-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="ml-1 text-sm font-medium">{favorite.rating}</span>
                        </div>
                        <span className="mx-1.5 text-gray-500 dark:text-gray-400 text-sm">•</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{favorite.reviews} avis</span>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-4 pb-4">
                      <div className="w-full flex flex-col gap-3">
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Ajouté le {favorite.addedDate}
                        </div>
                        <div className="flex gap-2 w-full">
                          <Button asChild size="sm" variant="outline" className="flex-1 whitespace-nowrap">
                            <Link href={`/cars/${favorite.id}`}>Voir détails</Link>
                          </Button>
                          <CarContactButton
                            carId={favorite.id}
                            carTitle={favorite.title}
                            ownerId={101} // Mock owner ID
                            ownerName="Propriétaire"
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 flex-1 whitespace-nowrap"
                          />
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border">
                <Heart className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun favori trouvé</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchQuery
                    ? "Aucun résultat ne correspond à votre recherche."
                    : "Vous n'avez pas encore ajouté de véhicules à vos favoris."}
                </p>
                <Button asChild className="bg-red-600 hover:bg-red-700">
                  <Link href="/search">
                    <CarIcon className="h-4 w-4 mr-2" />
                    Découvrir des véhicules
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <Dialog open={showConfirmDialog} onOpenChange={(open) => setShowConfirmDialog(open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer des favoris</DialogTitle>
              <DialogDescription>Êtes-vous sûr de vouloir supprimer ce véhicule de vos favoris ?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={confirmRemoveFavorite}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RouteProtection>
  )
}
