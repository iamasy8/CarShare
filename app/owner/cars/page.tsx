"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Car, 
  PlusCircle, 
  Search, 
  Edit, 
  Calendar, 
  Eye, 
  MoreVertical, 
  Trash2,
  Star 
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { carService } from "@/lib/api"
import { useRealApi } from "@/lib/utils"
import { RouteProtection } from "@/components/route-protection"
import { sanitizeImageUrl } from "@/lib/utils"

// Define car type to match our mock data structure
interface CarData {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  location: string;
  rating: number;
  reviews: number;
  status: string;
  image: string;
  bookings: number;
  availableFrom: string;
  availableTo: string;
}

// Mock data for cars
const mockCars: CarData[] = [
  {
    id: 1,
    make: "Renault",
    model: "Clio",
    year: 2020,
    price: 35,
    location: "Paris, France",
    rating: 4.8,
    reviews: 24,
    status: "active",
    image: "/placeholder.svg",
    bookings: 12,
    availableFrom: "2023-08-01",
    availableTo: "2023-12-31"
  },
  {
    id: 2,
    make: "Peugeot",
    model: "3008",
    year: 2021,
    price: 65,
    location: "Lyon, France",
    rating: 4.6,
    reviews: 18,
    status: "active",
    image: "/placeholder.svg",
    bookings: 8,
    availableFrom: "2023-08-01",
    availableTo: "2023-12-31"
  },
  {
    id: 3,
    make: "BMW",
    model: "Série 3",
    year: 2022,
    price: 85,
    location: "Marseille, France",
    rating: 4.9,
    reviews: 32,
    status: "pending",
    image: "/placeholder.svg",
    bookings: 0,
    availableFrom: "2023-08-01",
    availableTo: "2023-12-31"
  },
  {
    id: 4,
    make: "Volkswagen",
    model: "Golf",
    year: 2019,
    price: 45,
    location: "Bordeaux, France",
    rating: 4.7,
    reviews: 15,
    status: "inactive",
    image: "/placeholder.svg",
    bookings: 5,
    availableFrom: "2023-08-01",
    availableTo: "2023-12-31"
  }
]

// Helper function to map API car data to our CarData structure
const mapApiCarToCarData = (car: any): CarData => {
  return {
    id: car.id,
    make: car.make || "",
    model: car.model || "",
    year: car.year || new Date().getFullYear(),
    price: car.price_per_day || car.price || 0,
    location: car.location || "",
    rating: car.rating || 0,
    reviews: car.reviews_count || 0,
    status: car.status || "pending",
    image: car.images?.length > 0 ? car.images[0] : "/placeholder.svg",
    bookings: car.bookings_count || 0,
    availableFrom: car.available_from || "",
    availableTo: car.available_to || ""
  };
};

export default function OwnerCarsPage() {
  const { user, isOwner } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [cars, setCars] = useState<CarData[]>([])
  const [filteredCars, setFilteredCars] = useState<CarData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Filter cars based on selected tab and search query
  useEffect(() => {
    if (cars.length > 0) {
      // First filter by search query
      let filtered = cars
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase()
        filtered = cars.filter(car => 
          car.make.toLowerCase().includes(query) ||
          car.model.toLowerCase().includes(query) ||
          car.location.toLowerCase().includes(query)
        )
      }
      
      // Then filter by status tab
      if (selectedTab === "all") {
        setFilteredCars(filtered)
      } else if (selectedTab === "active") {
        setFilteredCars(filtered.filter(car => car.status === "approved" || car.status === "active"))
      } else if (selectedTab === "pending") {
        setFilteredCars(filtered.filter(car => car.status === "pending"))
      } else if (selectedTab === "inactive") {
        setFilteredCars(filtered.filter(car => car.status === "inactive" || car.status === "rejected"))
      }
    }
  }, [cars, selectedTab, searchQuery])

  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true)
      setError("")

      try {
        if (useRealApi()) {
          const response = await carService.getOwnerCars()
          // Map API response to match our CarData structure
          const mappedCars = response.map(mapApiCarToCarData)
          setCars(mappedCars)
        } else {
          // Don't use mock data anymore, just set empty array
          setCars([])
        }
      } catch (err: any) {
        console.error("Error fetching cars:", err)
        setError(err.message || "Failed to load cars")
        setCars([]) // Set empty array on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchCars()
  }, [])

  // Filter cars based on search query
  const filteredCarsBySearch = filteredCars
    .filter(car => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        car.make.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query) ||
        car.location.toLowerCase().includes(query)
      )
    })

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "approved":
        return <Badge className="bg-green-500">Actif</Badge>
      case "pending":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">En attente</Badge>
      case "inactive":
      case "rejected":
        return <Badge variant="outline" className="text-gray-500 border-gray-500">Inactif</Badge>
      default:
        return <Badge variant="outline">Inconnu</Badge>
    }
  }

  return (
    <RouteProtection requiredRoles={["owner", "admin", "superadmin"]}>
      <div className="container py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mes véhicules</h1>
              <p className="text-gray-500 dark:text-gray-400">Gérez vos véhicules disponibles à la location</p>
            </div>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/owner/cars/add">
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajouter un véhicule
              </Link>
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par marque, modèle ou lieu..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="active">Actifs</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="inactive">Inactifs</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab}>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Chargement de vos véhicules...</p>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : filteredCarsBySearch.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun véhicule trouvé</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      {searchQuery
                        ? "Aucun résultat ne correspond à votre recherche."
                        : selectedTab !== "all"
                        ? `Vous n'avez pas encore de véhicules avec le statut "${selectedTab}".`
                        : "Vous n'avez pas encore ajouté de véhicules à votre compte."}
                    </p>
                    <Button asChild className="bg-red-600 hover:bg-red-700">
                      <Link href="/owner/cars/add">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Ajouter un véhicule
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCarsBySearch.map((car) => (
                    <Card key={car.id} className="overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={sanitizeImageUrl(car.image) || "/placeholder.svg"}
                          alt={`${car.make} ${car.model}`}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            // Replace the problematic image with placeholder
                            console.error(`Failed to load image: ${car.image}`);
                            // Handle image error by casting to HTMLImageElement
                            const imgElement = e.currentTarget as HTMLImageElement;
                            imgElement.src = "/placeholder.svg";
                          }}
                          unoptimized={true}
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 right-2">
                          {getStatusBadge(car.status)}
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">
                            {car.make} {car.model} ({car.year})
                          </CardTitle>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/owner/cars/${car.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Voir les détails
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/owner/cars/${car.id}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifier
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/owner/cars/${car.id}/calendar`}>
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Gérer la disponibilité
                                </Link>
                              </DropdownMenuItem>
                              {car.status !== "inactive" && (
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Désactiver
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-gray-500 dark:text-gray-400 text-sm">
                            {car.location}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              {car.price}€
                              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                /jour
                              </span>
                            </p>
                          </div>
                        </div>
                        {(car.status === "active" || car.status === "approved") && (
                          <div className="flex items-center mt-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span className="ml-1 text-sm font-medium">{car.rating}</span>
                            </div>
                            <span className="mx-1.5 text-gray-500 dark:text-gray-400 text-sm">•</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {car.reviews} avis
                            </span>
                            <span className="mx-1.5 text-gray-500 dark:text-gray-400 text-sm">•</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {car.bookings} réservations
                            </span>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                          <Link href={`/owner/cars/${car.id}`}>Gérer ce véhicule</Link>
                        </Button>
                      </CardFooter>
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