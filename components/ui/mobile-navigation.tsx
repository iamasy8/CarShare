"use client"

import React, { useState } from "react"
import { usePathname } from "next/navigation"
import { User, Car, MessageCircle, Calendar, Home, Search, Shield, Settings, Bell, Heart } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface NavTab {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
}

export function MobileNavigation() {
  const { user } = useAuth()
  const pathname = usePathname()
  
  // Mock unread message data (in a real app, this would come from an API)
  const unreadMessages = 2
  
  // Define role-specific tabs
  const clientTabs: NavTab[] = [
    { icon: Home, label: "Accueil", href: "/client/dashboard" },
    { icon: Search, label: "Rechercher", href: "/search" },
    { icon: Calendar, label: "Réservations", href: "/reservations" },
    { icon: Heart, label: "Favoris", href: "/client/favorites" },
    { 
      icon: MessageCircle, 
      label: "Messages", 
      href: "/messages",
      badge: unreadMessages
    },
  ]
  
  const ownerTabs: NavTab[] = [
    { icon: Home, label: "Tableau", href: "/owner/dashboard" },
    { icon: Car, label: "Véhicules", href: "/owner/cars" },
    { icon: Calendar, label: "Réservations", href: "/owner/bookings" },
    { 
      icon: MessageCircle, 
      label: "Messages", 
      href: "/messages",
      badge: unreadMessages
    },
    { icon: User, label: "Profil", href: "/profile" },
  ]
  
  const adminTabs: NavTab[] = [
    { icon: Shield, label: "Dashboard", href: "/admin" },
    { icon: User, label: "Utilisateurs", href: "/admin/users" },
    { icon: Car, label: "Véhicules", href: "/admin/cars" },
    { icon: Settings, label: "Paramètres", href: "/admin/settings" },
    { 
      icon: MessageCircle, 
      label: "Messages", 
      href: "/messages",
      badge: unreadMessages
    },
  ]
  
  // Choose the appropriate tabs based on user role
  const tabs = user?.role === "admin" || user?.role === "superadmin" 
    ? adminTabs 
    : user?.role === "owner" 
      ? ownerTabs 
      : clientTabs
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t flex md:hidden">
      {tabs.map((tab) => (
        <Link 
          key={tab.href} 
          href={tab.href}
          className={cn(
            "flex flex-1 flex-col items-center justify-center py-2 text-xs",
            pathname === tab.href || (pathname &&pathname.startsWith(tab.href + "/"))
              ? "text-primary" 
              : "text-muted-foreground"
          )}
        >
          <div className="relative">
            <tab.icon className="h-5 w-5 mb-1" />
            {tab.badge && tab.badge > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white border-0 text-[10px]"
              >
                {tab.badge}
              </Badge>
            )}
          </div>
          <span>{tab.label}</span>
        </Link>
      ))}
    </nav>
  )
} 