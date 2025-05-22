"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
// Import Loader2 if you decide to show a loading spinner in the header
import { Car, Menu, Home, Search, Info, HelpCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { NotificationBell } from "./ui/notification-bell"
import { UserMenu } from "./user-menu"
import { RoleBadge } from "./ui/role-badge"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

export default function Header() {
  const pathname = usePathname()
  const { user, status, loading } = useAuth()

  // Navigation items for all users - publicly accessible
  const publicNavItems = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/about", label: "À propos", icon: Info },
    { href: "/how-it-works", label: "Comment ça marche", icon: HelpCircle },
  ]
  
  // Navigation items that should be accessible to everyone but might need special handling
  const searchNavItem = { href: "/search", label: "Trouver une voiture", icon: Search }
  
  // Use all nav items regardless of authentication state
  const navItems = [...publicNavItems, searchNavItem]

  // We no longer return null early based on loading.profile
  // The header structure will always be rendered, but its content will be conditional

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Car className="h-6 w-6 text-red-500" />
          <span className="hidden sm:inline">CarShare</span>
          {/* Show RoleBadge only if authenticated AND user exists */}
          {status === "authenticated" && user && (
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

          {/* Conditional rendering based on status */}
          {status === "loading" ? (
             // Optional: Show a loading indicator while authenticating
             <div className="ml-4 flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
             </div>
          ) : status === "authenticated" ? (
            <div className="flex items-center gap-2 ml-4">
              <NotificationBell />
                <ThemeToggle />
              <UserMenu />
              </div>
          ) : ( // status === "unauthenticated"
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
          {/* Show NotificationBell only if authenticated */}
          {status === "authenticated" && <NotificationBell />}
          <ThemeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {status === "loading" ? (
                    <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                ) : (
                    <Menu className="h-5 w-5" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px] p-0">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <div className="flex flex-col h-full">
                {/* Show mobile user info only if authenticated AND user exists */}
                {status === "authenticated" && user && (
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

                    {/* Only show mobile sign-in/sign-up if status is unauthenticated */}
                    {status === "unauthenticated" && (
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
