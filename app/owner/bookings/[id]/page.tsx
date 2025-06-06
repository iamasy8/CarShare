"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Car, Calendar, MapPin, User, Clock, CreditCard, MessageCircle, CheckCircle2, X, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { bookingService, Booking as ApiBooking } from "@/lib/api"
import { useRealApi } from "@/lib/utils"
import React from "react"
import { BackButton } from "@/components/ui/back-button"

// Define a local booking type that includes UI-specific fields
interface BookingDetails {
  id: number;
  car: {
    id: number;
    title: string;
    image: string;
    location: string;
  };
  client: {
    id: number;
    name: string;
    rating: number;
    joined: string;
    image: string;
    phone: string;
  };
  status: string;
  startDate: string;
  endDate: string;
  pickupTime: string;
  returnTime: string;
  days: number;
  pricePerDay: number;
  total: number;
  createdAt: string;
  notes: string;
}

// Mock booking data for development - will be removed in production
const mockBooking: BookingDetails = {
  id: 101,
  car: {
    id: 1,
    title: "Tesla Model 3",
    image: "/cars/tesla.jpg",
    location: "Paris, France"
  },
  client: {
    id: 201,
    name: "Jean Dupont",
    rating: 4.7,
    joined: "January 2022",
    image: "/avatars/client.png",
    phone: "+33 6 12 34 56 78"
  },
  status: "pending",
  startDate: "2023-08-15",
  endDate: "2023-08-18",
  pickupTime: "10:00",
  returnTime: "18:00",
  days: 3,
  pricePerDay: 75,
  total: 225,
  createdAt: "2023-08-01T14:32:00Z",
  notes: "This is my first time using the service. I'll take good care of your car!"
}

// Convert API booking to UI booking format
const convertApiBookingToUI = (apiBooking: ApiBooking): BookingDetails => {
  // In a real implementation, this would map the API data structure to the UI data structure
  // For now we'll just cast it as any since we're using mock data
  // This would be properly implemented when the real API is connected
  const days = Math.ceil((new Date(apiBooking.endDate).getTime() - new Date(apiBooking.startDate).getTime()) / (1000 * 60 * 60 * 24));
  const pricePerDay = apiBooking.totalPrice / days;
  
  return {
    ...apiBooking,
    car: {
      id: apiBooking.carId,
      title: "Car Title", // Would come from API
      image: "/placeholder.jpg",
      location: "Location" // Would come from API
    },
    client: {
      id: apiBooking.clientId,
      name: "Client Name", // Would come from API
      rating: 5,
      joined: "January 2022",
      image: "/placeholder.jpg",
      phone: "+1234567890"
    },
    // Add other required fields with defaults
    pickupTime: "10:00",
    returnTime: "18:00",
    days: days,
    pricePerDay: pricePerDay,
    total: apiBooking.totalPrice,
    notes: ""
  } as unknown as BookingDetails;
};

