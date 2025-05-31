"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, CheckCircle, XCircle, AlertTriangle, Eye, FileText, Car, User, Filter } from "lucide-react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { useRealApi } from "@/lib/utils"

// Mock data for pending verifications
const pendingVerifications = [
  {
    id: 1,
    type: "Identité",
    user: {
      id: 101,
      name: "Marie Lefèvre",
      email: "marie@example.com",
      registeredDate: "15/03/2023",
    },
    submittedDate: "10/04/2023",
    status: "En attente",
    documents: [
      { id: 1, name: "Carte d'identité (recto)", type: "image/jpeg", url: "/placeholder.svg?height=300&width=500" },
      { id: 2, name: "Carte d'identité (verso)", type: "image/jpeg", url: "/placeholder.svg?height=300&width=500" },
    ],
  },
  {
    id: 2,
    type: "Véhicule",
    user: {
      id: 102,
      name: "Thomas Dubois",
      email: "thomas@example.com",
      registeredDate: "20/02/2023",
    },
    vehicle: {
      brand: "Renault",
      model: "Clio",
      year: 2019,
      licensePlate: "AB-123-CD",
    },
    submittedDate: "09/04/2023",
    status: "En attente",
    documents: [
      { id: 3, name: "Carte grise", type: "image/jpeg", url: "/placeholder.svg?height=300&width=500" },
      { id: 4, name: "Assurance", type: "application/pdf", url: "/placeholder.svg?height=300&width=500" },
      { id: 5, name: "Contrôle technique", type: "application/pdf", url: "/placeholder.svg?height=300&width=500" },
    ],
  },
  {
    id: 3,
    type: "Identité",
    user: {
      id: 103,
      name: "Sophie Bernard",
      email: "sophie@example.com",
      registeredDate: "05/03/2023",
    },
    submittedDate: "08/04/2023",
    status: "En attente",
    documents: [{ id: 6, name: "Passeport", type: "image/jpeg", url: "/placeholder.svg?height=300&width=500" }],
  },
  {
    id: 4,
    type: "Véhicule",
    user: {
      id: 104,
      name: "Lucas Robert",
      email: "lucas@example.com",
      registeredDate: "10/01/2023",
    },
    vehicle: {
      brand: "Peugeot",
      model: "3008",
      year: 2020,
      licensePlate: "EF-456-GH",
    },
    submittedDate: "07/04/2023",
    status: "En attente",
    documents: [
      { id: 7, name: "Carte grise", type: "image/jpeg", url: "/placeholder.svg?height=300&width=500" },
      { id: 8, name: "Assurance", type: "application/pdf", url: "/placeholder.svg?height=300&width=500" },
      { id: 9, name: "Contrôle technique", type: "application/pdf", url: "/placeholder.svg?height=300&width=500" },
    ],
  },
]

// Mock data for recent verifications
const recentVerifications = [
  {
    id: 5,
    type: "Identité",
    user: {
      id: 105,
      name: "Julie Moreau",
      email: "julie@example.com",
      registeredDate: "25/03/2023",
    },
    submittedDate: "05/04/2023",
    verifiedDate: "06/04/2023",
    status: "Approuvé",
    verifiedBy: "Admin",
  },
  {
    id: 6,
    type: "Véhicule",
    user: {
      id: 106,
      name: "Pierre Martin",
      email: "pierre@example.com",
      registeredDate: "15/02/2023",
    },
    vehicle: {
      brand: "BMW",
      model: "Série 3",
      year: 2018,
      licensePlate: "IJ-789-KL",
    },
    submittedDate: "04/04/2023",
    verifiedDate: "05/04/2023",
    status: "Refusé",
    verifiedBy: "Admin",
    reason: "Documents illisibles",
  },
  {
    id: 7,
    type: "Identité",
    user: {
      id: 107,
      name: "Emma Petit",
      email: "emma@example.com",
      registeredDate: "10/03/2023",
    },
    submittedDate: "03/04/2023",
    verifiedDate: "04/04/2023",
    status: "Approuvé",
    verifiedBy: "Admin",
  },
]

