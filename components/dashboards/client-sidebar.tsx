"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Calendar, Heart, Settings, MessageCircle, HelpCircle, LogOut, Home } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RoleBadge } from "@/components/ui/role-badge"
import { Badge } from "@/components/ui/badge"

export function ClientSidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  
  // Mock unread messages data (in a real app, this would come from an API)
  const unreadMessages = 3
  
  if (!user) return null
  
  const isActive = (href: string) => {
    if (href === "/client/dashboard" && pathname === "/client/dashboard") {
      return true
    }
    return pathname.startsWith(href) && href !== "/client/dashboard"
  }
  
  const navItems = [
    { href: "/client/dashboard", label: "Tableau de bord", icon: Home },
    { href: "/search", label: "Rechercher", icon: Search },
    { href: "/client/reservations", label: "Mes réservations", icon: Calendar },
    { href: "/client/favorites", label: "Favoris", icon: Heart },
    { 
      href: "/messages", 
      label: "Messages", 
      icon: MessageCircle,
      badge: unreadMessages
    },
  ]
  
  return (
    <aside className="w-64 h-screen bg-sidebar border-r flex-shrink-0 hidden md:block">
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center gap-3 p-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-primary/10 text-primary">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <RoleBadge role={user.role} />
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive(item.href) && "bg-accent text-accent-foreground"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <Badge className="ml-auto bg-red-500 text-white text-xs" variant="outline">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          ))}
        </nav>
        
        <div className="space-y-1 pt-4 border-t">
          <Link href="/settings">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </Button>
          </Link>
          <Link href="/help">
            <Button variant="ghost" className="w-full justify-start">
              <HelpCircle className="mr-2 h-4 w-4" />
              Aide
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/10" 
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>
    </aside>
  )
} 