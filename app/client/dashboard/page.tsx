"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Search, 
  Calendar, 
  Clock, 
  Heart, 
  Car, 
  MessageSquare,
  TrendingUp
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

export default function ClientDashboard() {
  const { user } = useAuth()

  // Mock data
  const stats = {
    upcomingBookings: 1,
    pastBookings: 5,
    savedCars: 3,
    unreadMessages: 1
  }

  // Mock data for upcoming booking
  const upcomingBooking = {
    id: 1,
    carName: "Renault Clio",
    ownerName: "Thomas Dubois",
    startDate: "2023-05-19T00:00:00.000Z",
    endDate: "2023-05-22T00:00:00.000Z",
    price: "350€",
    location: "Casablanca, Morocco",
    status: "confirmé"
  }

  // Mock recommended cars with standardized structure
  const recommendedCars = [
    {
      id: 1,
      name: "Peugeot 3008",
      make: "Peugeot",
      model: "3008",
      type: "SUV",
      pricePerDay: 65,
      location: "Casablanca",
      rating: 4.8,
      year: 2021,
      features: ["Climatisation", "GPS", "Bluetooth"],
      image: "/placeholder.svg?height=100&width=150"
    },
    {
      id: 2,
      name: "Renault Captur",
      make: "Renault",
      model: "Captur",
      type: "Crossover",
      pricePerDay: 45,
      location: "Casablanca",
      rating: 4.6,
      year: 2022,
      features: ["Climatisation", "Bluetooth", "Camera de recul"],
      image: "/placeholder.svg?height=100&width=150"
    },
    {
      id: 3,
      name: "Citroën C3",
      make: "Citroën",
      model: "C3",
      type: "Citadine",
      pricePerDay: 35,
      location: "Casablanca",
      rating: 4.7,
      year: 2020,
      features: ["Climatisation", "USB", "Bluetooth"],
      image: "/placeholder.svg?height=100&width=150"
    }
  ]

  // Mock data for client dashboard
  const recentBookings = [
    {
      id: 1,
      car: "Renault Clio",
      owner: "Martin Durand",
      startDate: "2023-05-15T00:00:00.000Z",
      endDate: "2023-05-18T00:00:00.000Z",
      status: "completed",
      location: "Casablanca, Morocco",
      price: 105,
    },
    // ... more bookings data
  ]

  const popularCars = [
    {
      id: 1,
      title: "Peugeot 208",
      price: 35,
      location: "Casablanca",
      image: "/placeholder.svg?height=100&width=150",
      available: true,
    },
    {
      id: 2,
      title: "Renault Captur",
      price: 45,
      location: "Casablanca",
      image: "/placeholder.svg?height=100&width=150",
      available: false,
    },
    {
      id: 3,
      title: "Citroën C3",
      price: 32,
      location: "Casablanca",
      image: "/placeholder.svg?height=100&width=150",
      available: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Bienvenue, {user?.name || "Client"}! Voici un résumé de votre activité.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations à venir</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
            <p className="text-xs text-gray-500">
              {stats.upcomingBookings > 0 ? "Votre prochaine réservation est le 19 mai" : "Aucune réservation à venir"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations passées</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pastBookings}</div>
            <p className="text-xs text-gray-500">
              {stats.pastBookings > 0 ? "Vous avez effectué 5 réservations" : "Aucune réservation passée"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Véhicules favoris</CardTitle>
            <Heart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.savedCars}</div>
            <p className="text-xs text-gray-500">
              {stats.savedCars > 0 ? `${stats.savedCars} véhicules enregistrés` : "Aucun favori"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
            <p className="text-xs text-gray-500">
              {stats.unreadMessages > 0 ? `${stats.unreadMessages} message non lu` : "Aucun message non lu"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {stats.upcomingBookings > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Prochaine réservation</CardTitle>
              <CardDescription>
                Détails de votre réservation à venir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-24 h-24 relative rounded-lg overflow-hidden bg-gray-200">
                  <img 
                    src="/placeholder.svg?height=100&width=100" 
                    alt={upcomingBooking.carName}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{upcomingBooking.carName}</h3>
                  <p className="text-sm text-gray-500">
                    Réservation {upcomingBooking.status}
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                      Du {formatDate(upcomingBooking.startDate, 'long')} au {formatDate(upcomingBooking.endDate, 'long')}
                    </p>
                    <p className="text-sm flex items-center">
                      <Car className="mr-2 h-4 w-4 text-gray-500" />
                      De {upcomingBooking.ownerName}
                    </p>
                  </div>
                  <div className="mt-4">
                    <Button asChild className="bg-red-600 hover:bg-red-700">
                      <Link href={`/reservations/${upcomingBooking.id}`}>
                        Voir les détails
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Trouvez votre prochaine voiture</CardTitle>
              <CardDescription>
                Commencez une nouvelle réservation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6">
                <Search className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4 text-center">
                  Vous n'avez pas de réservation à venir. Trouvez la voiture parfaite pour votre prochain trajet.
                </p>
                <Button asChild className="bg-red-600 hover:bg-red-700">
                  <Link href="/search">
                    Rechercher une voiture
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Véhicules recommandés</CardTitle>
            <CardDescription>
              Basé sur vos préférences et votre historique
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedCars.map((car) => (
                <Link 
                  key={car.id} 
                  href={`/cars/${car.id}`} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={car.image} 
                      alt={car.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{car.name}</h4>
                    <p className="text-xs text-gray-500">{car.type} · {car.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{car.pricePerDay}€ <span className="text-xs font-normal text-gray-500">/jour</span></p>
                    <p className="text-xs text-gray-500 flex justify-end items-center">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      Populaire
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 