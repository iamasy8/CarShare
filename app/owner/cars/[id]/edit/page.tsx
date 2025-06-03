"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Upload, CheckCircle2, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { carService } from "@/lib/api/cars/carService"
import { useRealApi } from "@/lib/utils"
import { RouteProtection } from "@/components/route-protection"
import { sanitizeImageUrl } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

// Car make options
const carMakes = [
  "Audi", "BMW", "Citroen", "Dacia", "Fiat", "Ford", "Honda", "Hyundai", "Kia", 
  "Mazda", "Mercedes", "Nissan", "Opel", "Peugeot", "Renault", "Seat", 
  "Skoda", "Toyota", "Volkswagen", "Volvo"
]

// Car types
const carTypes = [
  "Citadine", "Berline", "SUV", "Break", "Coupé", "Cabriolet", "Monospace", "Utilitaire"
]

// Fuel types
const fuelTypes = [
  "Essence", "Diesel", "Hybride", "Électrique", "GPL"
]

// Transmission types
const transmissionTypes = [
  "Manuelle", "Automatique"
]

// Define car type to match our API response
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
  features?: any
  images?: string[]
  status?: string
  bookings_count?: number
  reviews_count?: number
  rating?: number
  [key: string]: any // Allow for other properties
}

export default function EditCarPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([])
  
  // Form state
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear().toString(),
    type: "",
    doors: "5",
    seats: "5",
    transmission: "Automatique",
    fuel: "Essence",
    price_per_day: "50", // Using snake_case to match the backend API's expected field name
    location: "",
    description: "",
    features: {
      airConditioning: true,
      gps: false,
      bluetooth: true,
      usbCharger: true,
      childSeat: false,
      sunroof: false
    },
    availableImmediately: true
  })
  
  // Image upload state
  const [newImages, setNewImages] = useState<File[]>([])
  
  // Fetch car data on mount
  useEffect(() => {
    if (params?.id) {
      fetchCarDetails()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id])
  
  const fetchCarDetails = async () => {
    setIsFetching(true)
    setError("")
    try {
      const carId = params?.id ? Number(Array.isArray(params.id) ? params.id[0] : params.id) : 0
      
      if (useRealApi()) {
        const response: ApiCarResponse = await carService.getCar(carId)
        
        // Set existing images
        if (response.images && Array.isArray(response.images)) {
          setExistingImages(response.images)
        }
        
        // Map API features to our format if needed
        let mappedFeatures = {
          airConditioning: false,
          gps: false,
          bluetooth: false,
          usbCharger: false,
          childSeat: false,
          sunroof: false
        }
        
        // If features is an array of strings, map them to our object format
        if (Array.isArray(response.features)) {
          response.features.forEach(feature => {
            if (feature.toLowerCase().includes('clim')) mappedFeatures.airConditioning = true
            if (feature.toLowerCase().includes('gps')) mappedFeatures.gps = true
            if (feature.toLowerCase().includes('bluetooth')) mappedFeatures.bluetooth = true
            if (feature.toLowerCase().includes('usb')) mappedFeatures.usbCharger = true
            if (feature.toLowerCase().includes('enfant') || feature.toLowerCase().includes('bébé')) mappedFeatures.childSeat = true
            if (feature.toLowerCase().includes('toit')) mappedFeatures.sunroof = true
          })
        } else if (typeof response.features === 'object' && response.features !== null) {
          // If features is already an object, use it directly
          mappedFeatures = {
            ...mappedFeatures,
            ...response.features
          }
        }
        
        // Update form data with car details
        setFormData({
          make: response.make || "",
          model: response.model || "",
          year: response.year?.toString() || new Date().getFullYear().toString(),
          type: response.type || "",
          doors: response.doors?.toString() || "5",
          seats: response.seats?.toString() || "5",
          transmission: response.transmission || "Automatique",
          fuel: response.fuel || "Essence",
          price_per_day: (response.price_per_day || response.price || 50).toString(),
          location: response.location || "",
          description: response.description || "",
          features: mappedFeatures,
          availableImmediately: true // Default to true since we don't have this info
        })
      } else {
        // Mock data for development
        setTimeout(() => {
          setExistingImages(["/placeholder.svg", "/placeholder.svg"])
          setFormData({
            make: "Renault",
            model: "Clio",
            year: "2020",
            type: "Berline",
            doors: "5",
            seats: "5",
            transmission: "Automatique",
            fuel: "Essence",
            price_per_day: "35",
            location: "Paris, France",
            description: "Une voiture compacte idéale pour la ville.",
            features: {
              airConditioning: true,
              gps: true,
              bluetooth: true,
              usbCharger: true,
              childSeat: false,
              sunroof: false
            },
            availableImmediately: true
          })
          setIsFetching(false)
        }, 500)
      }
    } catch (err: any) {
      console.error("Error fetching car details:", err)
      setError(err.message || "Impossible de charger les détails du véhicule")
    } finally {
      setIsFetching(false)
    }
  }
  
  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature as keyof typeof prev.features]
      }
    }))
  }
  
  const handleAvailabilityToggle = () => {
    setFormData(prev => ({ 
      ...prev, 
      availableImmediately: !prev.availableImmediately 
    }))
  }
  
  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files)
      setNewImages(prev => [...prev, ...fileArray])
    }
  }
  
  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index))
  }
  
  const toggleExistingImageDelete = (index: number) => {
    setImagesToDelete(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index)
      } else {
        return [...prev, index]
      }
    })
  }
  
  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting form data:", formData)
    
    if (existingImages.length === 0 && newImages.length === 0) {
      setError("Veuillez télécharger au moins une image de votre véhicule")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      const carId = params?.id ? Number(Array.isArray(params.id) ? params.id[0] : params.id) : 0
      
      // Create form data for file upload
      const carFormData = new FormData()
      
      // Add all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'features') {
          // Handle features object by converting to JSON
          carFormData.append(key, JSON.stringify(value))
        } else {
          carFormData.append(key, String(value))
        }
      })
      
      // Add images to delete if any
      if (imagesToDelete.length > 0) {
        carFormData.append('images_to_delete', JSON.stringify(imagesToDelete))
      }
      
      // Add new images if any
      newImages.forEach((image, index) => {
        carFormData.append(`new_images[${index}]`, image)
      })
      
      console.log("FormData being sent:", Array.from(carFormData.entries()))
      
      if (useRealApi()) {
        const response = await carService.updateCar(carId, carFormData)
        console.log("Car updated successfully:", response)
        setSuccess(true)
        toast({
          title: "Véhicule mis à jour",
          description: "Les modifications ont été enregistrées avec succès.",
        })
        setTimeout(() => {
          router.push(`/owner/cars/${carId}`)
        }, 2000)
      } else {
        // Simulate upload and success
        setTimeout(() => {
          setSuccess(true)
          toast({
            title: "Véhicule mis à jour",
            description: "Les modifications ont été enregistrées avec succès.",
          })
          setTimeout(() => {
            router.push(`/owner/cars/${carId}`)
          }, 2000)
          setIsLoading(false)
        }, 1500)
      }
    } catch (err: any) {
      console.error("Error updating car:", err)
      setError(err.message || "Échec de la mise à jour du véhicule. Veuillez réessayer.")
      window.scrollTo({ top: 0, behavior: 'smooth' })
      toast({
        title: "Erreur",
        description: err.message || "Échec de la mise à jour du véhicule. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  if (isFetching) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p>Chargement des détails du véhicule...</p>
        </div>
      </div>
    )
  }
  
  return (
    <RouteProtection requiredRoles={["owner"]}>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          
          <h1 className="text-2xl font-bold">Modifier votre véhicule</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Mettez à jour les informations de votre véhicule
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 bg-green-100 dark:bg-green-900 border-green-500">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-600 dark:text-green-400">
              Votre véhicule a été mis à jour avec succès! Redirection...
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-6">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Informations du véhicule</CardTitle>
                <CardDescription>
                  Entrez les détails de votre véhicule pour le mettre à jour
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="make">Marque</Label>
                      <Select 
                        name="make" 
                        value={formData.make} 
                        onValueChange={(value) => handleSelectChange('make', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une marque" />
                        </SelectTrigger>
                        <SelectContent>
                          {carMakes.map(make => (
                            <SelectItem key={make} value={make}>{make}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="model">Modèle</Label>
                      <Input 
                        id="model" 
                        name="model" 
                        value={formData.model} 
                        onChange={handleInputChange} 
                        placeholder="ex: Clio, Golf, 3008..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="year">Année</Label>
                      <Input 
                        id="year" 
                        name="year" 
                        type="number" 
                        value={formData.year} 
                        onChange={handleInputChange} 
                        min="2000" 
                        max={new Date().getFullYear()} 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="type">Type de véhicule</Label>
                      <Select 
                        name="type" 
                        value={formData.type} 
                        onValueChange={(value) => handleSelectChange('type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          {carTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="price_per_day">Prix par jour (€)</Label>
                      <Input 
                        id="price_per_day" 
                        name="price_per_day" 
                        type="number" 
                        value={formData.price_per_day} 
                        onChange={handleInputChange} 
                        min="10" 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Emplacement</Label>
                      <Input 
                        id="location" 
                        name="location" 
                        value={formData.location} 
                        onChange={handleInputChange} 
                        placeholder="ex: Paris, France"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="seats">Nombre de places</Label>
                        <Input 
                          id="seats" 
                          name="seats" 
                          type="number" 
                          value={formData.seats} 
                          onChange={handleInputChange} 
                          min="1" 
                          max="9"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="doors">Nombre de portes</Label>
                        <Input 
                          id="doors" 
                          name="doors" 
                          type="number" 
                          value={formData.doors} 
                          onChange={handleInputChange} 
                          min="2" 
                          max="5"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fuel">Carburant</Label>
                        <Select 
                          name="fuel" 
                          value={formData.fuel} 
                          onValueChange={(value) => handleSelectChange('fuel', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            {fuelTypes.map(fuel => (
                              <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="transmission">Transmission</Label>
                        <Select 
                          name="transmission" 
                          value={formData.transmission} 
                          onValueChange={(value) => handleSelectChange('transmission', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            {transmissionTypes.map(transmission => (
                              <SelectItem key={transmission} value={transmission}>{transmission}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    placeholder="Décrivez votre véhicule en quelques mots..."
                    rows={4}
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Images existantes</h3>
                  {existingImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                      {existingImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className={`aspect-video relative rounded-md overflow-hidden border-2 ${imagesToDelete.includes(index) ? 'border-red-500 opacity-50' : 'border-transparent'}`}>
                            <Image 
                              src={sanitizeImageUrl(image)} 
                              alt={`Image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant={imagesToDelete.includes(index) ? "destructive" : "outline"}
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => toggleExistingImageDelete(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {imagesToDelete.includes(index) && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-red-500 font-medium">À supprimer</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Aucune image existante</p>
                  )}
                  
                  <h3 className="text-lg font-medium mb-4">Ajouter de nouvelles images</h3>
                  <div className="grid gap-4">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-500 dark:text-gray-400" />
                      <Label htmlFor="images" className="cursor-pointer">
                        <span className="text-blue-600 dark:text-blue-400 hover:underline">Cliquez pour télécharger</span> ou glissez-déposez
                      </Label>
                      <Input 
                        id="images" 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handleNewImageChange} 
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        PNG, JPG ou JPEG jusqu'à 5MB
                      </p>
                    </div>
                    
                    {newImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {newImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-video relative rounded-md overflow-hidden">
                              <Image 
                                src={URL.createObjectURL(image)} 
                                alt={`Nouvelle image ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => removeNewImage(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Caractéristiques</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="airConditioning" 
                        checked={formData.features.airConditioning} 
                        onCheckedChange={() => handleFeatureToggle('airConditioning')}
                      />
                      <Label htmlFor="airConditioning">Climatisation</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="gps" 
                        checked={formData.features.gps} 
                        onCheckedChange={() => handleFeatureToggle('gps')}
                      />
                      <Label htmlFor="gps">GPS</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="bluetooth" 
                        checked={formData.features.bluetooth} 
                        onCheckedChange={() => handleFeatureToggle('bluetooth')}
                      />
                      <Label htmlFor="bluetooth">Bluetooth</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="usbCharger" 
                        checked={formData.features.usbCharger} 
                        onCheckedChange={() => handleFeatureToggle('usbCharger')}
                      />
                      <Label htmlFor="usbCharger">Chargeur USB</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="childSeat" 
                        checked={formData.features.childSeat} 
                        onCheckedChange={() => handleFeatureToggle('childSeat')}
                      />
                      <Label htmlFor="childSeat">Siège enfant</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="sunroof" 
                        checked={formData.features.sunroof} 
                        onCheckedChange={() => handleFeatureToggle('sunroof')}
                      />
                      <Label htmlFor="sunroof">Toit ouvrant</Label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Disponibilité</h3>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="availableImmediately" 
                      checked={formData.availableImmediately} 
                      onCheckedChange={handleAvailabilityToggle}
                    />
                    <Label htmlFor="availableImmediately">Disponible immédiatement</Label>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Si activé, votre véhicule sera disponible à la réservation dès son approbation.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span> 
                      Mise à jour en cours...
                    </>
                  ) : "Mettre à jour ce véhicule"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </RouteProtection>
  )
}
