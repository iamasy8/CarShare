"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Car, Menu, Home, Search, Info, HelpCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { NotificationBell } from "./ui/notification-bell"
import { UserMenu } from "./user-menu"
import { RoleBadge } from "./ui/role-badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
  const pathname = usePathname()
  const { user, status } = useAuth()
  const isAuthenticated = status === "authenticated" && user !== null

  // Navigation items for all users
  const navItems = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/search", label: "Trouver une voiture", icon: Search },
    { href: "/about", label: "À propos", icon: Info },
    { href: "/how-it-works", label: "Comment ça marche", icon: HelpCircle },
  ]
  
  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Car className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline">CarShare</span>
          {isAuthenticated && user && (
            <RoleBadge role={user.role} className="ml-2" />
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <Button 
              key={item.href} 
              variant="ghost" 
              asChild 
              className={pathname === item.href ? "bg-accent" : ""}
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
          
          {isAuthenticated ? (
            <div className="flex items-center gap-2 ml-4">
              <NotificationBell />
              <ThemeToggle />
              <UserMenu />
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-4">
              <ThemeToggle />
              <Button asChild variant="ghost">
                <Link href="/login">Se connecter</Link>
              </Button>
              <Button asChild>
                <Link href="/register">S'inscrire</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && <NotificationBell />}
          <ThemeToggle />
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px] p-0">
              <div className="flex flex-col h-full">
                {isAuthenticated && user && (
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <RoleBadge role={user.role} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex-1 overflow-auto p-4">
                  <div className="flex flex-col gap-1">
                    {navItems.map((item) => (
                      <Button
                        key={item.href}
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        asChild
                        className="justify-start"
                      >
                        <Link href={item.href}>
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.label}
                        </Link>
                      </Button>
                    ))}
                    
                    {!isAuthenticated && (
                      <>
                        <Button asChild variant="outline" className="mt-4">
                          <Link href="/login">Se connecter</Link>
                        </Button>
                        <Button asChild className="mt-2">
                          <Link href="/register">S'inscrire</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
