"use client"

import React, { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  message: string
  date: Date
  read: boolean
  type: "message" | "booking" | "system"
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([
    // Example notifications - in a real app, these would come from an API
    {
      id: "1",
      title: "Nouvelle réservation",
      message: "Vous avez une nouvelle réservation pour votre Renault Clio",
      date: new Date(),
      read: false,
      type: "booking",
    },
    {
      id: "2",
      title: "Message de Julie Martin",
      message: "Bonjour, est-ce que la voiture est disponible le week-end prochain ?",
      date: new Date(Date.now() - 3600000), // 1 hour ago
      read: false,
      type: "message",
    },
    {
      id: "3",
      title: "Mise à jour système",
      message: "Nous avons mis à jour nos conditions d'utilisation",
      date: new Date(Date.now() - 86400000), // 1 day ago
      read: true,
      type: "system",
    },
  ])
  
  const unreadCount = notifications.filter(n => !n.read).length
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
        </div>
        <div className="max-h-[300px] overflow-auto">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <div 
                key={notification.id}
                className={cn(
                  "border-b p-4 cursor-pointer hover:bg-muted transition-colors", 
                  notification.read ? 'bg-background' : 'bg-accent'
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex justify-between">
                  <h4 className="text-sm font-medium">{notification.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {notification.date.toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{notification.message}</p>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Aucune notification
            </div>
          )}
        </div>
        {unreadCount > 0 && (
          <div className="p-2 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs"
              onClick={markAllAsRead}
            >
              Tout marquer comme lu
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
} 