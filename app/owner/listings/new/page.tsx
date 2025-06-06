"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Car, ArrowLeft, Upload, CheckCircle2, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { carService } from "@/lib/api"
import { useRealApi } from "@/lib/utils"

// Car make options (would come from API)
const carMakes = [
  "Audi", "BMW", "Citroen", "Fiat", "Ford", "Honda", "Hyundai", "Kia", 
  "Mazda", "Mercedes", "Nissan", "Opel", "Peugeot", "Renault", "Seat", 
  "Skoda", "Toyota", "Volkswagen", "Volvo"
]

// Car types
const carTypes = [
  "Citadine", "Berline", "SUV", "Break", "Coupé", "Cabriolet", "Monospace", "Utilitaire"
]

export default function NewCarListing() {
  const { user, isOwner, status } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear().toString(),
    type: "", // Added required car type field
    doors: "5",
    seats: "5",
    transmission: "Automatique",
    fuel: "Essence", // Changed from fuelType to fuel to match backend expectations
    price_per_day: "", // Changed from pricePerDay to price_per_day to match backend expectations
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
    available_immediately: true // Changed from availableImmediately to available_immediately to match backend expectations
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
      available_immediately: !prev.available_immediately 
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
    
    // Debug which fields are missing
    console.log("Field validation:", {
      make: Boolean(formData.make),
      model: Boolean(formData.model),
      type: Boolean(formData.type),
      price_per_day: Boolean(formData.price_per_day)
    })
    
    setError("")
    setIsLoading(true)
    
    try {
      // Validation
      if (!formData.make || !formData.model || !formData.price_per_day || !formData.type) {
        const missingFields = [];
        if (!formData.make) missingFields.push("make");
        if (!formData.model) missingFields.push("model");
        if (!formData.type) missingFields.push("type");
        if (!formData.price_per_day) missingFields.push("price_per_day");
        
        console.error("Missing required fields:", missingFields);
        throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`)
      }
      
      if (images.length === 0) {
        throw new Error("Please upload at least one image of your car")
      }
      
      if (useRealApi()) {
        // Create form data for file upload
        const carFormData = new FormData();
        
        // Add all text fields with proper field names expected by the backend
        carFormData.append('make', formData.make);
        carFormData.append('model', formData.model);
        carFormData.append('year', formData.year.toString());
        carFormData.append('type', formData.type);
        carFormData.append('doors', formData.doors.toString());
        carFormData.append('seats', formData.seats.toString());
        carFormData.append('transmission', formData.transmission);
        carFormData.append('fuel', formData.fuel);
        carFormData.append('price_per_day', formData.price_per_day.toString());
        carFormData.append('location', formData.location);
        carFormData.append('description', formData.description);
        
        // Add features as JSON
        carFormData.append('features', JSON.stringify(formData.features));
        
        // Add images
        images.forEach((image, index) => {
          carFormData.append(`images[${index}]`, image);
        });
        
        // Add availability
        carFormData.append('available_immediately', formData.available_immediately.toString());
        
        // Log what we're sending to help debug
        console.log("FormData being sent:", Array.from(carFormData.entries()))
        
        // Send to API
        const response = await carService.createCar(carFormData);
        console.log("Car created successfully:", response);
      } else {
        // For development - simulate image upload
        const uploadPromise = new Promise<void>((resolve) => {
          let progress = 0
          const interval = setInterval(() => {
            progress += 10
            setUploadProgress(progress)
            if (progress >= 100) {
              clearInterval(interval)
              resolve()
            }
          }, 300)
        })
        
        await uploadPromise
      }
      
      // Show success message
      setSuccess(true)
      
      // Redirect after success message
      setTimeout(() => {
        router.push("/owner/dashboard")
      }, 2000)
      
    } catch (err: any) {
      console.error("Error creating listing:", err)
      setError(err.response?.data?.message || (err instanceof Error ? err.message : "Failed to create listing"))
    } finally {
      setIsLoading(false)
    }
  }
  
  // Use useEffect for redirection to avoid React rendering errors
  useEffect(() => {
    router.push("/owner/cars/add")
  }, [router])
  
  // Return a loading state while redirecting
  return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => router.push("/owner/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="flex items-center mb-8">
          <Car className="h-6 w-6 text-red-600 mr-2" />
          <h1 className="text-2xl font-bold">Add a New Car</h1>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            <AlertDescription>Your car has been successfully added! Redirecting to dashboard...</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Car Details</CardTitle>
              <CardDescription>Enter the basic details about your car</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="make">Make <span className="text-red-500">*</span></Label>
                  <Select 
                    name="make" 
                    value={formData.make} 
                    onValueChange={(value) => handleSelectChange("make", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select make" />
                    </SelectTrigger>
                    <SelectContent>
                      {carMakes.map(make => (
                        <SelectItem key={make} value={make}>{make}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model">Model <span className="text-red-500">*</span></Label>
                  <Input 
                    id="model" 
                    name="model" 
                    value={formData.model} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Model 3, Series 5"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input 
                    id="year" 
                    name="year" 
                    type="number" 
                    value={formData.year} 
                    onChange={handleInputChange} 
                    placeholder="e.g. 2020"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Type <span className="text-red-500">*</span></Label>
                  <Select 
                    name="type" 
                    value={formData.type} 
                    onValueChange={(value) => handleSelectChange("type", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select car type" />
                    </SelectTrigger>
                    <SelectContent>
                      {carTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doors">Doors</Label>
                    <Input 
                      id="doors" 
                      name="doors" 
                      type="number" 
                      value={formData.doors} 
                      onChange={handleInputChange} 
                      placeholder="e.g. 4"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="seats">Seats</Label>
                    <Input 
                      id="seats" 
                      name="seats" 
                      type="number" 
                      value={formData.seats} 
                      onChange={handleInputChange} 
                      placeholder="e.g. 5"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="transmission">Transmission</Label>
                  <Select 
                    name="transmission" 
                    value={formData.transmission} 
                    onValueChange={(value) => handleSelectChange("transmission", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="semi-automatic">Semi-automatic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fuel">Fuel Type</Label>
                  <Select 
                    name="fuel" 
                    value={formData.fuel} 
                    onValueChange={(value) => handleSelectChange("fuel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gasoline">Gasoline</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price_per_day">Price Per Day (€) <span className="text-red-500">*</span></Label>
                <Input 
                  id="price_per_day" 
                  name="price_per_day" 
                  type="number" 
                  value={formData.price_per_day} 
                  onChange={handleInputChange} 
                  placeholder="e.g. 50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Paris, France"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  placeholder="Describe your car and any special features..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>Select the features your car has</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(formData.features).map(([feature, value]) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Switch 
                      id={feature} 
                      checked={value} 
                      onCheckedChange={() => handleFeatureToggle(feature)} 
                    />
                    <Label htmlFor={feature} className="capitalize">
                      {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <CardDescription>Upload photos of your car (minimum 1)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <Input 
                    id="images" 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="hidden" 
                    onChange={handleImageChange}
                  />
                  <Label htmlFor="images" className="cursor-pointer">
                    <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB each)</p>
                  </Label>
                </div>
                
                {images.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Selected Images ({images.length})</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <div className="h-24 bg-gray-100 rounded-md overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                              {image.name}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm"
                            onClick={() => removeImage(index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {isLoading && uploadProgress > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Uploading...</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 text-right">{uploadProgress}%</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
              <CardDescription>Set when your car is available for rental</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="available_immediately" 
                  checked={formData.available_immediately} 
                  onCheckedChange={handleAvailabilityToggle} 
                />
                <Label htmlFor="available_immediately">Available immediately</Label>
              </div>
              <p className="text-sm text-gray-500 mt-2 flex items-center">
                <Info className="h-4 w-4 mr-1" />
                You can set specific availability dates in the calendar after creating the listing
              </p>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push("/owner/dashboard")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Listing"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 