export default function BookingDetails({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const resolvedParams = React.use(params)
  const bookingId = resolvedParams.id
  
  const { isOwner, status } = useAuth()
  const router = useRouter()
  const [booking, setBooking] = useState<BookingDetails>(mockBooking)
  const [isLoading, setIsLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  // Fetch booking data
  useEffect(() => {
    const fetchBooking = async () => {
      setIsLoading(true)
      setError("")
      
      try {
        if (useRealApi()) {
          // In production, use the actual API
          const apiBooking = await bookingService.getBooking(Number(bookingId))
          // Convert API response to UI format
          setBooking(convertApiBookingToUI(apiBooking))
        } else {
          // For development, use the mock data
          setBooking(mockBooking)
          // Simulate network latency
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      } catch (err: any) {
        console.error("Error fetching booking:", err)
        setError(err.response?.data?.message || "Failed to load booking details. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
    
    if (bookingId) {
      fetchBooking()
    }
  }, [bookingId])
  
  // Approve booking
  const handleApprove = async () => {
    setActionLoading("approve")
    setError("")
    setSuccess("")
    
    try {
      if (useRealApi()) {
        // In production, use the actual API
        const updatedApiBooking = await bookingService.updateBookingStatus(Number(bookingId), "confirmed")
        // Convert API response to UI format
        setBooking(convertApiBookingToUI(updatedApiBooking))
      } else {
        // For development, simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setBooking(prev => ({ ...prev, status: "confirmed" }))
      }
      
      setSuccess("Booking successfully approved!")
    } catch (err: any) {
      console.error("Error approving booking:", err)
      setError(err.response?.data?.message || "Failed to approve booking. Please try again.")
    } finally {
      setActionLoading("")
    }
  }
  
  // Reject booking
  const handleReject = async () => {
    setActionLoading("reject")
    setError("")
    setSuccess("")
    
    try {
      if (useRealApi()) {
        // In production, use the actual API
        const updatedApiBooking = await bookingService.updateBookingStatus(Number(bookingId), "rejected")
        // Convert API response to UI format
        setBooking(convertApiBookingToUI(updatedApiBooking))
      } else {
        // For development, simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setBooking(prev => ({ ...prev, status: "rejected" }))
      }
      
      setSuccess("Booking rejected")
      
      // Redirect after rejection
      setTimeout(() => {
        router.push("/owner/bookings")
      }, 2000)
    } catch (err: any) {
      console.error("Error rejecting booking:", err)
      setError(err.response?.data?.message || "Failed to reject booking. Please try again.")
    } finally {
      setActionLoading("")
    }
  }
  
  // Message functionality removed
  
  // Redirect if not authenticated or not owner
  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }
  
  if (status === "authenticated" && !isOwner) {
    router.push("/dashboard")
    return null
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading booking details...</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <BackButton 
          className="mb-6" 
          label="Back to Bookings"
        />
        
        <div className="flex items-center mb-8">
          <Calendar className="h-6 w-6 text-red-600 mr-2" />
          <h1 className="text-2xl font-bold">Booking Details</h1>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Booking #{booking.id}</CardTitle>
                  <Badge
                    className={
                      booking.status === "confirmed" ? "bg-green-100 text-green-800" :
                      booking.status === "pending" ? "bg-amber-100 text-amber-800" :
                      booking.status === "completed" ? "bg-blue-100 text-blue-800" :
                      booking.status === "rejected" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="rounded-md w-20 h-20 bg-gray-100 flex-shrink-0">
                    {/* Car image would go here */}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{booking.car.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {booking.car.location}
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 border-t border-b py-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Pickup Date</h4>
                    <p className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {new Date(booking.startDate).toLocaleDateString()} at {booking.pickupTime}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Return Date</h4>
                    <p className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {new Date(booking.endDate).toLocaleDateString()} at {booking.returnTime}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                  <p className="mt-1">{booking.days} {booking.days > 1 ? 'days' : 'day'}</p>
                </div>
                
                {booking.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Client Notes</h4>
                    <p className="mt-1 text-sm p-3 bg-gray-50 rounded-md">{booking.notes}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Booking Created</h4>
                  <p className="flex items-center mt-1 text-sm">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    {new Date(booking.createdAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
              
              {booking.status === "pending" && (
                <CardFooter className="border-t pt-6 flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handleReject}
                    disabled={!!actionLoading}
                  >
                    {actionLoading === "reject" ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={handleApprove}
                    disabled={!!actionLoading}
                  >
                    {actionLoading === "approve" ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve
                      </>
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Client Communication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-100">
                    {/* Client image would go here */}
                  </div>
                  <div>
                    <h3 className="font-medium">Message {booking.client.name}</h3>
                    <p className="text-sm text-gray-500">Questions about the booking? Send a message to the client.</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Textarea
                    placeholder="Type your message here..."
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => setSuccess("Messaging functionality is temporarily unavailable.")}
                      disabled={!message.trim() || !!actionLoading}
                    >
                      <>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Price per day</span>
                  <span>€{booking.pricePerDay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Days</span>
                  <span>{booking.days}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span>€{booking.total}</span>
                </div>
                
                <div className="mt-6 p-3 bg-blue-50 rounded-md text-sm text-blue-800 flex items-start">
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                  <p>You will receive payment after the rental is completed.</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100">
                    {/* Client image would go here */}
                  </div>
                  <div>
                    <h3 className="font-medium">{booking.client.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span className="mr-1">★</span>
                      <span>{booking.client.rating}</span>
                      <span className="mx-1">•</span>
                      <span>Member since {booking.client.joined}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Verified Identity</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Verified Payment</span>
                  </div>
                </div>
                
                {booking.status === "confirmed" && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                    <p className="text-sm">{booking.client.phone}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 