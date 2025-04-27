"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { authService } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, CheckCircle, AlertTriangle, Info, Loader2, CreditCard, BadgeCheck, Car } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function OwnerVerificationPage() {
  const { user, status } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("identity")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [error, setError] = useState("")
  const [files, setFiles] = useState<{
    idCard?: File | null
    drivingLicense?: File | null
    proofOfAddress?: File | null
  }>({})

  // Redirect if not owner
  if (status !== "loading" && (!user || user.role !== "owner")) {
    router.push("/login")
    return null
  }

  // If already verified, redirect to dashboard
  if (user?.isVerified) {
    router.push("/owner/dashboard")
    return null
  }

  const handleFileChange = (type: "idCard" | "drivingLicense" | "proofOfAddress") => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => ({
        ...prev,
        [type]: e.target.files?.[0] || null
      }))
    }
  }

  const validateFiles = (): boolean => {
    if (!files.idCard && !files.drivingLicense) {
      setError("Please upload either an ID card or a driving license")
      return false
    }
    
    if (!files.proofOfAddress) {
      setError("Please upload a proof of address")
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateFiles()) {
      return
    }
    
    setIsSubmitting(true)
    setError("")
    
    try {
      // In real implementation, call API
      // const formData = new FormData()
      // if (files.idCard) formData.append('idCard', files.idCard)
      // if (files.drivingLicense) formData.append('drivingLicense', files.drivingLicense)
      // if (files.proofOfAddress) formData.append('proofOfAddress', files.proofOfAddress)
      
      // await authService.verifyIdentity(formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSubmitSuccess(true)
      
      // Redirect after delay
      setTimeout(() => {
        router.push("/owner/dashboard")
      }, 3000)
    } catch (error) {
      console.error("Verification failed:", error)
      setError("Verification submission failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Vérification d'identité</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Pour assurer la sécurité de notre plateforme, nous devons vérifier votre identité avant que vous puissiez publier des véhicules.
      </p>
      
      {submitSuccess ? (
        <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertTitle>Documents soumis avec succès</AlertTitle>
          <AlertDescription>
            Vos documents ont été envoyés pour vérification. Notre équipe les examinera dans les 24-48 heures.
            Vous recevrez une notification par email une fois la vérification terminée.
          </AlertDescription>
        </Alert>
      ) : error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-gray-50 dark:bg-gray-800">
          <CardHeader className="pb-3 space-y-1.5">
            <CardTitle className="flex items-center text-lg">
              <BadgeCheck className="mr-2 h-5 w-5 text-green-600" />
              Confiance
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 dark:text-gray-400">
            La vérification d'identité renforce la confiance entre propriétaires et locataires.
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50 dark:bg-gray-800">
          <CardHeader className="pb-3 space-y-1.5">
            <CardTitle className="flex items-center text-lg">
              <Car className="mr-2 h-5 w-5 text-blue-600" />
              Visibilité
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 dark:text-gray-400">
            Les propriétaires vérifiés bénéficient d'une meilleure visibilité dans les résultats de recherche.
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50 dark:bg-gray-800">
          <CardHeader className="pb-3 space-y-1.5">
            <CardTitle className="flex items-center text-lg">
              <CreditCard className="mr-2 h-5 w-5 text-purple-600" />
              Paiements
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 dark:text-gray-400">
            Permet de recevoir des paiements pour vos locations en toute sécurité.
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Documents requis</CardTitle>
          <CardDescription>
            Veuillez fournir les documents suivants pour compléter votre vérification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="identity">Pièce d'identité</TabsTrigger>
              <TabsTrigger value="address">Justificatif de domicile</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit}>
              <TabsContent value="identity" className="space-y-6">
                <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    Veuillez fournir au moins un document d'identité officiel (carte d'identité ou permis de conduire).
                    Les deux côtés du document doivent être clairement visibles.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="idCard" className="block mb-2">Carte d'identité nationale</Label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6">
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {files.idCard ? files.idCard.name : "Déposez votre carte d'identité ici ou cliquez pour parcourir"}
                        </p>
                        <Label
                          htmlFor="idCard"
                          className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          Parcourir...
                        </Label>
                        <Input
                          id="idCard"
                          type="file"
                          accept="image/jpeg,image/png,image/jpg,application/pdf"
                          className="hidden"
                          onChange={handleFileChange("idCard")}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label htmlFor="drivingLicense" className="block mb-2">Permis de conduire</Label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6">
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {files.drivingLicense ? files.drivingLicense.name : "Déposez votre permis de conduire ici ou cliquez pour parcourir"}
                        </p>
                        <Label
                          htmlFor="drivingLicense"
                          className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          Parcourir...
                        </Label>
                        <Input
                          id="drivingLicense"
                          type="file"
                          accept="image/jpeg,image/png,image/jpg,application/pdf"
                          className="hidden"
                          onChange={handleFileChange("drivingLicense")}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="button" onClick={() => setActiveTab("address")}>
                      Continuer
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="address" className="space-y-6">
                <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    Veuillez fournir un justificatif de domicile récent (moins de 3 mois).
                    Facture d'électricité, d'eau, de gaz, de téléphone fixe, avis d'imposition ou attestation d'assurance habitation.
                  </AlertDescription>
                </Alert>
                
                <div>
                  <Label htmlFor="proofOfAddress" className="block mb-2">Justificatif de domicile</Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6">
                    <div className="flex flex-col items-center">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {files.proofOfAddress ? files.proofOfAddress.name : "Déposez votre justificatif de domicile ici ou cliquez pour parcourir"}
                      </p>
                      <Label
                        htmlFor="proofOfAddress"
                        className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        Parcourir...
                      </Label>
                      <Input
                        id="proofOfAddress"
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,application/pdf"
                        className="hidden"
                        onChange={handleFileChange("proofOfAddress")}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("identity")}
                  >
                    Retour
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting || !files.proofOfAddress || (!files.idCard && !files.drivingLicense)}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      "Soumettre pour vérification"
                    )}
                  </Button>
                </div>
              </TabsContent>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 