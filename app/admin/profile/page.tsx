"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Shield, User, Mail, Calendar, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"

export default function AdminProfilePage() {
  const { user, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  
  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || ""
      })
    }
  }, [user])
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    setIsLoading(true)
    
    try {
      await updateProfile({
        name: formData.name,
        avatar: formData.avatar
      })
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      })
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  if (!user) return null
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profil Administrateur</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informations</CardTitle>
            <CardDescription>Vos informations personnelles</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user.avatar || ""} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {user.name?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-2 w-full">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{user.name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="capitalize">{user.role}</span>
              </div>
              
              {user.lastLogin && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Dernière connexion: {format(new Date(user.lastLogin), 'dd/MM/yyyy HH:mm')}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Edit Profile Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Modifier le profil</CardTitle>
            <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Votre nom complet"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  disabled 
                  placeholder="votre.email@example.com"
                />
                <p className="text-xs text-muted-foreground">L'email ne peut pas être modifié.</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avatar">URL de la photo de profil</Label>
                <Input 
                  id="avatar" 
                  name="avatar" 
                  value={formData.avatar} 
                  onChange={handleInputChange} 
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  "Mettre à jour le profil"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
