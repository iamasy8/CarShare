"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, MapPin, Star, Heart } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function ClientFavorites() {
  const { user } = useAuth()

  // Mock favorites data
  const favorites = [
    {
      id: 1,
      name: "Renault Clio",
      type: "Citadine",
      pricePerDay: 40,
      location: "Casablanca",
      rating: 4.8,
      available: true,
      ownerName: "Thomas Dubois",
      image: "/placeholder.svg?height=100&width=150"
    },
    {
      id: 2,
      name: "Peugeot 3008",
      type: "SUV",
      pricePerDay: 65,
      location: "Casablanca",
      rating: 4.5,
      available: false,
      ownerName: "Sophie Martin",
      image: "/placeholder.svg?height=100&width=150"
    },
    {
      id: 3,
      name: "Volkswagen Golf",
      type: "Berline",
      pricePerDay: 55,
      location: "Casablanca",
      rating: 4.6,
      available: true,
      ownerName: "Jean Dupont",
      image: "/placeholder.svg?height=100&width=150"
    }
  ]

  const removeFavorite = (id: number) => {
    console.log("Removing from favorites:", id);
    // In a real app, this would call an API to remove the item
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mes favoris</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Consultez et gérez vos véhicules favoris
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((car) => (
            <Card key={car.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <img 
                  src={car.image} 
                  alt={car.name}
                  className="h-full w-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 text-red-600 shadow-sm hover:bg-white/90 hover:text-red-700"
                  onClick={() => removeFavorite(car.id)}
                >
                  <Heart className="h-5 w-5 fill-current" />
                </Button>
                {!car.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge className="bg-black/80 text-white text-sm px-3 py-1">
                      Non disponible
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{car.name}</h3>
                  <div className="flex items-center text-amber-500">
                    <Star className="fill-current h-4 w-4 mr-1" />
                    <span className="text-sm">{car.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {car.type} • De {car.ownerName}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  {car.location}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold">{car.pricePerDay}€</span>
                    <span className="text-gray-500 text-sm"> / jour</span>
                  </div>
                  <Button asChild size="sm" className={car.available ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"} disabled={!car.available}>
                    <Link href={car.available ? `/cars/${car.id}` : "#"}>
                      {car.available ? "Réserver" : "Indisponible"}
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