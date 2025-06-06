"use client"

import { useEffect } from "react"
import Echo from "laravel-echo"
import Pusher from "pusher-js"
import { useAuth } from "@/lib/auth-context"

// Extend the Window interface to include Pusher and Echo
declare global {
  interface Window {
    Pusher: typeof Pusher
    Echo: any // Using any since Echo's types are complex
  }
}

export function EchoInitializer() {
  const { user } = useAuth()
  
  // Get the token from localStorage
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token") || ""
    }
    return ""
  }

  useEffect(() => {
    if (!user) return
    
    const token = getToken()
    if (!token) return

    // Initialize Echo only once
    if (!window.Echo) {
      window.Pusher = Pusher

      window.Echo = new Echo({
        broadcaster: "pusher",
        key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
        forceTLS: true,
        authorizer: (channel: any) => ({
          authorize: (socketId: string, callback: Function) => {
            fetch("/api/broadcasting/auth", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                socket_id: socketId,
                channel_name: channel.name,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                callback(false, data)
              })
              .catch((error) => {
                callback(true, error)
              })
          },
        }),
      })
    }

    return () => {
      // Cleanup Echo when component unmounts or user logs out
      if (window.Echo) {
        window.Echo.disconnect()
      }
    }
  }, [user])

  return null
} 