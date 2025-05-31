"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Check, Clock, MapPin, MessageSquare, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RouteProtection } from "@/components/route-protection"

// Mock data for bookings
const bookings = [
  {
    id: 1,
    car: {
      make: "Renault",
      model: "Clio",
      year: 2020,
      image: "/placeholder.svg"
    },
    renter: {
      id: 101,
      name: "Ahmed Bensouda",
      avatar: "/placeholder.svg",
      rating: 4.8,
      reviews: 12
    },
    startDate: "2023-05-15",
    endDate: "2023-05-18",
    status: "completed",
    location: "Casablanca, Morocco",
    totalPrice: 105,
    isPaid: true,
  },
  {
    id: 2,
    car: {
      make: "Peugeot",
      model: "3008",
      year: 2021,
      image: "/placeholder.svg"
    },
    renter: {
      id: 102,
      name: "Laila Chraibi",
      avatar: "/placeholder.svg",
      rating: 4.9,
      reviews: 8
    },
    startDate: "2023-05-22",
    endDate: "2023-05-25",
    status: "confirmed",
    location: "Rabat, Morocco",
    totalPrice: 195,
    isPaid: true,
  },
  {
    id: 3,
    car: {
      make: "BMW",
      model: "Série 3",
      year: 2022,
      image: "/placeholder.svg"
    },
    renter: {
      id: 103,
      name: "Karim Tahiri",
      avatar: "/placeholder.svg",
      rating: 4.7,
      reviews: 5
    },
    startDate: "2023-06-01",
    endDate: "2023-06-05",
    status: "pending",
    location: "Marrakech, Morocco",
    totalPrice: 340,
    isPaid: false,
  },
  {
    id: 4,
    car: {
      make: "Volkswagen",
      model: "Golf",
      year: 2019,
      image: "/placeholder.svg"
    },
    renter: {
      id: 104,
      name: "Yasmine Alaoui",
      avatar: "/placeholder.svg",
      rating: 4.6,
      reviews: 3
    },
    startDate: "2023-06-10",
    endDate: "2023-06-12",
    status: "pending",
    location: "Tangier, Morocco",
    totalPrice: 90,
    isPaid: false,
  },
  {
    id: 5,
    car: {
      make: "Dacia",
      model: "Duster",
      year: 2021,
      image: "/placeholder.svg"
    },
    renter: {
      id: 105,
      name: "Omar Benali",
      avatar: "/placeholder.svg",
      rating: 5.0,
      reviews: 2
    },
    startDate: "2023-06-20",
    endDate: "2023-06-25",
    status: "pending",
    location: "Agadir, Morocco",
    totalPrice: 225,
    isPaid: false,
  },
]

export default function OwnerBookingsPage() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [openDialog, setOpenDialog] = useState<string | null>(null)

  // Filter bookings based on selected tab
  const filteredBookings =
    selectedTab === "all" ? bookings : bookings.filter((booking) => booking.status === selectedTab)

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">En attente</Badge>
      case "confirmed":
        return <Badge className="bg-red-600">Confirmée</Badge>
      case "active":
        return <Badge className="bg-green-600">En cours</Badge>
      case "completed":
        return <Badge className="bg-gray-600">Terminée</Badge>
      case "cancelled":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Annulée
          </Badge>
        )
      default:
        return <Badge>Inconnue</Badge>
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }
    return new Date(dateString).toLocaleDateString("fr-FR", options)
  }

  return (
    <RouteProtection requiredRoles={["owner", "admin", "superadmin"]}>
      <div className="container py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Réservations reçues</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Gérez les réservations pour vos véhicules</p>

          <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
            <TabsList className="grid grid-cols-6 mb-8">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmées</TabsTrigger>
              <TabsTrigger value="active">En cours</TabsTrigger>
              <TabsTrigger value="completed">Terminées</TabsTrigger>
              <TabsTrigger value="cancelled">Annulées</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab}>
              {filteredBookings.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Aucune réservation {selectedTab !== "all" && `"${selectedTab}"`} trouvée.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {filteredBookings.map((booking) => (
                    <Card key={booking.id} className="overflow-hidden">
                      <div className="md:flex">
                        <div className="md:w-1/3 relative h-48 md:h-auto">
                          <Image
                            src={booking.car.image || "/placeholder.svg"}
                            alt={`${booking.car.make} ${booking.car.model}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="md:w-2/3 p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h2 className="text-xl font-bold">
                                {booking.car.make} {booking.car.model} ({booking.car.year})
                              </h2>
                              <div className="flex items-center mt-1 text-gray-500 dark:text-gray-400">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span className="text-sm">{booking.location}</span>
                              </div>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center">
                              <Calendar className="h-5 w-5 text-red-600 mr-2" />
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Période de location</p>
                                <p className="font-medium">
                                  {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <Clock className="h-5 w-5 text-red-600 mr-2" />
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Durée</p>
                                <p className="font-medium">
                                  {Math.ceil(
                                    (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) /
                                      (1000 * 60 * 60 * 24),
                                  )}{" "}
                                  jours
                                </p>
                              </div>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div className="flex flex-wrap justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full overflow-hidden relative mr-3">
                                <Image
                                  src={booking.renter.avatar || "/placeholder.svg"}
                                  alt={booking.renter.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Locataire</p>
                                <div className="flex items-center">
                                  <p className="font-medium mr-2">{booking.renter.name}</p>
                                  <div className="flex items-center text-sm">
                                    <span className="text-yellow-500 mr-1">★</span>
                                    <span>{booking.renter.rating}</span>
                                    <span className="text-gray-400 ml-1">({booking.renter.reviews})</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 md:mt-0">
                              <p className="text-sm text-gray-500 dark:text-gray-400">Prix total</p>
                              <p className="text-xl font-bold text-red-600">{booking.totalPrice} €</p>
                            </div>

                            <div className="w-full md:w-auto mt-4 md:mt-0 flex space-x-2">
                              <Button
                                asChild
                                variant="outline"
                                className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                              >
                                <Link href={`/messages/${booking.renter.id}`}>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Message
                                </Link>
                              </Button>

                              {booking.status === "pending" && (
                                <>
                                  <Dialog
                                    open={openDialog === `${booking.id}`}
                                    onOpenChange={(open) => setOpenDialog(open ? `${booking.id}` : null)}
                                  >
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                                      >
                                        <X className="h-4 w-4 mr-2" />
                                        Refuser
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Refuser la réservation</DialogTitle>
                                        <DialogDescription>
                                          Êtes-vous sûr de vouloir refuser cette réservation ? Cette action est
                                          irréversible.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <DialogFooter>
                                        <Button variant="outline" onClick={() => setOpenDialog(null)}>
                                          Annuler
                                        </Button>
                                        <Button variant="destructive">Confirmer le refus</Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>

                                  <Button className="bg-red-600 hover:bg-red-700">
                                    <Check className="h-4 w-4 mr-2" />
                                    Accepter
                                  </Button>
                                </>
                              )}

                              {booking.status === "confirmed" && (
                                <Button asChild className="bg-red-600 hover:bg-red-700">
                                  <Link href={`/owner/bookings/${booking.id}`}>Détails</Link>
                                </Button>
                              )}

                              {booking.status === "active" && (
                                <Button asChild className="bg-red-600 hover:bg-red-700">
                                  <Link href={`/owner/bookings/${booking.id}`}>Gérer</Link>
                                </Button>
                              )}

                              {booking.status === "completed" && (
                                <Button asChild className="bg-red-600 hover:bg-red-700">
                                  <Link href={`/owner/bookings/${booking.id}`}>Voir le récapitulatif</Link>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RouteProtection>
  )
}
