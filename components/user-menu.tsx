"use client"

import React from "react"
import Link from "next/link"
import { 
  User, 
  LogOut, 
  Settings, 
  Heart, 
  Calendar, 
  MessageCircle,
  Shield,
  Car,
  ChevronDown
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RoleBadge } from "./ui/role-badge"
import { cn } from "@/lib/utils"

export function UserMenu() {
  const { user, logout, isAdmin, isOwner, isClient } = useAuth()
  
  if (!user) return null
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 p-2 pl-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-accent flex items-center justify-center">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-4 w-4 text-accent-foreground" />
            )}
          </div>
          <div className="flex flex-col items-start max-md:hidden">
            <span className="text-sm font-medium">{user.name}</span>
            <RoleBadge role={user.role} className="mt-0.5" />
          </div>
          <ChevronDown className="h-4 w-4 max-md:hidden" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {/* Role-specific menu items */}
        {isClient && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/reservations" className="flex items-center cursor-pointer">
                <Calendar className="mr-2 h-4 w-4" />
                Mes réservations
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/favorites" className="flex items-center cursor-pointer">
                <Heart className="mr-2 h-4 w-4" />
                Favoris
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        {isOwner && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/owner/dashboard" className="flex items-center cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                Tableau de bord
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/owner/cars" className="flex items-center cursor-pointer">
                <Car className="mr-2 h-4 w-4" />
                Mes véhicules
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/owner/bookings" className="flex items-center cursor-pointer">
                <Calendar className="mr-2 h-4 w-4" />
                Réservations
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        {isAdmin && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/admin" className="flex items-center cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                Administration
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        {/* Common menu items for all users */}
        <DropdownMenuItem asChild>
          <Link href="/messages" className="flex items-center cursor-pointer">
            <MessageCircle className="mr-2 h-4 w-4" />
            Messages
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profil
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/10"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 