"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { bookingService, type Booking } from "@/lib/api/bookings/bookingService"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Car as CarIcon, AlertCircle, RefreshCw } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RouteProtection } from "@/components/route-protection"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"

export default function ClientReservationsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  const fetchBookings = async () => {
    if (!isAuthenticated) return
    
    setLoading(true)
    setError("")
    
    try {
      const bookingsData = await bookingService.getBookings()
      
      if (Array.isArray(bookingsData)) {
        setBookings(bookingsData)
      } else {
        console.error("Invalid bookings data format:", bookingsData)
        setError("Format de données incorrect. Veuillez réessayer.")
      }
    } catch (err: any) {
      console.error("Error fetching bookings:", err)
      setError(err?.message || "Impossible de charger vos réservations. Veuillez réessayer ou vous reconnecter.")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings()
    }
  }, [isAuthenticated])
  
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
  
  const activeBookings = bookings.filter(booking => 
    ['pending', 'confirmed', 'active'].includes(booking.status)
  )
  
  const pastBookings = bookings.filter(booking => 
    ['completed', 'cancelled', 'rejected'].includes(booking.status)
  )

  return (
    <RouteProtection requiredRoles={["client", "admin", "superadmin"]}>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-2">Mes réservations</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Gérez vos réservations de véhicules</p>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription className="flex-1">{error}</AlertDescription>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchBookings} 
              className="ml-2"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Réessayer
            </Button>
          </Alert>
        )}
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            {!error && (
              <Tabs defaultValue="active" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="active">
                    Réservations actives
                    {activeBookings.length > 0 && (
                      <span className="ml-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {activeBookings.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="past">
                    Historique
                    {pastBookings.length > 0 && (
                      <span className="ml-2 bg-gray-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {pastBookings.length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="active" className="space-y-6">
                  {activeBookings.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500 mb-4">Vous n'avez pas de réservations actives.</p>
                      <Button onClick={() => router.push("/search")}>
                        Rechercher un véhicule
                      </Button>
                    </div>
                  ) : (
                    activeBookings.map(booking => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="past" className="space-y-6">
                  {pastBookings.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500">Vous n'avez pas d'historique de réservations.</p>
                    </div>
                  ) : (
                    pastBookings.map(booking => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))
                  )}
                </TabsContent>
              </Tabs>
            )}
          </>
        )}
      </div>
    </RouteProtection>
  )
}

function BookingCard({ booking }: { booking: Booking }) {
  const router = useRouter()
  
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
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{booking.car?.title || "Véhicule"}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
            </CardDescription>
          </div>
          {getStatusBadge(booking.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="aspect-[4/3] bg-gray-100 rounded-md overflow-hidden">
            <img 
              src={(booking.car?.images && booking.car.images[0]) || "/placeholder.svg"} 
              alt={booking.car?.title || "Car image"} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Prix total</h4>
                <p className="text-lg font-bold">{booking.totalPrice}€</p>
              </div>
              
              {booking.car?.owner && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Propriétaire</h4>
                  <p>{booking.car.owner.name}</p>
                </div>
              )}
            </div>
            
            <Separator />
            
            {booking.message && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Message</h4>
                <p className="text-sm">{booking.message}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          onClick={() => router.push(`/client/reservations/${booking.id}`)}
        >
          Détails
        </Button>
        
        {booking.status === 'pending' && (
          <Button 
            variant="destructive"
            onClick={() => {
              // Handle cancellation
            }}
          >
            Annuler
          </Button>
        )}
      </CardFooter>
    </Card>
  )
} 