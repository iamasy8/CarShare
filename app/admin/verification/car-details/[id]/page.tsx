"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, User, Info, CheckCircle, XCircle, FileText, Clock, Shield, X, ChevronRight } from "lucide-react"
import AdminSidebar from "@/components/admin/admin-sidebar"

// Mock data for a car verification request
const carVerification = {
  id: 1,
  status: "pending",
  submittedDate: "10/04/2023",
  user: {
    id: 101,
    name: "Thomas Dubois",
    email: "thomas@example.com",
    phone: "+33 6 12 34 56 78",
    registeredDate: "20/02/2023",
    verifiedIdentity: true,
    rating: 4.7,
    listings: 2,
  },
  car: {
    make: "Peugeot",
    model: "3008",
    year: 2020,
    type: "SUV",
    fuel: "Diesel",
    transmission: "Automatique",
    seats: 5,
    doors: 5,
    licensePlate: "AB-123-CD",
    price: 65,
    location: "Rabat, Morocco",
    description:
      "Ce Peugeot 3008 est idéal pour vos voyages en famille ou vos escapades le week-end. Spacieux, confortable et économique, il vous offrira une expérience de conduite agréable. Équipé de nombreuses options pour votre confort et votre sécurité.",
    features: ["Climatisation", "GPS", "Bluetooth", "Caméra de recul", "Régulateur de vitesse", "Sièges chauffants"],
    availableFrom: "25/04/2023",
    availableTo: "25/07/2023",
  },
  documents: [
    { id: 1, name: "Carte grise", type: "image/jpeg", url: "/placeholder.svg?height=300&width=500" },
    { id: 2, name: "Assurance", type: "application/pdf", url: "/placeholder.svg?height=300&width=500" },
    { id: 3, name: "Contrôle technique", type: "application/pdf", url: "/placeholder.svg?height=300&width=500" },
  ],
  images: [
    { id: 1, url: "/placeholder.svg?height=400&width=600", caption: "Vue extérieure avant" },
    { id: 2, url: "/placeholder.svg?height=400&width=600", caption: "Vue extérieure arrière" },
    { id: 3, url: "/placeholder.svg?height=400&width=600", caption: "Vue intérieure avant" },
    { id: 4, url: "/placeholder.svg?height=400&width=600", caption: "Vue intérieure arrière" },
    { id: 5, url: "/placeholder.svg?height=400&width=600", caption: "Tableau de bord" },
  ],
}

export default function CarVerificationDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)

  const handleApprove = async () => {
    setIsSubmitting(true)

    try {
      // In a real app, you would call an API to approve the verification
      console.log("Approving car verification:", params.id)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect back to the verification list
      router.push("/admin/verification?success=approved")
    } catch (error) {
      console.error("Error approving verification:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) return

    setIsSubmitting(true)

    try {
      // In a real app, you would call an API to reject the verification
      console.log("Rejecting car verification:", params.id, "Reason:", rejectReason)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Close dialog and redirect back to the verification list
      setShowRejectDialog(false)
      router.push("/admin/verification?success=rejected")
    } catch (error) {
      console.error("Error rejecting verification:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <AdminSidebar />

        <div className="flex-1 ml-0 md:ml-64">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Button variant="ghost" size="sm" asChild className="mr-4">
                <Link href="/admin/verification">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Retour
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Vérification de véhicule</h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Vérifiez les informations du véhicule avant de l'approuver
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-xl">
                          {carVerification.car.make} {carVerification.car.model}
                        </CardTitle>
                        <CardDescription>
                          Soumis le {carVerification.submittedDate} par {carVerification.user.name}
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30"
                      >
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        En attente
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Informations du véhicule</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Marque:</span>
                            <span>{carVerification.car.make}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Modèle:</span>
                            <span>{carVerification.car.model}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Année:</span>
                            <span>{carVerification.car.year}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Type:</span>
                            <span>{carVerification.car.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Carburant:</span>
                            <span>{carVerification.car.fuel}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Transmission:</span>
                            <span>{carVerification.car.transmission}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Places:</span>
                            <span>{carVerification.car.seats}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Portes:</span>
                            <span>{carVerification.car.doors}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Immatriculation:</span>
                            <span>{carVerification.car.licensePlate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Prix par jour:</span>
                            <span>{carVerification.car.price}€</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Localisation:</span>
                            <span>{carVerification.car.location}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">Disponibilité</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Disponible à partir de:</span>
                            <span>{carVerification.car.availableFrom}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Disponible jusqu'au:</span>
                            <span>{carVerification.car.availableTo || "Non spécifié"}</span>
                          </div>
                        </div>

                        <h3 className="text-sm font-medium mt-6 mb-2">Équipements</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {carVerification.car.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h3 className="text-sm font-medium mb-2">Description</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{carVerification.car.description}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Photos du véhicule</CardTitle>
                    <CardDescription>
                      Vérifiez que les photos correspondent à la description et sont de bonne qualité
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {carVerification.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-[4/3] rounded-md overflow-hidden border cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => {
                            setCurrentImageIndex(index)
                            setShowImageModal(true)
                          }}
                        >
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt={image.caption}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1.5">
                            {image.caption}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>Vérifiez que tous les documents requis sont présents et valides</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {carVerification.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{doc.type}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">
                              Voir
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations du propriétaire</CardTitle>
                    <CardDescription>Détails sur le propriétaire du véhicule</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">{carVerification.user.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Membre depuis {carVerification.user.registeredDate}
                        </p>
                        {carVerification.user.verifiedIdentity && (
                          <div className="flex items-center mt-1 text-sm text-green-600 dark:text-green-400">
                            <Shield className="h-3.5 w-3.5 mr-1" />
                            Identité vérifiée
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Email:</span>
                        <span>{carVerification.user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Téléphone:</span>
                        <span>{carVerification.user.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Note:</span>
                        <span>{carVerification.user.rating}/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Annonces:</span>
                        <span>{carVerification.user.listings}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Approuver ou refuser cette annonce</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-900/30">
                      <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                            Vérification importante
                          </p>
                          <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                            Assurez-vous que toutes les informations sont correctes et que les documents sont valides
                            avant d'approuver cette annonce.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={handleApprove}
                        disabled={isSubmitting}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Approbation en cours..." : "Approuver l'annonce"}
                      </Button>
                      <Button
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={() => setShowRejectDialog(true)}
                        disabled={isSubmitting}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Refuser l'annonce
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refuser l'annonce</DialogTitle>
            <DialogDescription>
              Veuillez indiquer le motif du refus. Cette information sera communiquée au propriétaire.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Motif du refus..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="min-h-[120px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleReject}
              disabled={isSubmitting || !rejectReason.trim()}
            >
              {isSubmitting ? "Refus en cours..." : "Confirmer le refus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={carVerification.images[currentImageIndex].url || "/placeholder.svg"}
              alt={carVerification.images[currentImageIndex].caption}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
              <p className="text-center">{carVerification.images[currentImageIndex].caption}</p>
            </div>
            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/20 hover:bg-black/40 text-white rounded-full"
                onClick={() => setShowImageModal(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/20 hover:bg-black/40 text-white rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentImageIndex((prev) => (prev === 0 ? carVerification.images.length - 1 : prev - 1))
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/20 hover:bg-black/40 text-white rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentImageIndex((prev) => (prev === carVerification.images.length - 1 ? 0 : prev + 1))
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
