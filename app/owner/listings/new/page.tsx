"use client"

import { useState } from "react"
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

// Car make options (would come from API)
const carMakes = [
  "Audi", "BMW", "Citroen", "Fiat", "Ford", "Honda", "Hyundai", "Kia", 
  "Mazda", "Mercedes", "Nissan", "Opel", "Peugeot", "Renault", "Seat", 
  "Skoda", "Toyota", "Volkswagen", "Volvo"
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
    year: "",
    doors: "",
    seats: "",
    transmission: "automatic",
    fuelType: "gasoline",
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
    setError("")
    setIsLoading(true)
    
    try {
      // Validation
      if (!formData.make || !formData.model || !formData.pricePerDay) {
        throw new Error("Please fill in all required fields")
      }
      
      if (images.length === 0) {
        throw new Error("Please upload at least one image of your car")
      }
      
      if (process.env.NODE_ENV === "production") {
        // Prepare form data for API
        const formDataToSend = new FormData();
        
        // Add car details
        formDataToSend.append('make', formData.make);
        formDataToSend.append('model', formData.model);
        formDataToSend.append('year', formData.year.toString());
        formDataToSend.append('doors', formData.doors.toString());
        formDataToSend.append('seats', formData.seats.toString());
        formDataToSend.append('transmission', formData.transmission);
        formDataToSend.append('fuel', formData.fuelType);
        formDataToSend.append('price', formData.pricePerDay.toString());
        formDataToSend.append('location', formData.location);
        formDataToSend.append('description', formData.description);
        
        // Add features
        Object.entries(formData.features).forEach(([key, value]) => {
          formDataToSend.append(`features[${key}]`, value.toString());
        });
        
        // Add images
        images.forEach((image, index) => {
          formDataToSend.append(`images[${index}]`, image);
        });
        
        // Add availability
        formDataToSend.append('availableImmediately', formData.availableImmediately.toString());
        
        // Send to API
        await carService.createCar(formDataToSend);
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
  
  // Redirect if not authenticated or not owner
  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }
  
  if (status === "authenticated" && !isOwner) {
    router.push("/dashboard")
    return null
  }
  
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
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Select 
                    name="fuelType" 
                    value={formData.fuelType} 
                    onValueChange={(value) => handleSelectChange("fuelType", value)}
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
                <Label htmlFor="pricePerDay">Price Per Day (€) <span className="text-red-500">*</span></Label>
                <Input 
                  id="pricePerDay" 
                  name="pricePerDay" 
                  type="number" 
                  value={formData.pricePerDay} 
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
                  id="availableImmediately" 
                  checked={formData.availableImmediately} 
                  onCheckedChange={handleAvailabilityToggle} 
                />
                <Label htmlFor="availableImmediately">Available immediately</Label>
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