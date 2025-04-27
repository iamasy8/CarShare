"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { User, Shield, Car, LogOut } from "lucide-react"

export function DevTools() {
  const { setMockUser, user, status } = useAuth()

  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <div className="fixed bottom-16 md:bottom-4 right-4 z-50 bg-black/80 p-4 rounded-lg shadow-lg text-white">
      <div className="mb-2 text-sm font-semibold">Development Tools</div>
      <div className="mb-2 text-xs">
        {status === "authenticated" ? (
          <span>
            Logged in as: <strong>{user?.name}</strong> ({user?.role})
          </span>
        ) : (
          <span>Not logged in</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setMockUser("admin")}
          className="bg-red-900/50 hover:bg-red-900 text-white border-red-700"
        >
          <Shield className="h-4 w-4 mr-2" />
          Login as Admin
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setMockUser("owner")}
          className="bg-green-900/50 hover:bg-green-900 text-white border-green-700"
        >
          <Car className="h-4 w-4 mr-2" />
          Login as Owner
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setMockUser("client")}
          className="bg-blue-900/50 hover:bg-blue-900 text-white border-blue-700"
        >
          <User className="h-4 w-4 mr-2" />
          Login as Client
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setMockUser(null)}
          className="bg-gray-800 hover:bg-gray-700 text-white"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
} 