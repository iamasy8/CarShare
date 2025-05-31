"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { 
  Car, Calendar, CreditCard, UserCircle, BellRing,
  FileEdit, LogOut, TrendingUp, ExternalLink, CheckCircle2,
  Clock, MoreHorizontal
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { bookingService, carService } from "@/lib/api"
import { ownerDashboardHelpers, bookingHelpers, handleApiError, DashboardSummary, Notification } from "@/lib/api-helpers"
import { handleError, useRealApi } from "@/lib/utils"

// Define a type for our mock bookings to match the expected structure
interface MockBooking {
  id: number;
  car: string;
  client: string;
  status: string;
  startDate: string;
  endDate: string;
  total: number;
}

// Helper to convert API bookings to our MockBooking format
const convertApiBookingToMockBooking = (booking: any): MockBooking => ({
  id: booking.id,
  car: booking.car?.title || `Car #${booking.carId}`,
  client: booking.client?.name || `Client #${booking.clientId}`,
  status: booking.status,
  startDate: typeof booking.startDate === 'string' 
    ? booking.startDate.split('T')[0] 
    : new Date(booking.startDate).toISOString().split('T')[0],
  endDate: typeof booking.endDate === 'string'
    ? booking.endDate.split('T')[0]
    : new Date(booking.endDate).toISOString().split('T')[0],
  total: booking.totalPrice
});

// Mock data for development - will be replaced with API calls
const mockListings = [
  { id: 1, title: "Tesla Model 3", status: "active", price: 75, bookings: 12, rating: 4.8, image: "/cars/tesla.jpg" },
  { id: 2, title: "BMW Series 3", status: "active", price: 65, bookings: 8, rating: 4.5, image: "/cars/bmw.jpg" },
  { id: 3, title: "Mercedes Class C", status: "pending", price: 70, bookings: 0, rating: 0, image: "/cars/mercedes.jpg" },
];

// Update the mock bookings with proper typing
const mockBookings: MockBooking[] = [
  { id: 101, car: "Tesla Model 3", client: "Jean Dupont", status: "confirmed", startDate: "2023-08-10", endDate: "2023-08-12", total: 225 },
  { id: 102, car: "BMW Series 3", client: "Marie Martin", status: "pending", startDate: "2023-08-15", endDate: "2023-08-18", total: 260 },
  { id: 103, car: "Tesla Model 3", client: "Philippe Leclerc", status: "completed", startDate: "2023-07-28", endDate: "2023-07-30", total: 225 },
];

const mockNotifications = [
  { id: 201, type: "booking", message: "New booking request for Tesla Model 3", time: "2h ago", read: false },
  { id: 202, type: "system", message: "Your account subscription will renew in 3 days", time: "1d ago", read: false },
  { id: 203, type: "review", message: "You received a new 5-star review", time: "2d ago", read: true },
];

const mockEarnings = {
  monthly: 1245,
  yearly: 15420,
  pending: 485,
  history: [
    { month: "Jan", amount: 1100 },
    { month: "Feb", amount: 1200 },
    { month: "Mar", amount: 900 },
    { month: "Apr", amount: 1500 },
    { month: "May", amount: 1300 },
    { month: "Jun", amount: 1245 },
  ]
};

