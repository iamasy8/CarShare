"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car as CarIcon, MapPin, Star, Heart, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import FavoriteButton from "@/components/favorite-button"
import { carService } from "@/lib/api/cars/carService"
import { useQuery } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Car } from "@/lib/api/cars/carService"
import { sanitizeImageUrl } from "@/lib/utils"

export default function ClientFavorites() {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()

  // Fetch favorite cars using React Query
  const { data: favorites = [], isLoading, refetch } = useQuery({
    queryKey: ['favoriteCars'],
    queryFn: async () => {
      try {
        return await carService.getFavoriteCars();
      } catch (error) {
        console.error('Error fetching favorite cars:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger vos voitures favorites.',
          variant: 'destructive'
        });
        return [];
      }
    },
    enabled: isAuthenticated
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mes favoris</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Consultez et gérez vos véhicules favoris
        </p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center justify-center py-6">
              <p className="text-gray-500 mb-4">
                Chargement de vos favoris...
              </p>
            </div>
          </CardContent>
        </Card>
      ) : favorites.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((car) => (
            <Card key={car.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <img 
                  src={car.images && car.images.length > 0 ? sanitizeImageUrl(car.images[0]) : "/placeholder.svg"} 
                  alt={`${car.make} ${car.model}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <FavoriteButton
                    carId={car.id}
                    className="bg-white/80 shadow-sm hover:bg-white/90 h-9 w-9 flex items-center justify-center border rounded-md"
                    iconClassName="h-5 w-5"
                  />
                </div>
                {car.status !== 'approved' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge className="bg-black/80 text-white text-sm px-3 py-1">
                      Non disponible
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{car.make} {car.model}</h3>
                  <div className="flex items-center text-amber-500">
                    <Star className="fill-current h-4 w-4 mr-1" />
                    <span className="text-sm">{car.year}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {car.type} • {car.owner ? `De ${car.owner.name}` : ''}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  {car.location}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold">{car.price}€</span>
                    <span className="text-gray-500 text-sm"> / jour</span>
                  </div>
                  <Button asChild size="sm" className={car.status === 'approved' ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"} disabled={car.status !== 'approved'}>
                    <Link href={car.status === 'approved' ? `/cars/${car.id}` : "#"}>
                      {car.status === 'approved' ? "Réserver" : "Indisponible"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center justify-center py-6">
              <Heart className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">
                Vous n'avez pas encore de véhicules favoris.
              </p>
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/search">
                  Rechercher des voitures
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 