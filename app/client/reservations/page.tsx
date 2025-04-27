"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function ClientReservations() {
  const { user } = useAuth()

  // Mock reservations data
  const upcomingReservations = [
    {
      id: 1,
      carName: "Renault Clio",
      ownerName: "Thomas Dubois",
      startDate: "19 mai 2023",
      endDate: "22 mai 2023",
      price: "350€",
      location: "Casablanca, Morocco",
      status: "confirmé",
      image: "/placeholder.svg?height=100&width=150"
    }
  ]

  const pastReservations = [
    {
      id: 101,
      carName: "Peugeot 208",
      ownerName: "Sophie Martin",
      startDate: "10 avril 2023",
      endDate: "15 avril 2023",
      price: "320€",
      location: "Casablanca, Morocco",
      status: "terminé",
      rating: 4,
      image: "/placeholder.svg?height=100&width=150"
    },
    {
      id: 102,
      carName: "Citroën C3",
      ownerName: "Jean Dupont",
      startDate: "22 mars 2023",
      endDate: "25 mars 2023",
      price: "210€",
      location: "Casablanca, Morocco",
      status: "terminé",
      rating: 5,
      image: "/placeholder.svg?height=100&width=150"
    },
    {
      id: 103,
      carName: "Dacia Sandero",
      ownerName: "Marie Leroy",
      startDate: "5 février 2023",
      endDate: "8 février 2023",
      price: "180€",
      location: "Casablanca, Morocco",
      status: "terminé",
      rating: 4,
      image: "/placeholder.svg?height=100&width=150"
    }
  ]

  const cancelledReservations = [
    {
      id: 201,
      carName: "Ford Fiesta",
      ownerName: "Laurent Blanc",
      startDate: "15 mars 2023",
      endDate: "18 mars 2023",
      price: "240€",
      location: "Casablanca, Morocco",
      status: "annulé",
      cancelReason: "Changement de plans",
      image: "/placeholder.svg?height=100&width=150"
    }
  ]

  // Helper function to render a reservation card
  const renderReservationCard = (reservation: any) => (
    <Card key={reservation.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-24 h-24 relative rounded-lg overflow-hidden bg-gray-200">
            <img 
              src={reservation.image} 
              alt={reservation.carName}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">{reservation.carName}</h3>
              <Badge 
                className={`${
                  reservation.status === "confirmé" ? "bg-green-500" : 
                  reservation.status === "terminé" ? "bg-blue-500" : 
                  "bg-red-500"
                } text-white`}
              >
                {reservation.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              De {reservation.ownerName}
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-sm flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                Du {reservation.startDate} au {reservation.endDate}
              </p>
              <p className="text-sm flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                Prix total: {reservation.price}
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
                <Link href={`/reservations/${reservation.id}`}>
                  Voir les détails
                </Link>
              </Button>
              {reservation.status === "confirmé" && (
                <Button variant="outline" size="sm">
                  Contacter le propriétaire
                </Button>
              )}
              {reservation.status === "terminé" && !reservation.rating && (
                <Button variant="outline" size="sm">
                  Laisser un avis
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mes réservations</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Gérez vos réservations passées et à venir
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming" className="relative">
            À venir
            {upcomingReservations.length > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">
                {upcomingReservations.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="past">Passées</TabsTrigger>
          <TabsTrigger value="cancelled">Annulées</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingReservations.length > 0 ? (
            upcomingReservations.map(reservation => renderReservationCard(reservation))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center justify-center py-6">
                  <Calendar className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">
                    Vous n'avez pas de réservations à venir.
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
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {pastReservations.length > 0 ? (
            pastReservations.map(reservation => renderReservationCard(reservation))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center justify-center py-6">
                  <CheckCircle className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">
                    Vous n'avez pas de réservations passées.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="cancelled" className="space-y-4">
          {cancelledReservations.length > 0 ? (
            cancelledReservations.map(reservation => renderReservationCard(reservation))
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center justify-center py-6">
                  <XCircle className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">
                    Vous n'avez pas de réservations annulées.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 