export default function OwnerDashboard() {
  const { user, logout, isOwner, status } = useAuth()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<{
    activeListings: number;
    pendingBookings: number;
    totalEarnings: number;
    pendingEarnings: number;
    recentBookings: MockBooking[];
    notifications: Notification[];
  }>({
    activeListings: 0,
    pendingBookings: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    recentBookings: [],
    notifications: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Improved unread message count functionality
  const getUnreadMessagesCount = async (): Promise<number> => {
    try {
      if (useRealApi()) {
        // In production, this would call the API
        const response = await fetch('/api/messages/unread/count')
        const data = await response.json()
        return data.count
      } else {
        // Mock data for development
        return mockNotifications.filter(n => !n.read).length
      }
    } catch (error) {
      console.error("Failed to get unread message count:", error)
      return 0
    }
  }
  
  // Fetch owner dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (status === "authenticated" && isOwner) {
        if (useRealApi()) {
          setIsLoading(true);
          setError("");
          
          try {
            // Fetch listings
            const listings = await carService.getOwnerCars();
            const activeListings = listings.filter(l => l.status === "approved").length;
            
            // Fetch bookings
            const bookings = await bookingService.getBookings();
            const pendingBookings = bookings.filter(b => b.status === "pending").length;
            
            // Calculate earnings
            const earnings = ownerDashboardHelpers.calculateEarningsSummary(bookings);
            
            // Get recent bookings (last 3) and map to MockBooking format for consistency
            const recentBookings: MockBooking[] = bookings
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 3)
              .map(booking => convertApiBookingToMockBooking(booking));
            
            // Get unread message count
            const unreadCount = await getUnreadMessagesCount();
            
            // Get notifications with proper read/unread status
            const notifications = await fetch('/api/notifications').then(res => res.json());
            
            setDashboardData({
              activeListings,
              pendingBookings,
              totalEarnings: earnings.monthly,
              pendingEarnings: earnings.pending,
              recentBookings,
              notifications
            });
          } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError(handleError(err, "Failed to load dashboard data"));
          } finally {
            setIsLoading(false);
          }
        } else {
          // For development, use mock data
          const unreadCount = await getUnreadMessagesCount();
          
          setDashboardData({
            activeListings: mockListings.filter(l => l.status === "active").length,
            pendingBookings: mockBookings.filter(b => b.status === "pending").length,
            totalEarnings: mockEarnings.monthly,
            pendingEarnings: mockEarnings.pending,
            recentBookings: mockBookings,
            notifications: mockNotifications as Notification[]
          });
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      }
    };
    
    fetchDashboardData();
  }, [status, isOwner]);
  
  // Handle booking approval - update function to handle our mock booking type
  const handleApproveBooking = async (bookingId: number) => {
    try {
      if (useRealApi()) {
        await bookingService.updateBookingStatus(bookingId, "confirmed");
        
        // Refresh dashboard data
        const bookings = await bookingService.getBookings();
        const pendingBookings = bookings.filter(b => b.status === "pending").length;
        const recentBookings = bookings.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 3);
        
        // Convert API bookings to our MockBooking format with proper typing
        const updatedBookings: MockBooking[] = recentBookings.map(booking => convertApiBookingToMockBooking(booking));
        
        setDashboardData(prev => ({
          ...prev,
          pendingBookings,
          recentBookings: updatedBookings
        }));
      } else {
        // For development, update the mock data
        setDashboardData(prev => {
          const updatedBookings: MockBooking[] = prev.recentBookings.map(booking => 
            booking.id === bookingId ? { ...booking, status: "confirmed" } : booking
          );
          
          return {
            ...prev,
            pendingBookings: prev.pendingBookings - 1,
            recentBookings: updatedBookings
          };
        });
      }
    } catch (err) {
      console.error(`Error approving booking ${bookingId}:`, err);
      // In a real app, you would show an error notification
    }
  }
  
  // Handle booking rejection - update function to handle our mock booking type
  const handleRejectBooking = async (bookingId: number) => {
    try {
      if (useRealApi()) {
        await bookingService.updateBookingStatus(bookingId, "rejected");
        
        // Refresh dashboard data
        const bookings = await bookingService.getBookings();
        const pendingBookings = bookings.filter(b => b.status === "pending").length;
        const recentBookings = bookings.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 3);
        
        // Convert API bookings to our MockBooking format with proper typing
        const updatedBookings: MockBooking[] = recentBookings.map(booking => convertApiBookingToMockBooking(booking));
        
        setDashboardData(prev => ({
          ...prev,
          pendingBookings,
          recentBookings: updatedBookings
        }));
      } else {
        // For development, update the mock data
        setDashboardData(prev => {
          const updatedBookings: MockBooking[] = prev.recentBookings.map(booking => 
            booking.id === bookingId ? { ...booking, status: "rejected" } : booking
          );
          
          return {
            ...prev,
            pendingBookings: prev.pendingBookings - 1,
            recentBookings: updatedBookings
          };
        });
      }
    } catch (err) {
      console.error(`Error rejecting booking ${bookingId}:`, err);
      // In a real app, you would show an error notification
    }
  }
  
  // Add new car listing
  const handleAddCar = () => {
    router.push("/owner/listings/new")
  }
  
  // Redirect if not owner
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }
  
  if (status === "authenticated" && !isOwner) {
    router.push("/dashboard");
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-30 w-full bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-red-600" />
            <h1 className="text-xl font-bold">Owner Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
              <span className="font-medium">{user?.name}</span>
              <span className="mx-1">•</span>
              <span>Owner Account</span>
            </div>
            
            <Button variant="ghost" size="sm" onClick={() => logout()}>
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading dashboard data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start mb-6 overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="listings">My Cars</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardData.activeListings}</div>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Get more bookings with more cars
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full" onClick={handleAddCar}>
                      <Car className="mr-2 h-4 w-4" />
                      Add New Car
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardData.pendingBookings}</div>
                    <p className="text-xs text-amber-500 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      Requires your attention
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => router.push("/owner/bookings?filter=pending")}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Manage Bookings
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">€{dashboardData.totalEarnings}</div>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      €{dashboardData.pendingEarnings} pending
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => router.push("/owner/earnings")}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      View Earnings
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              {/* Recent Bookings Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Your most recent booking requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {dashboardData.recentBookings.map(booking => (
                      <div key={booking.id} className="py-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{booking.car}</h3>
                          <div className="flex items-center text-sm text-gray-500 space-x-2">
                            <UserCircle className="h-3 w-3" />
                            <span>{booking.client}</span>
                            <span>•</span>
                            <span>{booking.startDate} to {booking.endDate}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className={bookingHelpers.getStatusBadgeClasses(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                          
                          {booking.status === "pending" && (
                            <div className="flex space-x-1">
                              <Button onClick={() => handleApproveBooking(booking.id)} size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button onClick={() => handleRejectBooking(booking.id)} size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Clock className="h-4 w-4 text-amber-600" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => router.push("/owner/bookings")}>
                    View All Bookings
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Recent system notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {dashboardData.notifications.map(notification => (
                      <div key={notification.id} className="py-3 flex items-start space-x-4">
                        <div className={`
                          rounded-full p-2 mt-0.5
                          ${notification.type === "booking" ? "bg-blue-100" : 
                            notification.type === "review" ? "bg-green-100" : "bg-gray-100"}
                        `}>
                          {notification.type === "booking" ? (
                            <Calendar className="h-4 w-4 text-blue-600" />
                          ) : notification.type === "review" ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <BellRing className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View All Notifications
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="listings">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>My Cars</CardTitle>
                    <CardDescription>Manage your car listings</CardDescription>
                  </div>
                  <Button onClick={handleAddCar}>
                    <Car className="mr-2 h-4 w-4" />
                    Add New Car
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {mockListings.map(listing => (
                      <div key={listing.id} className="py-4 flex items-center">
                        <div className="w-16 h-16 rounded-md bg-gray-100 mr-4">
                          {/* Car image would go here */}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{listing.title}</h3>
                            <Badge
                              className={listing.status === "active" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-amber-100 text-amber-800"}
                            >
                              {listing.status}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span>€{listing.price}/day</span>
                            <span className="mx-2">•</span>
                            <span>{listing.bookings} bookings</span>
                            {listing.rating > 0 && (
                              <>
                                <span className="mx-2">•</span>
                                <span>{listing.rating} ★</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="ml-4 flex space-x-2">
                          <Button size="sm" variant="outline" className="h-8">
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>All Bookings</CardTitle>
                  <CardDescription>Manage your car bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {mockBookings.map(booking => (
                      <div key={booking.id} className="py-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{booking.car}</h3>
                          <div className="flex flex-col md:flex-row md:items-center text-sm text-gray-500 md:space-x-2">
                            <div className="flex items-center">
                              <UserCircle className="h-3 w-3 mr-1" />
                              <span>{booking.client}</span>
                            </div>
                            <span className="hidden md:inline">•</span>
                            <span>{booking.startDate} to {booking.endDate}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row items-end md:items-center space-y-2 md:space-y-0 md:space-x-4">
                          <span className="text-sm font-medium">€{booking.total}</span>
                          
                          <Badge className={bookingHelpers.getStatusBadgeClasses(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                          
                          {booking.status === "pending" && (
                            <div className="flex space-x-1">
                              <Button onClick={() => handleApproveBooking(booking.id)} size="sm" variant="outline" className="h-8">
                                Approve
                              </Button>
                              <Button onClick={() => handleRejectBooking(booking.id)} size="sm" variant="outline" className="h-8">
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="earnings">
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Overview</CardTitle>
                  <CardDescription>Your earnings and payment history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">€{mockEarnings.monthly}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Yearly Earnings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">€{mockEarnings.yearly}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">€{mockEarnings.pending}</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Earnings History</h3>
                    <div className="h-64 w-full bg-gray-50 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Earnings chart would go here</p>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="font-medium mb-4">Recent Payments</h3>
                    <div className="divide-y">
                      {mockBookings.map(booking => (
                        <div key={booking.id} className="py-3 flex justify-between">
                          <div>
                            <p className="font-medium">Payment for {booking.car}</p>
                            <p className="text-sm text-gray-500">{booking.startDate} - {booking.endDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">€{booking.total}</p>
                            <p className="text-sm text-gray-500">{booking.status === "completed" ? "Paid" : "Pending"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Owner Profile</CardTitle>
                  <CardDescription>Manage your profile and account settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Name</label>
                          <p>{user?.name || "Owner User"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <p>{user?.email || "owner@example.com"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Account Type</label>
                          <p>Owner</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Member Since</label>
                          <p>January 2023</p>
                        </div>
                      </div>
                      <Button className="mt-4" variant="outline">Edit Profile</Button>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Subscription</h3>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{user?.subscription?.tier || "Standard"} Plan</h4>
                              <p className="text-sm text-gray-500">Billed {user?.subscription?.billingPeriod || "monthly"}</p>
                            </div>
                            <Badge>Active</Badge>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm">Next billing date: {user?.subscription?.nextBillingDate?.toLocaleDateString() || "July 30, 2023"}</p>
                          </div>
                          <div className="mt-4 flex space-x-2">
                            <Button variant="outline" size="sm">Change Plan</Button>
                            <Button variant="outline" size="sm">Billing History</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
                      <p className="text-sm text-gray-500 mb-4">Manage your payment methods for payouts</p>
                      <Button variant="outline">Add Payment Method</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
} 