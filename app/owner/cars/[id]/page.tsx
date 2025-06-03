"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Car as CarIcon,
  Check,
  CheckCircle2,
  Clock,
  Edit,
  Fuel,
  MapPin,
  Pencil,
  Settings,
  Star,
  Users,
  X
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { carService } from "@/lib/api"
import { useRealApi } from "@/lib/utils"
import { RouteProtection } from "@/components/route-protection"
import { sanitizeImageUrl } from "@/lib/utils"

type CarStatus = "pending" | "approved" | "rejected" | "inactive"

// Define the API response type which might have different property names
interface ApiCarResponse {
  id: number
  title?: string
  make?: string
  model?: string
  year?: number
  type?: string
  price_per_day?: number
  price?: number
  location?: string
  seats?: number
  doors?: number
  fuel?: string
  transmission?: string
  description?: string
  features?: string[]
  images?: string[]
  status?: CarStatus
  bookings_count?: number
  reviews_count?: number
  rating?: number
  [key: string]: any // Allow for other properties
}

// Define our normalized Car type for use in the component
interface Car {
  id: number
  title: string
  make: string
  model: string
  year: number
  type: string
  price_per_day: number
  location: string
  seats: number
  doors: number
  fuel: string
  transmission: string
  description: string
  features: string[]
  images: string[]
  status: CarStatus
  bookings_count: number
  reviews_count: number
  rating: number
}

