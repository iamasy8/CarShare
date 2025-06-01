"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Calendar, User, MapPin, Car as CarIcon, Star, Heart, Share2, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { Car } from "@/lib/api"
import { carService } from "@/lib/api/cars/carService"
import { carHelpers, handleApiError } from "@/lib/api-helpers"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { AlertDescription, Alert } from "@/components/ui/alert"
import { DateRange } from "react-day-picker"
import { parseCarFeatures } from "@/lib/utils"
import React from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { BackButton } from "@/components/ui/back-button"

// Extended Car type to handle string or array for images and features
interface ExtendedCar extends Omit<Car, 'images' | 'features'> {
  images: string[] | string;
  features: string[] | string;
}

// Type declaration for React.use
declare module 'react' {
  function use<T>(promise: Promise<T> | T): T;
}

export default function CarDetailsPage({ params }: { params: { id: string } }) {
  // Use React.use() to unwrap params
  const id = React.use(params).id
  const carId = id
  
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  })
  const [totalPrice, setTotalPrice] = useState(0)

  // Use React Query to check if car is favorited
  const { 
    data: isFavorited = false,
    refetch: refetchFavoriteStatus,
    isLoading: isFavoriteLoading
  } = useQuery({
    queryKey: ['favorite', parseInt(carId)],
    queryFn: () => carService.isFavorite(parseInt(carId)),
    enabled: isAuthenticated && !!carId,
    initialData: false, // Set initial data to false to ensure heart icon shows as not favorited by default
  })

  // DateRange handler
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange({
      from: range?.from,
      to: range?.to
    });
  };

  // Calculate total days between two dates
  const calculateDays = (from?: Date, to?: Date): number => {
    if (!from || !to) return 0
    const diffTime = Math.abs(to.getTime() - from.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Calculate total price based on selected dates
  useEffect(() => {
    if (car && dateRange.from && dateRange.to) {
      const days = calculateDays(dateRange.from, dateRange.to)
      setTotalPrice(car.price * days)
    } else {
      setTotalPrice(0)
    }
  }, [car, dateRange])

  // Fetch car details
  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true)
      setError("")

      try {
        // Get car ID from params and convert to number
        const numericCarId = parseInt(carId)
        if (isNaN(numericCarId)) {
          throw new Error("Invalid car ID")
        }

        // Always fetch from API
        const carData = await carService.getCar(numericCarId) as ExtendedCar
        
        // Ensure car.images is always an array
        if (carData.images && !Array.isArray(carData.images)) {
          // If it's a string (possibly JSON), try to parse it
          if (typeof carData.images === 'string') {
            try {
              // Use type assertion to avoid type errors
              (carData as any).images = JSON.parse(carData.images)
            } catch (e) {
              // If parsing fails, convert to single-element array
              (carData as any).images = [carData.images]
            }
          } else {
            // If it's not a string or array, make it an empty array
            (carData as any).images = []
          }
        }
        
        // Same for features
        if (carData.features && !Array.isArray(carData.features)) {
          if (typeof carData.features === 'string') {
            try {
              (carData as any).features = JSON.parse(carData.features)
            } catch (e) {
              (carData as any).features = [carData.features]
            }
          } else {
            (carData as any).features = []
          }
        }
        
        setCar(carData as Car)
      } catch (err) {
        console.error("Error fetching car details:", err)
        setError(handleApiError(err, "Impossible de charger les détails de ce véhicule."))
      } finally {
        setLoading(false)
      }
    }

    fetchCar()
  }, [carId])

  // Toggle favorite status
  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter ce véhicule à vos favoris.",
        variant: "destructive",
      })
      router.push(`/login?redirect=/cars/${carId}`)
      return
    }
    
    if (!car) return
    
    setFavoriteLoading(true)
    try {
      const numericCarId = parseInt(carId)
      
      if (isFavorited) {
        await carService.removeFromFavorites(numericCarId)
        // Invalidate both the specific car favorite status and the favorites list
        queryClient.setQueryData(['favorite', numericCarId], false)
        queryClient.invalidateQueries({ queryKey: ['favorites'] })
        toast({
          title: "Retiré des favoris",
          description: "Ce véhicule a été retiré de vos favoris.",
        })
      } else {
        await carService.addToFavorites(numericCarId)
        // Update both the specific car favorite status and the favorites list
        queryClient.setQueryData(['favorite', numericCarId], true)
        queryClient.invalidateQueries({ queryKey: ['favorites'] })
        toast({
          title: "Ajouté aux favoris",
          description: "Ce véhicule a été ajouté à vos favoris.",
        })
      }
    } catch (err) {
      console.error("Error toggling favorite:", err)
      toast({
        title: "Erreur",
        description: "Impossible de modifier vos favorites. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setFavoriteLoading(false)
    }
  }

  // Handle booking submission
  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour réserver ce véhicule.",
        variant: "destructive",
      })
      router.push(`/login?redirect=/cars/${carId}`)
      return
    }

    if (!dateRange.from || !dateRange.to) {
      toast({
        title: "Dates requises",
        description: "Veuillez sélectionner des dates de réservation.",
        variant: "destructive",
      })
      return
    }

    try {
      // In a real implementation, this would call the API
      toast({
        title: "Demande de réservation envoyée",
        description: "Le propriétaire va examiner votre demande de réservation.",
      })
      
      // Redirect to bookings page
      router.push('/client/bookings')
    } catch (err) {
      toast({
        title: "Erreur de réservation",
        description: handleApiError(err, "Impossible de créer la réservation."),
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-600 mb-4" />
          <p className="text-gray-500">Chargement des détails...</p>
        </div>
      </div>
    )
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="container mx-auto max-w-4xl">
          <BackButton className="mb-6" label="Retour aux résultats" />
          
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error || "Ce véhicule n'existe pas ou a été supprimé."}
            </AlertDescription>
          </Alert>
          
          <Button asChild>
            <Link href="/search">Voir d'autres voitures</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 md:px-6 py-8 mx-auto max-w-6xl">
        <div className="mb-6">
          <BackButton className="text-sm font-medium text-gray-500 hover:text-gray-700" label="Retour aux résultats" />
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg border overflow-hidden">
              {/* Car images */}
              <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                <img
                  src={(car.images && car.images.length > 0 ? car.images[0] : "") || "/placeholder.svg"}
                  alt={car.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    className={`p-2 rounded-full ${isFavorited ? 'bg-red-500 text-white' : 'bg-white/80 hover:bg-white text-gray-600 hover:text-red-500'}`}
                    onClick={toggleFavorite}
                    disabled={favoriteLoading || isFavoriteLoading}
                  >
                    {favoriteLoading || isFavoriteLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                    )}
                  </button>
                  <button className="p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-blue-500">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Thumbnail images */}
              {car.images && car.images.length > 1 && (
                <div className="p-4 grid grid-cols-4 gap-2">
                  {car.images.map((image, index) => (
                    <div key={index} className="aspect-[4/3] rounded-md overflow-hidden bg-gray-100">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${car.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

          {/* Car details */}
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
              <h1 className="text-2xl font-bold">{car.title}</h1>
                    <div className="flex items-center gap-2 mt-1 text-gray-500">
                      <Badge variant="outline">{car.type}</Badge>
                      <span>•</span>
                      <span>{car.year}</span>
              </div>
            </div>
                  <div className="mt-2 sm:mt-0">
                    <div className="text-2xl font-bold text-red-600">
                      {car.price}€<span className="text-sm font-normal text-gray-500">/jour</span>
              </div>
            </div>
          </div>

                <Separator className="my-6" />

                {/* Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <CarIcon className="h-5 w-5 text-gray-400 mb-1" />
                    <span className="text-sm font-medium">{carHelpers.getTransmissionLabel(car.transmission)}</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-gray-400 mb-1" />
                    <span className="text-sm font-medium">{car.seats} sièges</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400 mb-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10h14M5 14h9"
                      />
                    </svg>
                    <span className="text-sm font-medium">{car.doors} portes</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400 mb-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span className="text-sm font-medium">{carHelpers.getFuelTypeLabel(car.fuel)}</span>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Tabs */}
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="w-full justify-start mb-4">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="equipments">Équipements</TabsTrigger>
                    <TabsTrigger value="location">Localisation</TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="space-y-4">
                    <p className="text-gray-600">{car.description}</p>
            </TabsContent>
                  <TabsContent value="equipments" className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {parseCarFeatures(car.features).map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                      {parseCarFeatures(car.features).length === 0 && (
                        <div className="col-span-2 text-gray-500">
                          Aucun équipement spécifique mentionné
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="location" className="space-y-4">
                    <div className="flex items-center mb-4">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-700">{car.location}</span>
                          </div>
                    <div className="aspect-[16/9] bg-gray-100 rounded-lg">
                      {/* This would be a map component in a real implementation */}
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-500">Carte de localisation</span>
                      </div>
                    </div>
            </TabsContent>
          </Tabs>
        </div>
                  </div>
                </div>

          {/* Booking sidebar */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg border sticky top-20">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Réserver cette voiture</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dates de réservation</label>
                  <DatePickerWithRange dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />
                </div>

                {dateRange.from && dateRange.to && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">
                        {car.price}€ x {calculateDays(dateRange.from, dateRange.to)} jours
                      </span>
                      <span className="font-medium">{totalPrice}€</span>
                  </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Frais de service</span>
                      <span className="font-medium">{Math.round(totalPrice * 0.1)}€</span>
                  </div>
                    <Separator className="my-3" />
                    <div className="flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-bold">{totalPrice + Math.round(totalPrice * 0.1)}€</span>
                  </div>
                  </div>
                )}
                
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700" 
                  disabled={!dateRange.from || !dateRange.to}
                  onClick={handleBooking}
                >
                  Réserver maintenant
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  Vous ne serez débité que lorsque le propriétaire acceptera votre demande
                </p>
              </div>
                </div>
              </div>
        </div>
      </div>
    </div>
  )
}
