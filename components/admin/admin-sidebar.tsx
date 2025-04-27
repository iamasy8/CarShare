"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, Users, Settings, Menu, X, FileCheck, BarChart, AlertTriangle, LogOut, User } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminSidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

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
          <span className="ml-2 text-xl font-bold">CarShare Admin</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Tableau de bord
          </div>
          <Link
            href="/admin"
            className={cn(
              "flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
              isActive("/admin") &&
                !isActive("/admin/verification") &&
                "bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-500 font-medium",
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <BarChart className="h-5 w-5 mr-3" />
            Vue d'ensemble
          </Link>

          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Gestion
          </div>
          <Link
            href="/admin/verification"
            className={cn(
              "flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
              isActive("/admin/verification") &&
                "bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-500 font-medium",
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <FileCheck className="h-5 w-5 mr-3" />
            Vérifications
            <Badge className="ml-auto bg-red-600 text-white">4</Badge>
          </Link>
          <Link
            href="/admin/verification/cars"
            className={cn(
              "flex items-center px-4 py-2 pl-12 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
              isActive("/admin/verification/cars") &&
                "bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-500 font-medium",
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <Car className="h-5 w-5 mr-3" />
            Véhicules
            <Badge className="ml-auto bg-red-600 text-white">2</Badge>
          </Link>
          <Link
            href="/admin/cars"
            className={cn(
              "flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
              isActive("/admin/cars") && "bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-500 font-medium",
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <Car className="h-5 w-5 mr-3" />
            Annonces
          </Link>
          <Link
            href="/admin/users"
            className={cn(
              "flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
              isActive("/admin/users") && "bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-500 font-medium",
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <Users className="h-5 w-5 mr-3" />
            Utilisateurs
          </Link>
          <Link
            href="/admin/reports"
            className={cn(
              "flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
              isActive("/admin/reports") && "bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-500 font-medium",
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <AlertTriangle className="h-5 w-5 mr-3" />
            Signalements
            <Badge className="ml-auto bg-red-600 text-white">2</Badge>
          </Link>
          {/* Remove the messages link from the admin sidebar */}
          {/* Remove or comment out the following code block:
          \`\`\`
          <Link
            href="/admin/messages"
            className={cn(
              "flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
              isActive("/admin/messages") && "bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-500 font-medium",
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <MessageSquare className="h-5 w-5 mr-3" />
            Messages
          </Link>
          \`\`\` */}

          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Paramètres
          </div>
          <Link
            href="/admin/settings"
            className={cn(
              "flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
              isActive("/admin/settings") && "bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-500 font-medium",
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <Settings className="h-5 w-5 mr-3" />
            Configuration
          </Link>
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">admin@carshare.com</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto">
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
