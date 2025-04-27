"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ShieldAlert, Users, Car, Clock, LogOut, Settings, Bell, User, Activity } from "lucide-react"

export default function AdminDashboard() {
  const { user, logout, isAdmin, isSuperAdmin, hasPermission, checkSessionExpiry, extendSession } = useAuth()
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [activityLogs, setActivityLogs] = useState<Array<{id: number, action: string, user: string, timestamp: Date, details?: string}>>([
    { id: 1, action: "User Login", user: "admin@carshare.com", timestamp: new Date(Date.now() - 15 * 60 * 1000), details: "IP: 192.168.1.1" },
    { id: 2, action: "User Registration", user: "new_client@example.com", timestamp: new Date(Date.now() - 35 * 60 * 1000) },
    { id: 3, action: "Booking Approved", user: "owner@example.com", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 4, action: "Car Added", user: "owner@example.com", timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) },
    { id: 5, action: "Payment Processed", user: "client@example.com", timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), details: "Amount: €45.00" },
  ])
  
  // Check if user has admin permissions
  useEffect(() => {
    if (!isAdmin && !isSuperAdmin) {
      router.push("/login")
    }
  }, [isAdmin, isSuperAdmin, router])
  
  // Set up session timeout tracking and auto-extend
  useEffect(() => {
    if (!user?.sessionExpiry) return
    
    // Update time left in session
    const updateTimeLeft = () => {
      const now = new Date()
      if (!user?.sessionExpiry) {
        setTimeLeft("Unknown")
        return
      }
      
      const expiry = new Date(user.sessionExpiry)
      const diffMs = expiry.getTime() - now.getTime()
      
      if (diffMs <= 0) {
        setTimeLeft("Expired")
        return
      }
      
      const diffMins = Math.floor(diffMs / 60000)
      const diffSecs = Math.floor((diffMs % 60000) / 1000)
      
      setTimeLeft(`${diffMins}m ${diffSecs}s`)
      
      // Auto extend if less than 1 minute left
      if (diffMins < 1) {
        extendSession()
      }
    }
    
    // Initial update
    updateTimeLeft()
    
    // Update every second
    const interval = setInterval(updateTimeLeft, 1000)
    
    return () => clearInterval(interval)
  }, [user, extendSession])
  
  // Check session expiry
  useEffect(() => {
    const expired = checkSessionExpiry()
    if (expired) {
      router.push("/login")
    }
  }, [checkSessionExpiry, router])
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="sticky top-0 z-30 w-full bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            {isSuperAdmin && (
              <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Super Admin
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
              <span className="font-medium">{user?.name}</span>
              <span className="mx-1">•</span>
              <span>Session: {timeLeft}</span>
            </div>
            
            <Button variant="outline" size="sm" onClick={() => extendSession()}>
              <Clock className="mr-1 h-4 w-4" />
              Extend Session
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => logout()}>
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start mb-6 overflow-x-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="cars">Cars</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="activity">Activity Logs</TabsTrigger>
            {isSuperAdmin && (
              <TabsTrigger value="settings">Settings</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,345</div>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <span className="inline-block mr-1">↑</span> 12% from last month
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => router.push("/admin/users")}>
                    <Users className="mr-2 h-4 w-4" />
                    View All Users
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,204</div>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <span className="inline-block mr-1">↑</span> 8% from last month
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => router.push("/admin/cars")}>
                    <Car className="mr-2 h-4 w-4" />
                    View All Cars
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-amber-500 flex items-center mt-1">
                    <span className="inline-block mr-1">!</span> Requires attention
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    <Bell className="mr-2 h-4 w-4" />
                    View Pending
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Admin Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activityLogs.length}</div>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <span className="inline-block mr-1">↔</span> Last 24 hours
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    <Activity className="mr-2 h-4 w-4" />
                    View Logs
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest activity in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLogs.slice(0, 3).map(log => (
                    <div key={log.id} className="flex items-start space-x-4">
                      <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
                        <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{log.action}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <User className="h-3 w-3 mr-1" />
                          <span>{log.user}</span>
                          <span className="mx-1">•</span>
                          <time>{log.timestamp.toLocaleTimeString()}</time>
                        </div>
                        {log.details && (
                          <p className="text-xs text-gray-500">{log.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
            
            {/* Admin permissions section */}
            <Card>
              <CardHeader>
                <CardTitle>Your Permissions</CardTitle>
                <CardDescription>Access control for your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {["view", "edit", "create", "delete", "manage_users", "manage_admins"].map(perm => (
                    <div 
                      key={perm}
                      className={`p-3 rounded-lg border ${
                        hasPermission(perm as any) 
                          ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" 
                          : "bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 opacity-50"
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          hasPermission(perm as any) 
                            ? "bg-green-500" 
                            : "bg-gray-400"
                        }`} />
                        <span className="text-sm font-medium capitalize">{perm.replace("_", " ")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all users in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <p>User management interface would be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cars">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Car Listings</CardTitle>
                <CardDescription>View and manage all car listings</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Car listings management interface would be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>System activity audit trail</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLogs.map(log => (
                    <div key={log.id} className="flex items-start space-x-4 p-4 border-b last:border-0">
                      <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
                        <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{log.action}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <User className="h-3 w-3 mr-1" />
                          <span>{log.user}</span>
                          <span className="mx-1">•</span>
                          <time>{log.timestamp.toLocaleString()}</time>
                        </div>
                        {log.details && (
                          <p className="text-xs text-gray-500">{log.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {isSuperAdmin && (
            <TabsContent value="settings">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure system-wide settings (Super Admin only)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-center text-yellow-800 dark:text-yellow-400">
                        <Settings className="h-5 w-5 mr-2" />
                        <span className="font-medium">Super Admin Settings</span>
                      </div>
                      <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-500">
                        This section is restricted to Super Administrators only. Changes made here affect the entire system.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Administrator Management</h3>
                      <p>Interface for managing admin accounts would be displayed here</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Security Settings</h3>
                      <p>Security configuration options would be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  )
}
