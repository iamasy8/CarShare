"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Upload, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { carService } from "@/lib/api"
import { useRealApi } from "@/lib/utils"
import { RouteProtection } from "@/components/route-protection"

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

export default function AddCarPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear().toString(),
    type: "",
    doors: "5",
    seats: "5",
    transmission: "Automatique",
    fuelType: "Essence",
    pricePerDay: "",
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
  const [images, setImages] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  
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
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files)
      setImages(prev => [...prev, ...fileArray])
    }
  }
  
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }
  
  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting form data:", formData)
    
    if (images.length === 0) {
      setError("Please upload at least one image of your car")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
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
      
      // Add images
      images.forEach((image, index) => {
        carFormData.append(`images[${index}]`, image)
      })
      
      // Use the carService to create the car
      if (useRealApi()) {
        const response = await carService.createCar(carFormData)
        console.log("Car created successfully:", response)
          
          // Show success message
        setSuccess(true)
          
        // Redirect after 2 seconds
          setTimeout(() => {
          router.push("/owner/cars")
        }, 2000)
      } else {
        // For development - simulate image upload
        const uploadPromise = new Promise<void>((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);
            if (progress >= 100) {
              clearInterval(interval);
              resolve();
            }
          }, 300);
        });
        
        await uploadPromise;
        
        // Simulate success
        setSuccess(true);
        
        // Redirect after success message
        setTimeout(() => {
          router.push("/owner/cars");
        }, 2000);
      }
    } catch (err: any) {
      console.error("Error creating car:", err);
      setError(err.message || "Échec de l'ajout du véhicule. Veuillez réessayer.");
      
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <RouteProtection requiredRoles={["owner", "admin", "superadmin"]}>
      <div className="container py-10">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => router.push("/owner/cars")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à mes véhicules
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Ajouter un véhicule</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Ajoutez un nouveau véhicule à votre flotte</p>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              <AlertDescription>Votre véhicule a été ajouté avec succès et sera examiné par notre équipe.</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations du véhicule</CardTitle>
                <CardDescription>Entrez les informations de base de votre véhicule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="make">Marque <span className="text-red-500">*</span></Label>
                    <Select 
                      name="make" 
                      value={formData.make} 
                      onValueChange={(value) => handleSelectChange("make", value)}
                      required
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="model">Modèle <span className="text-red-500">*</span></Label>
                    <Input 
                      id="model" 
                      name="model" 
                      value={formData.model} 
                      onChange={handleInputChange} 
                      placeholder="Ex: Clio, Golf, 308..."
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Année</Label>
                    <Input 
                      id="year" 
                      name="year" 
                      type="number" 
                      min="1900" 
                      max={new Date().getFullYear()} 
                      value={formData.year} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de véhicule</Label>
                    <Select 
                      name="type" 
                      value={formData.type} 
                      onValueChange={(value) => handleSelectChange("type", value)}
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="pricePerDay">Prix par jour (€) <span className="text-red-500">*</span></Label>
                    <Input 
                      id="pricePerDay" 
                      name="pricePerDay" 
                      type="number" 
                      min="1" 
                      value={formData.pricePerDay} 
                      onChange={handleInputChange} 
                      placeholder="Ex: 50"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Localisation <span className="text-red-500">*</span></Label>
                  <Input 
                    id="location" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleInputChange} 
                    placeholder="Ex: Paris, France"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seats">Nombre de places</Label>
                    <Input 
                      id="seats" 
                      name="seats" 
                      type="number" 
                      min="1" 
                      max="9" 
                      value={formData.seats} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="doors">Nombre de portes</Label>
                    <Input 
                      id="doors" 
                      name="doors" 
                      type="number" 
                      min="1" 
                      max="5" 
                      value={formData.doors} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select 
                      name="transmission" 
                      value={formData.transmission} 
                      onValueChange={(value) => handleSelectChange("transmission", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {transmissionTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Type de carburant</Label>
                    <Select 
                      name="fuelType" 
                      value={formData.fuelType} 
                      onValueChange={(value) => handleSelectChange("fuelType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {fuelTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    placeholder="Décrivez votre véhicule, son état, ses particularités..."
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Photos du véhicule</CardTitle>
                <CardDescription>Ajoutez des photos de votre véhicule (max 10 photos)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Déposez vos photos ici</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Formats acceptés: JPG, PNG. Taille maximale: 5MB par image.
                  </p>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById('images')?.click()}
                  >
                    Parcourir les fichiers
                  </Button>
                </div>
                
                {images.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">Images sélectionnées ({images.length}/10)</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={URL.createObjectURL(image)} 
                            alt={`Car image ${index + 1}`} 
                            className="w-full h-24 object-cover rounded-md"
                            crossOrigin="anonymous"
                            onError={(e) => {
                              console.error(`Failed to load image preview: ${image.name}`);
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={() => removeImage(index)}
                          >
                            &times;
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Équipements et disponibilité</CardTitle>
                <CardDescription>Indiquez les équipements disponibles et la disponibilité du véhicule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Équipements</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                      Ajout en cours...
                    </>
                  ) : "Ajouter ce véhicule"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </RouteProtection>
  )
} 