export default function AdminVerificationPage() {
  const [selectedVerification, setSelectedVerification] = useState<any>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [pendingVerifications, setPendingVerifications] = useState([])
  const [recentVerifications, setRecentVerifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const filteredPending = pendingVerifications.filter(
    (verification) =>
      verification.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      verification.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (verification.vehicle &&
        (`${verification.vehicle.brand} ${verification.vehicle.model}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
          verification.vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()))),
  )

  const handleApprove = (verification: any) => {
    console.log("Approving verification:", verification.id)
    // In a real app, you would call an API to approve the verification
  }

  const handleReject = () => {
    if (selectedVerification) {
      console.log("Rejecting verification:", selectedVerification.id, "Reason:", rejectReason)
      // In a real app, you would call an API to reject the verification
      setShowRejectDialog(false)
      setRejectReason("")
    }
  }

  const openRejectDialog = (verification: any) => {
    setSelectedVerification(verification)
    setShowRejectDialog(true)
  }

  useEffect(() => {
    const fetchVerifications = async () => {
      setIsLoading(true)
      setError("")
      
      try {
        if (useRealApi()) {
          // In production, use the actual API
          const pendingData = await verificationService.getPendingVerifications()
          const recentData = await verificationService.getRecentVerifications()
          
          setPendingVerifications(pendingData)
          setRecentVerifications(recentData)
        } else {
          // For development, use mock data
          setPendingVerifications(mockPendingVerifications)
          setRecentVerifications(mockRecentVerifications)
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      } catch (err) {
        console.error("Error fetching verifications:", err)
        setError("Failed to load verification data")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchVerifications()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <AdminSidebar />

        <div className="flex-1 ml-0 md:ml-64">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold">Vérification des documents</h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Vérifiez et approuvez les documents soumis par les utilisateurs
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-9 w-full sm:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="pending">En attente ({pendingVerifications.length})</TabsTrigger>
                <TabsTrigger value="recent">Récemment traités</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-6">
                {filteredPending.length > 0 ? (
                  filteredPending.map((verification) => (
                    <Card key={verification.id}>
                      <CardHeader className="pb-2">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {verification.type === "Identité" ? (
                                <User className="h-5 w-5 text-blue-600" />
                              ) : (
                                <Car className="h-5 w-5 text-green-600" />
                              )}
                              Vérification de {verification.type.toLowerCase()}
                            </CardTitle>
                            <CardDescription>
                              Soumis le {verification.submittedDate} par {verification.user.name}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            En attente
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-sm font-medium mb-2">Informations</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Utilisateur:</span>
                                <span>{verification.user.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Email:</span>
                                <span>{verification.user.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Inscrit le:</span>
                                <span>{verification.user.registeredDate}</span>
                              </div>

                              {verification.vehicle && (
                                <>
                                  <Separator className="my-2" />
                                  <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Véhicule:</span>
                                    <span>
                                      {verification.vehicle.brand} {verification.vehicle.model}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Année:</span>
                                    <span>{verification.vehicle.year}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Immatriculation:</span>
                                    <span>{verification.vehicle.licensePlate}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium mb-2">Documents soumis</h3>
                            <div className="space-y-2">
                              {verification.documents.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">{doc.name}</span>
                                  </div>
                                  <Button variant="ghost" size="sm" asChild>
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                      <Eye className="h-4 w-4 mr-1" />
                                      Voir
                                    </a>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          className="border-red-600 text-red-600 hover:bg-red-50"
                          onClick={() => openRejectDialog(verification)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Refuser
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(verification)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approuver
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune vérification en attente</h3>
                    <p className="text-gray-500 dark:text-gray-400">Toutes les vérifications ont été traitées.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="recent" className="space-y-6">
                {recentVerifications.map((verification) => (
                  <Card key={verification.id}>
                    <CardHeader className="pb-2">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {verification.type === "Identité" ? (
                              <User className="h-5 w-5 text-blue-600" />
                            ) : (
                              <Car className="h-5 w-5 text-green-600" />
                            )}
                            Vérification de {verification.type.toLowerCase()}
                          </CardTitle>
                          <CardDescription>
                            Traité le {verification.verifiedDate} par {verification.verifiedBy}
                          </CardDescription>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            verification.status === "Approuvé"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }
                        >
                          {verification.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Informations</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Utilisateur:</span>
                              <span>{verification.user.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Email:</span>
                              <span>{verification.user.email}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Soumis le:</span>
                              <span>{verification.submittedDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Traité le:</span>
                              <span>{verification.verifiedDate}</span>
                            </div>

                            {verification.vehicle && (
                              <>
                                <Separator className="my-2" />
                                <div className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-400">Véhicule:</span>
                                  <span>
                                    {verification.vehicle.brand} {verification.vehicle.model}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-400">Année:</span>
                                  <span>{verification.vehicle.year}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-400">Immatriculation:</span>
                                  <span>{verification.vehicle.licensePlate}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div>
                          {verification.status === "Refusé" && verification.reason && (
                            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-900/30">
                              <h3 className="text-sm font-medium mb-2 text-red-800 dark:text-red-300">
                                Motif du refus
                              </h3>
                              <p className="text-sm text-red-700 dark:text-red-400">{verification.reason}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refuser la vérification</DialogTitle>
            <DialogDescription>
              Veuillez indiquer le motif du refus. Cette information sera communiquée à l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Motif du refus..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Annuler
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleReject} disabled={!rejectReason.trim()}>
              Confirmer le refus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
