"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, MessageSquare, LogIn } from "lucide-react"
import { bookingService } from "@/lib/api"
import { useRealApi } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

// Mock data for development
const mockReservations = [
  {
    id: "res-001",
    status: "upcoming",
    car: {
      id: "car-001",
      make: "Renault",
      model: "Clio",
      year: 2020,
      image: "/placeholder.svg?height=200&width=300",
      price: 45,
      rating: 4.8,
    },
    owner: {
      id: "owner-001",
      name: "Jean Dupont",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    startDate: "2023-06-15",
    endDate: "2023-06-18",
    location: "Paris, France",
    totalPrice: 135,
  },
  {
    id: "res-002",
    status: "active",
    car: {
      id: "car-002",
      make: "Peugeot",
      model: "208",
      year: 2021,
      image: "/placeholder.svg?height=200&width=300",
      price: 50,
      rating: 4.6,
    },
    owner: {
      id: "owner-002",
      name: "Marie Martin",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    startDate: "2023-05-10",
    endDate: "2023-05-15",
    location: "Lyon, France",
    totalPrice: 250,
  },
  {
    id: "res-003",
    status: "completed",
    car: {
      id: "car-003",
      make: "Citroën",
      model: "C3",
      year: 2019,
      image: "/placeholder.svg?height=200&width=300",
      price: 40,
      rating: 4.5,
    },
    owner: {
      id: "owner-003",
      name: "Pierre Durand",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    startDate: "2023-04-05",
    endDate: "2023-04-08",
    location: "Marseille, France",
    totalPrice: 120,
  },
  {
    id: "res-004",
    status: "cancelled",
    car: {
      id: "car-004",
      make: "Volkswagen",
      model: "Golf",
      year: 2020,
      image: "/placeholder.svg?height=200&width=300",
      price: 55,
      rating: 4.7,
    },
    owner: {
      id: "owner-004",
      name: "Sophie Petit",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    startDate: "2023-03-20",
    endDate: "2023-03-25",
    location: "Bordeaux, France",
    totalPrice: 275,
  },
]

// Define proper types for the booking data
interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  image: string;
  price: number;
  rating: number;
}

interface Owner {
  id: string;
  name: string;
  avatar: string;
}

interface Reservation {
  id: string;
  status: string;
  car: Car;
  owner: Owner;
  startDate: string;
  endDate: string;
  location: string;
  totalPrice: number;
}

// Convert API booking to UI booking format
const convertApiBookingToUI = (apiBooking: any): Reservation => {
  return {
    id: apiBooking.id.toString(),
    status: apiBooking.status === 'confirmed' ? 'upcoming' : 
            apiBooking.status === 'active' ? 'active' : 
            apiBooking.status === 'completed' ? 'completed' : 
            apiBooking.status === 'cancelled' ? 'cancelled' : 'pending',
    car: {
      id: apiBooking.car?.id?.toString() || '',
      make: apiBooking.car?.make || '',
      model: apiBooking.car?.model || '',
      year: apiBooking.car?.year || new Date().getFullYear(),
      image: apiBooking.car?.images ? JSON.parse(apiBooking.car.images)[0] : '/placeholder.svg',
      price: apiBooking.car?.price_per_day || 0,
      rating: apiBooking.car?.rating || 4.5,
    },
    owner: {
      id: apiBooking.car?.owner?.id?.toString() || '',
      name: apiBooking.car?.owner?.name || 'Propriétaire',
      avatar: apiBooking.car?.owner?.avatar || '/placeholder.svg',
    },
    startDate: apiBooking.startDate || apiBooking.start_date,
    endDate: apiBooking.endDate || apiBooking.end_date,
    location: apiBooking.car?.location || 'Non spécifié',
    totalPrice: apiBooking.totalPrice || apiBooking.total_price || 0,
  };
};

export default function ReservationsPage() {
  const { user, status, isAuthenticated } = useAuth()
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState("all")
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Debug function to examine auth token
  const debugAuthToken = () => {
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        console.log("Auth token exists:", !!token);
        if (token) {
          console.log("Token first 20 chars:", token.substring(0, 20) + "...");
        }
      }
    } catch (e) {
      console.error("Error checking token:", e);
    }
  };
  
  // Fetch reservations data
  useEffect(() => {
    const fetchReservations = async () => {
      // Don't try to fetch if not authenticated
      if (!isAuthenticated) {
        console.log("User not authenticated, showing mock data")
        if (useRealApi()) {
          setError("Vous devez être connecté pour voir vos réservations")
        } else {
          // In development mode without API, show mock data
          setReservations(mockReservations)
        }
        return
      }
      
      setIsLoading(true)
      setError("")
      
      try {
        console.log("Using real API:", useRealApi()) 
        console.log("Auth status:", status)
        console.log("Is authenticated:", isAuthenticated)
        
        // Debug auth token
        debugAuthToken();
        
        if (useRealApi()) {
          // In production or when env var is set, use the actual API
          // Try with direct fetch for debugging
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            });
            console.log("Direct fetch response status:", response.status);
            if (!response.ok) {
              const errorText = await response.text();
              console.error("API response error:", errorText);
              throw new Error(`API Error: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            console.log("Direct fetch data:", data);
          } catch (fetchErr) {
            console.error("Direct fetch error:", fetchErr);
          }
          
          // Now try with the service
          const apiBookings = await bookingService.getBookings()
          console.log("API bookings:", apiBookings)
          
          // Convert API response to UI format
          const formattedBookings = apiBookings.map(booking => 
            convertApiBookingToUI(booking)
          )
          setReservations(formattedBookings)
        } else {
          // For development, use the mock data
          setReservations(mockReservations)
          // Simulate network latency
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      } catch (err) {
        console.error("Error fetching reservations:", err)
        setError("Impossible de charger vos réservations. Veuillez réessayer ou vous reconnecter.")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchReservations()
  }, [status, isAuthenticated])

  // Filter reservations based on selected tab
  const filteredReservations =
    selectedTab === "all" ? reservations : reservations.filter((res) => res.status === selectedTab)

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-red-600">À venir</Badge>
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
    const options: Intl.DateTimeFormatOptions = { 
      day: "numeric", 
      month: "long", 
      year: "numeric" 
    }
    return new Date(dateString).toLocaleDateString("fr-FR", options)
  }

  if (useRealApi() && !isAuthenticated) {
    return (
      <div className="container py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Mes réservations</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Consultez et gérez toutes vos réservations de véhicules</p>
          
          <Card>
            <CardContent className="pt-6 text-center flex flex-col items-center justify-center py-12">
              <LogIn className="h-12 w-12 text-red-600 mb-4" />
              <h2 className="text-xl font-bold mb-2">Connexion requise</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Vous devez être connecté pour voir vos réservations.
              </p>
              <div className="flex gap-4">
                <Button asChild variant="outline">
                  <Link href="/login">Se connecter</Link>
                </Button>
                <Button asChild className="bg-red-600 hover:bg-red-700">
                  <Link href="/register">Créer un compte</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Mes réservations</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Consultez et gérez toutes vos réservations de véhicules</p>

        {isLoading ? (
          <div className="text-center py-8">Chargement des réservations...</div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            {useRealApi() && (
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/login">Se connecter</Link>
              </Button>
            )}
          </div>
        ) : (
          <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="upcoming">À venir</TabsTrigger>
              <TabsTrigger value="active">En cours</TabsTrigger>
              <TabsTrigger value="completed">Terminées</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab}>
              {filteredReservations.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Aucune réservation {selectedTab !== "all" && `"${selectedTab}"`} trouvée.
                    </p>
                    <Button asChild className="bg-red-600 hover:bg-red-700">
                      <Link href="/search">Rechercher un véhicule</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {filteredReservations.map((reservation) => (
                    <Card key={reservation.id} className="overflow-hidden">
                      <div className="md:flex">
                        <div className="md:w-1/3 relative h-48 md:h-auto">
                          <Image
                            src={reservation.car.image || "/placeholder.svg"}
                            alt={`${reservation.car.make} ${reservation.car.model}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="md:w-2/3 p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h2 className="text-xl font-bold">
                                {reservation.car.make} {reservation.car.model} ({reservation.car.year})
                              </h2>
                              <div className="flex items-center mt-1 text-gray-500 dark:text-gray-400">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span className="text-sm">{reservation.location}</span>
                              </div>
                            </div>
                            {getStatusBadge(reservation.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center">
                              <Calendar className="h-5 w-5 text-red-600 mr-2" />
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Période de location</p>
                                <p className="font-medium">
                                  {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <Clock className="h-5 w-5 text-red-600 mr-2" />
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Durée</p>
                                <p className="font-medium">
                                  {Math.ceil(
                                    (new Date(reservation.endDate).getTime() -
                                      new Date(reservation.startDate).getTime()) /
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
                                  src={reservation.owner.avatar || "/placeholder.svg"}
                                  alt={reservation.owner.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Propriétaire</p>
                                <p className="font-medium">{reservation.owner.name}</p>
                              </div>
                            </div>

                            <div className="mt-4 md:mt-0">
                              <p className="text-sm text-gray-500 dark:text-gray-400">Prix total</p>
                              <p className="text-xl font-bold text-red-600">{reservation.totalPrice} €</p>
                            </div>

                            <div className="w-full md:w-auto mt-4 md:mt-0 flex space-x-2">
                              <Button
                                asChild
                                variant="outline"
                                className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                              >
                                <Link href={`/messages/${reservation.owner.id}`}>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Message
                                </Link>
                              </Button>
                              <Button asChild className="bg-red-600 hover:bg-red-700">
                                <Link href={`/reservations/${reservation.id}`}>Détails</Link>
                              </Button>
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
        )}
      </div>
    </div>
  )
}