export default function CarDetailPage() {
  const params = useParams()
  const { user, isOwner } = useAuth()
  const router = useRouter()
  const [car, setCar] = useState<Car | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<CarStatus>("approved")
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (params?.id) {
      fetchCarDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id])

  const fetchCarDetails = async () => {
    setIsLoading(true)
    setError("")
    try {
      const carId = params?.id ? Number(Array.isArray(params.id) ? params.id[0] : params.id) : 0

      if (useRealApi()) {
        const response: ApiCarResponse = await carService.getCar(carId)
        
        // Convert API response to our normalized Car type
        const carData: Car = {
          id: response.id,
          title: response.title || `${response.make || ''} ${response.model || ''}`.trim() || 'Véhicule',
          make: response.make || '',
          model: response.model || '',
          year: response.year || new Date().getFullYear(),
          type: response.type || '',
          price_per_day: response.price_per_day || response.price || 0,
          location: response.location || '',
          seats: response.seats || 0,
          doors: response.doors || 0,
          fuel: response.fuel || '',
          transmission: response.transmission || '',
          description: response.description || '',
          features: Array.isArray(response.features) ? response.features : [],
          images: Array.isArray(response.images) ? response.images : [],
          status: response.status || 'pending',
          bookings_count: response.bookings_count || 0,
          reviews_count: response.reviews_count || 0,
          rating: response.rating || 0
        }
        
        setCar(carData)
        setNewStatus(carData.status)
      } else {
        setTimeout(() => {
          setCar({
            id: carId,
            title: "Renault Clio",
            make: "Renault",
            model: "Clio",
            year: 2020,
            type: "Berline",
            price_per_day: 35,
            location: "Paris, France",
            seats: 5,
            doors: 5,
            fuel: "Essence",
            transmission: "Automatique",
            description: "Une voiture compacte idéale pour la ville.",
            features: ["Climatisation", "Bluetooth", "GPS"],
            images: ["/placeholder.svg", "/placeholder.svg"],
            status: "pending",
            bookings_count: 12,
            reviews_count: 24,
            rating: 4.8,
          })
          setNewStatus("pending")
          setIsLoading(false)
        }, 500)
      }
    } catch (err: any) {
      console.error("Error fetching car details:", err)
      setError(err.message || "Impossible de charger les détails du véhicule")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async () => {
    if (!car || car.status === newStatus) return

    setIsUpdating(true)
    try {
      if (useRealApi()) {
        const formData = new FormData()
        formData.append("status", newStatus)
        await carService.updateCar(car.id, formData)

        setCar((prevCar) => {
          if (!prevCar) return null
          return { ...prevCar, status: newStatus }
        })
        setStatusDialogOpen(false)

        toast({
          title: "Statut mis à jour",
          description: `Le statut du véhicule a été changé en ${getStatusLabel(newStatus)}.`,
        })
      } else {
        setTimeout(() => {
          setCar((prevCar) => {
            if (!prevCar) return null
            return { ...prevCar, status: newStatus }
          })
          setStatusDialogOpen(false)

          toast({
            title: "Statut mis à jour",
            description: `Le statut du véhicule a été changé en ${getStatusLabel(newStatus)}.`,
          })
          setIsUpdating(false)
        }, 1000)
      }
    } catch (err: any) {
      console.error("Error updating car status:", err)
      toast({
        title: "Erreur",
        description: err.message || "Échec de la mise à jour du statut.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusBadge = (status: CarStatus) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600">Actif</Badge>
      case "pending":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">En attente</Badge>
      case "rejected":
      case "inactive":
        return <Badge variant="secondary">Inactif</Badge>
      default:
        return <Badge variant="outline">Inconnu</Badge>
    }
  }

  const getStatusLabel = (status: CarStatus) => {
    switch (status) {
      case "approved":
        return "Actif"
      case "pending":
        return "En attente"
      case "rejected":
      case "inactive":
        return "Inactif"
      default:
        return "Inconnu"
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p>Chargement des détails du véhicule...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => router.back()}>Retour</Button>
          </div>
        </div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="mb-4">Véhicule non trouvé</p>
            <Button onClick={() => router.push("/owner/cars")}>Retour à mes véhicules</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <RouteProtection requiredRoles={["owner"]}>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux véhicules
          </Button>

          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{car.make} {car.model} ({car.year})</h1>
            <div className="flex items-center gap-2">
              {getStatusBadge(car.status)}
              <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="ml-2">
                    <Settings className="h-4 w-4 mr-2" />
                    Changer le statut
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Changer le statut du véhicule</DialogTitle>
                    <DialogDescription>
                      Sélectionnez le nouveau statut pour votre véhicule.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Select 
                      value={newStatus} 
                      onValueChange={(value) => {
                        // Type assertion to ensure value is treated as a valid CarStatus
                        setNewStatus(value as CarStatus)
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Actif</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>Annuler</Button>
                    <Button onClick={handleStatusChange} disabled={isUpdating || newStatus === car.status}>
                      {isUpdating ? "Mise à jour..." : "Confirmer"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations du véhicule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {car.images && car.images.length > 0 ? (
                      <div className="aspect-video relative rounded-md overflow-hidden mb-4">
                        <Image
                          src={sanitizeImageUrl(car.images[0])}
                          alt={`${car.make} ${car.model}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center mb-4">
                        <CarIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}

                    {car.images && car.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {car.images.slice(1, 5).map((image, index) => (
                          <div key={index} className="aspect-square relative rounded-md overflow-hidden">
                            <Image
                              src={sanitizeImageUrl(image)}
                              alt={`${car.make} ${car.model} - Image ${index + 2}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Détails</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <CarIcon className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{car.make} {car.model} ({car.year})</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{car.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{car.seats} sièges, {car.doors} portes</span>
                      </div>
                      <div className="flex items-center">
                        <Fuel className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{car.fuel}, {car.transmission}</span>
                      </div>
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{car.type}</span>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <h3 className="font-semibold text-lg mb-2">Prix</h3>
                    <p className="text-2xl font-bold">{car.price_per_day}€ <span className="text-sm font-normal text-gray-500">/jour</span></p>

                    <Separator className="my-4" />

                    <h3 className="font-semibold text-lg mb-2">Équipements</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {Array.isArray(car.features) && car.features.length > 0 ? (
                        car.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            <span>{feature}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center">
                          <span>Aucune caractéristique disponible</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300">{car.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full">
                  <Link href={`/owner/cars/${car.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier ce véhicule
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/owner/cars/${car.id}/calendar`}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Gérer la disponibilité
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Réservations</p>
                    <p className="text-xl font-bold">{car.bookings_count || 0}</p>
                  </div>
                  
                  {car.status === "approved" && (
                    <div>
                      <div className="flex items-center">
                        <p className="text-sm text-gray-500 mr-2">Évaluation</p>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="ml-1 text-sm font-medium">{car.rating || 0}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{car.reviews_count || 0} avis</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-500">Statut</p>
                    <div className="mt-1">
                      {car.status === "approved" && (
                        <div className="flex items-center text-green-600">
                          <Check className="h-4 w-4 mr-1" />
                          <span>Actif et visible par les utilisateurs</span>
                        </div>
                      )}
                      {car.status === "pending" && (
                        <div className="flex items-center text-yellow-600">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>En attente de validation</span>
                        </div>
                      )}
                      {car.status === "rejected" && (
                        <div className="flex items-center text-red-600">
                          <X className="h-4 w-4 mr-1" />
                          <span>Rejeté</span>
                        </div>
                      )}
                      {car.status === "inactive" && (
                        <div className="flex items-center text-gray-600">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          <span>Inactif (non visible)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RouteProtection>
  )
}
