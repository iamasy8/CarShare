"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { adminService } from "@/lib/api/adminService"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import type { Admin } from "@/lib/api/types"

export default function ActivityPage() {
  const { isAdmin, isSuperAdmin } = useAuth()
  const router = useRouter()
  const [logs, setLogs] = useState<Admin.ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState<string | null>(null)

  // Check admin permissions
  useEffect(() => {
    if (!isAdmin && !isSuperAdmin) {
      router.push("/login/admin")
      return
    }
  }, [isAdmin, isSuperAdmin, router])

  // Fetch activity logs
  const fetchLogs = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminService.getActivityLogs(currentPage)
      setLogs(response.logs)
      setTotalPages(Math.ceil(response.total / 10)) // Assuming 10 items per page
    } catch (err) {
      console.error("Error fetching activity logs:", err)
      setError(
        err instanceof Error 
          ? err.message 
          : "Une erreur est survenue lors du chargement des journaux d'activité"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [currentPage])

  const LoadingSkeleton = () => (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-48" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        </TableRow>
      ))}
    </>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Journaux d'activité</h1>
        <Button 
          variant="outline" 
          onClick={() => {
            setCurrentPage(1)
            fetchLogs()
          }}
          disabled={loading}
        >
          Actualiser
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des actions</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date et heure</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Détails</TableHead>
                  <TableHead>Rôle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <LoadingSkeleton />
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={5} 
                      className="text-center py-8 text-muted-foreground"
                    >
                      Aucune activité trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {new Date(log.timestamp).toLocaleString('fr-FR', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </TableCell>
                      <TableCell>{log.userName}</TableCell>
                      <TableCell className="capitalize">{log.action}</TableCell>
                      <TableCell>
                        <div className="max-w-[300px] truncate" title={log.details}>
                          {log.details || "-"}
                        </div>
                      </TableCell>
                      <TableCell>{log.userRole}</TableCell>
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