"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { bookingService, type Booking } from "@/lib/api/bookings/bookingService"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Car as CarIcon, AlertCircle, MessageSquare, Phone, ArrowLeft } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RouteProtection } from "@/components/route-protection"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { BackButton } from "@/components/ui/back-button"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingMessages } from "@/components/booking-messages"

export default function ReservationDetailPage({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [cancelLoading, setCancelLoading] = useState(false)
  
  useEffect(() => {
    const fetchBooking = async () => {
      if (!isAuthenticated || !resolvedParams.id) return
      
      setLoading(true)
      try {
        const bookingId = parseInt(resolvedParams.id)
        const bookingData = await bookingService.getBooking(bookingId)
        
        // Log the booking data to see what we're getting from the API
        console.log('Booking data:', bookingData)
        
        if (!bookingData) {
          throw new Error('No booking data returned from API')
        }
        
        // Make sure we have all the necessary data
        if (!bookingData.car) {
          throw new Error('Booking data does not include car details')
        }
        
        setBooking(bookingData)
      } catch (err) {
        console.error("Error fetching booking:", err)
        setError("Impossible de charger les détails de cette réservation.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchBooking()
  }, [isAuthenticated, resolvedParams.id])
  
  const formatDate = (date: Date | string) => {
    if (!date) return ""
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date
      return format(dateObj, "dd MMMM yyyy", { locale: fr })
    } catch (e) {
      console.error("Error formatting date:", e, date)
      return String(date)
    }
  }
  
  const getStatusBadge = (status: Booking['status']) => {
    const statusMap: Record<Booking['status'], { label: string, variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "En attente", variant: "secondary" },
      confirmed: { label: "Confirmée", variant: "default" },
      active: { label: "En cours", variant: "default" },
      completed: { label: "Terminée", variant: "outline" },
      cancelled: { label: "Annulée", variant: "destructive" },
      rejected: { label: "Rejetée", variant: "destructive" }
    }
    
    const { label, variant } = statusMap[status] || { label: status, variant: "outline" }
    
    return <Badge variant={variant}>{label}</Badge>
  }
  
  const handleCancelBooking = async () => {
    if (!booking) return
    
    setCancelLoading(true)
    try {
      await bookingService.cancelBooking(booking.id, "Annulation par le client")
      toast({
        title: "Réservation annulée",
        description: "Votre réservation a été annulée avec succès.",
      })
      router.push("/reservations")
    } catch (err) {
      console.error("Error cancelling booking:", err)
      toast({
        title: "Erreur",
        description: "Impossible d'annuler cette réservation. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setCancelLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="container py-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }
  
  if (error || !booking) {
    return (
      <div className="container py-10">
        <BackButton className="mb-6" onClick={() => router.push("/reservations")} />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Cette réservation n'existe pas ou a été supprimée."}</AlertDescription>
        </Alert>
      </div>
    )
  }
  
  return (
    <RouteProtection requiredRoles={["client", "admin", "superadmin"]}>
      <div className="container py-10">
        <BackButton className="mb-6" onClick={() => router.push("/reservations")} />
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="payment">Paiement</TabsTrigger>
          </TabsList>
          
          {/* Details tab content */}
          <TabsContent value="details">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">Réservation #{booking.id}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                    </CardDescription>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Car details */}
                {booking.car && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="aspect-[4/3] bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={(booking.car.images && booking.car.images[0]) || "/placeholder.svg"} 
                        alt={booking.car.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-xl font-bold">{booking.car.title}</h3>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Type</h4>
                          <p className="font-semibold">{booking.car.type || "Voiture"}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Année</h4>
                          <p className="font-semibold">{booking.car.year || "2023"}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Transmission</h4>
                          <p className="font-semibold">{booking.car.transmission || "Automatique"}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Carburant</h4>
                          <p className="font-semibold">{booking.car.fuel || "Essence"}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Localisation</h4>
                          <p className="font-semibold">{booking.car.location || "Paris"}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Places</h4>
                          <p className="font-semibold">{booking.car.seats || "5"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <Separator />
                
                {/* Booking details */}
                <div>
                  <h3 className="font-medium mb-4">Détails de la réservation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Prix par jour</h4>
                      <p className="font-semibold">{booking.car?.price ? `${booking.car.price}€` : "0€"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Prix total</h4>
                      <p className="font-bold text-red-600">{booking.totalPrice ? `${booking.totalPrice}€` : "0€"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Date de début</h4>
                      <p className="font-semibold">{booking.startDate ? formatDate(booking.startDate) : "Non spécifiée"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Date de fin</h4>
                      <p className="font-semibold">{booking.endDate ? formatDate(booking.endDate) : "Non spécifiée"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Durée</h4>
                      <p className="font-semibold">
                        {booking.startDate && booking.endDate 
                          ? `${Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))} jours` 
                          : "Non calculée"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Statut</h4>
                      <div>{getStatusBadge(booking.status)}</div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Owner details */}
                {booking.car?.owner && (
                  <div>
                    <h3 className="font-medium mb-4">Propriétaire</h3>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                        <img 
                          src={booking.car.owner.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(booking.car.owner.name)} 
                          alt={booking.car.owner.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{booking.car.owner.name}</p>
                        <div className="flex space-x-2 mt-2">
                          <Button size="sm" variant="outline" className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                          <Button size="sm" variant="outline" className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            Appeler
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Message */}
                {booking.message && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">Votre message</h3>
                      <p className="text-gray-600 bg-gray-50 p-4 rounded-md dark:bg-gray-800">{booking.message}</p>
                    </div>
                  </>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-end space-x-2">
                {booking.status === 'pending' && (
                  <Button 
                    variant="destructive"
                    onClick={handleCancelBooking}
                    disabled={cancelLoading}
                  >
                    {cancelLoading ? "Annulation..." : "Annuler la réservation"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Messages tab content */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Messages
                </CardTitle>
                <CardDescription>
                  Communiquez avec {booking.car?.owner ? "le locataire" : "le propriétaire"} concernant cette réservation
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[500px]">
                <BookingMessages bookingId={parseInt(resolvedParams.id)} />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Payment tab content */}
          <TabsContent value="payment">
            {/* Existing payment content */}
          </TabsContent>
        </Tabs>
      </div>
    </RouteProtection>
  )
} 