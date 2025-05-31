"use client"

import { 
  Dialog,
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heart, Search, Star, MoreVertical, MapPin, Calendar, Car, Trash2 } from "lucide-react"
import { CarContactButton } from "@/components/car-contact-button"
import { RouteProtection } from "@/components/route-protection"

// Mock data for favorites
const favorites = [
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

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [userFavorites, setUserFavorites] = useState(favorites)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [favoriteToRemove, setFavoriteToRemove] = useState<number | null>(null)

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

  const confirmRemoveFavorite = () => {
    if (favoriteToRemove !== null) {
      setUserFavorites(userFavorites.filter((favorite) => favorite.id !== favoriteToRemove))
      setShowConfirmDialog(false)
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

            {filteredFavorites.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredFavorites.map((favorite) => (
                  <Card key={favorite.id} className="overflow-hidden">
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

                    <CardContent className="pb-2">
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

                    <CardFooter className="pt-2">
                      <div className="w-full flex justify-between items-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Ajouté le {favorite.addedDate}
                        </div>
                        <div className="flex gap-2">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/cars/${favorite.id}`}>Voir détails</Link>
                          </Button>
                          <CarContactButton
                            carId={favorite.id}
                            carTitle={favorite.title}
                            ownerId={101} // Mock owner ID
                            ownerName="Propriétaire"
                            size="sm"
                            className="bg-red-600 hover:bg-red-700"
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
                    <Car className="h-4 w-4 mr-2" />
                    Découvrir des véhicules
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <Dialog open={showConfirmDialog} onOpenChange={(open: boolean) => setShowConfirmDialog(open)}>
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
