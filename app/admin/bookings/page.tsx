"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { adminService } from "@/lib/api/adminService"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  AlertCircle, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight,
  RefreshCw 
} from "lucide-react"
import type { BaseBooking, BaseCar } from "@/lib/api/types"
import { cn } from "@/lib/utils"

interface BookingWithDetails extends Omit<BaseBooking, 'car'> {
  car?: {
    id: number
    make: string
    model: string
    year: number
  }
  client?: {
    id: number
    name: string
    email: string
  }
}

const statusTranslations = {
  pending: "En attente",
  confirmed: "Confirmée",
  active: "En cours",
  completed: "Terminée",
  cancelled: "Annulée"
} as const

export default function BookingsPage() {
  const { isAdmin, isSuperAdmin } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<BookingWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Check admin permissions
  useEffect(() => {
    if (!isAdmin && !isSuperAdmin) {
      router.push("/login/admin")
      return
    }
  }, [isAdmin, isSuperAdmin, router])

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      const filters = statusFilter ? { status: statusFilter } : undefined
      const response = await adminService.getBookings(currentPage, filters)
      setBookings(response.data)
      setTotalPages(Math.ceil(response.meta.total / response.meta.perPage))
    } catch (err) {
      console.error("Error fetching bookings:", err)
      setError(
        err instanceof Error 
          ? err.message 
          : "Une erreur est survenue lors du chargement des réservations"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [currentPage, statusFilter])

  const handleUpdateStatus = async (bookingId: number, newStatus: string) => {
    try {
      await adminService.updateBookingStatus(bookingId, newStatus)
      fetchBookings() // Refresh the list
    } catch (err) {
      console.error("Error updating booking status:", err)
      setError(
        err instanceof Error 
          ? err.message 
          : "Une erreur est survenue lors de la mise à jour du statut"
      )
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "active":
        return "secondary"
      case "completed":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const LoadingSkeleton = () => (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell>
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        </TableRow>
      ))}
    </>
  )

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestion des Réservations</h1>
        <Button 
          variant="outline" 
          onClick={() => {
            setCurrentPage(1)
            fetchBookings()
          }}
          disabled={loading}
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
          Actualiser
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Réservations</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmée</SelectItem>
                <SelectItem value="active">En cours</SelectItem>
                <SelectItem value="completed">Terminée</SelectItem>
                <SelectItem value="cancelled">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Bookings Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Voiture</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <LoadingSkeleton />
                ) : bookings.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={7} 
                      className="text-center py-8 text-muted-foreground"
                    >
                      Aucune réservation trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>#{booking.id}</TableCell>
                      <TableCell>
                        {booking.car
                          ? `${booking.car.make} ${booking.car.model} (${booking.car.year})`
                          : `Voiture #${booking.carId}`}
                      </TableCell>
                      <TableCell>
                        {booking.client
                          ? booking.client.name
                          : `Client #${booking.userId}`}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <div>Du : {formatDate(booking.startDate)}</div>
                          <div>Au : {formatDate(booking.endDate)}</div>
                        </div>
                      </TableCell>
                      <TableCell>{booking.totalPrice}€</TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(booking.status)}
                          className="capitalize"
                        >
                          {statusTranslations[booking.status] || booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {booking.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateStatus(booking.id, "confirmed")}
                                aria-label="Confirmer la réservation"
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                                aria-label="Annuler la réservation"
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} sur {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || loading}
                aria-label="Page précédente"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Précédent
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || loading}
                aria-label="Page suivante"
              >
                Suivant
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 