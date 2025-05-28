"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { adminService } from "@/lib/api/adminService"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Check, X, Search, ChevronLeft, ChevronRight } from "lucide-react"
import type { BaseCar } from "@/lib/api/types"

interface CarWithOwner extends BaseCar {
  owner?: {
    name: string
    id: number
  }
}

export default function CarsPage() {
  const { isAdmin, isSuperAdmin } = useAuth()
  const router = useRouter()
  const [cars, setCars] = useState<CarWithOwner[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [error, setError] = useState<string | null>(null)

  // Check admin permissions
  useEffect(() => {
    if (!isAdmin && !isSuperAdmin) {
      router.push("/login/admin")
      return
    }
  }, [isAdmin, isSuperAdmin, router])

  // Fetch cars
  const fetchCars = async () => {
    try {
      setLoading(true)
      setError(null)
      const filters = statusFilter !== "all" ? { status: statusFilter } : undefined
      const response = await adminService.getPendingCars(currentPage, filters)
      setCars(response.data)
      setTotalPages(Math.ceil(response.meta.total / response.meta.perPage))
    } catch (err) {
      console.error("Error fetching cars:", err)
      setError(
        err instanceof Error 
          ? err.message 
          : "Une erreur est survenue lors du chargement des voitures"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCars()
  }, [currentPage, statusFilter])

  const handleApproveCar = async (carId: number) => {
    try {
      await adminService.approveCar(carId)
      fetchCars() // Refresh the list
    } catch (err) {
      console.error("Error approving car:", err)
      setError(
        err instanceof Error 
          ? err.message 
          : "Une erreur est survenue lors de l'approbation de la voiture"
      )
    }
  }

  const handleRejectCar = async (carId: number) => {
    const reason = window.prompt("Veuillez entrer une raison de refus :")
    if (!reason) return

    try {
      await adminService.rejectCar(carId, reason)
      fetchCars() // Refresh the list
    } catch (err) {
      console.error("Error rejecting car:", err)
      setError(
        err instanceof Error 
          ? err.message 
          : "Une erreur est survenue lors du refus de la voiture"
      )
    }
  }

  const LoadingSkeleton = () => (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        </TableRow>
      ))}
    </>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestion des Voitures</h1>
        <Button 
          variant="outline" 
          onClick={() => {
            setCurrentPage(1)
            fetchCars()
          }}
          disabled={loading}
        >
          Actualiser
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Voitures</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher des voitures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvée</SelectItem>
                <SelectItem value="rejected">Refusée</SelectItem>
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

          {/* Cars Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Marque & Modèle</TableHead>
                  <TableHead>Année</TableHead>
                  <TableHead>Propriétaire</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <LoadingSkeleton />
                ) : cars.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={5} 
                      className="text-center py-8 text-muted-foreground"
                    >
                      Aucune voiture trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  cars.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell>{car.make} {car.model}</TableCell>
                      <TableCell>{car.year}</TableCell>
                      <TableCell>
                        {car.owner?.name || `Propriétaire #${car.ownerId}`}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            car.status === "approved"
                              ? "default"
                              : car.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {car.status === "pending" ? "En attente" :
                           car.status === "approved" ? "Approuvée" :
                           car.status === "rejected" ? "Refusée" : car.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {car.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApproveCar(car.id)}
                                aria-label="Approuver la voiture"
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRejectCar(car.id)}
                                aria-label="Refuser la voiture"
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
