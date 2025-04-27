"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Car, 
  Search, 
  Settings, 
  Menu, 
  X, 
  Calendar, 
  LogOut, 
  User,
  Heart,
  MessageCircle,
  HelpCircle,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

export default function ClientSidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  // Mock data
  const upcomingTrips = 1
  const unreadMessages = 2

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center h-16 px-4 border-b">
          <Car className="h-6 w-6 text-red-600" />
          <span className="ml-2 text-xl font-bold">Espace Client</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Recherche
          </div>
          <Link
            href="/search"
            className={cn(
              "flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
              isActive("/search") && "bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-500 font-medium",
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <Search className="h-5 w-5 mr-3" />
            Trouver une voiture
          </Link>
          <Link
            href="/favorites"
            className={cn(
              "flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
              isActive("/favorites") && "bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-500 font-medium",
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <Heart className="h-5 w-5 mr-3" />
            Mes favoris
          </Link>

          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Mes réservations
          </div>
          <Link
            href="/reservations"
            className={cn(
              "flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
              (isActive("/reservations") && !isActive("/reservations/history")) && 
              "bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-500 font-medium",
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <Calendar className="h-5 w-5 mr-3" />
            À venir
            {upcomingTrips > 0 && <Badge className="ml-auto bg-red-600 text-white">{upcomingTrips}</Badge>}
          </Link>
          <Link
            href="/reservations/history"
            className={cn(
              "flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
              isActive("/reservations/history") && "bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-500 font-medium",
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <Clock className="h-5 w-5 mr-3" />
            Historique
          </Link>
          <Link
            href="/messages"
            className={cn(
              "flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
              isActive("/messages") && "bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-500 font-medium",
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <MessageCircle className="h-5 w-5 mr-3" />
            Messages
            {unreadMessages > 0 && <Badge className="ml-auto bg-red-600 text-white">{unreadMessages}</Badge>}
          </Link>

          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Plus
          </div>
          <Link
            href="/profile"
            className={cn(
              "flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
              isActive("/profile") && "bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-500 font-medium",
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <User className="h-5 w-5 mr-3" />
            Mon profil
          </Link>
          <Link
            href="/how-it-works"
            className={cn(
              "flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
              isActive("/how-it-works") && "bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-500 font-medium",
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <HelpCircle className="h-5 w-5 mr-3" />
            Comment ça marche
          </Link>
          <Link
            href="/settings"
            className={cn(
              "flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
              isActive("/settings") && "bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-500 font-medium",
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <Settings className="h-5 w-5 mr-3" />
            Paramètres
          </Link>
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name || "Client"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || "client@example.com"}</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMenuOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMenuOpen(false)} />}
    </>
  )
} 