"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Car, Calendar, MapPin, Star, MessageSquare } from "lucide-react"
import ChatWindow from "@/components/chat/chat-window"
import ChatList from "@/components/chat/chat-list"
import { useMediaQuery } from "@/hooks/use-media-query"
import React from "react"

// Mock data for the car associated with this conversation
const carData = {
  id: 1,
  title: "Renault Clio",
  type: "Citadine",
  price: 35,
  location: "Paris, France",
  rating: 4.8,
  reviews: 24,
  image: "/placeholder.svg?height=200&width=300",
  owner: {
    id: 101,
    name: "Marie Lefèvre",
    avatar: "/placeholder.svg?height=40&width=40",
    responseTime: "Moins d'une heure",
  },
  availableFrom: "20/04/2023",
  availableTo: "20/07/2023",
}

export default function ConversationPage() {
  const params = useParams()
  const router = useRouter()
  // Unwrap params using React.use() 
  const resolvedParams = React.use(params)
  const conversationId = Number(resolvedParams.id)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [showChatList, setShowChatList] = useState(!isMobile)

  // Handle back button for mobile
  const handleBack = () => {
    if (isMobile) {
      setShowChatList(true)
    } else {
      router.back()
    }
  }

  // Update showChatList when screen size changes
  useEffect(() => {
    setShowChatList(!isMobile || !conversationId)
  }, [isMobile, conversationId])

  return (
    <div className="container py-6 md:py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-gray-500 dark:text-gray-400">Communiquez avec les propriétaires et les locataires</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Chat list - hidden on mobile when viewing a conversation */}
        {(showChatList || !isMobile) && (
          <div className="md:col-span-1 border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
            <ChatList
              activeConversationId={conversationId}
              onSelectConversation={(id) => {
                router.push(`/messages/${id}`)
                if (isMobile) {
                  setShowChatList(false)
                }
              }}
            />
          </div>
        )}

        {/* Chat window - shown when a conversation is selected */}
        {(!showChatList || !isMobile) && conversationId && (
          <>
            <div className="md:col-span-2 border rounded-lg overflow-hidden bg-white dark:bg-gray-800 h-[calc(100vh-220px)] md:h-[600px]">
              <ChatWindow conversationId={conversationId} onBack={handleBack} isMobile={isMobile} />
            </div>

            {/* Car details - only shown on desktop */}
            {!isMobile && (
              <div className="hidden lg:block lg:col-span-1">
                <Card>
                  <CardContent className="p-4">
                    <div className="relative mb-3">
                      <img
                        src={carData.image || "/placeholder.svg"}
                        alt={carData.title}
                        className="w-full aspect-[4/3] object-cover rounded-md"
                      />
                    </div>

                    <h3 className="font-medium text-lg">{carData.title}</h3>

                    <div className="flex items-center mt-1 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="ml-1 text-sm font-medium">{carData.rating}</span>
                      </div>
                      <span className="mx-1.5 text-gray-500 dark:text-gray-400 text-sm">•</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{carData.reviews} avis</span>
                    </div>

                    <Separator className="my-3" />

                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <span>{carData.location}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <div>
                          <p>Disponible du {carData.availableFrom}</p>
                          <p>au {carData.availableTo}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Car className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5" />
                        <span>{carData.type}</span>
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={carData.owner.avatar || "/placeholder.svg"} alt={carData.owner.name} />
                        <AvatarFallback>{carData.owner.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{carData.owner.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Répond en {carData.owner.responseTime}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="font-bold text-xl text-red-600">
                        {carData.price}€
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/jour</span>
                      </p>
                    </div>

                    <Button asChild className="w-full mt-4 bg-red-600 hover:bg-red-700">
                      <Link href={`/cars/${carData.id}`}>Voir l'annonce</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}

        {/* Empty state - shown when no conversation is selected */}
        {!conversationId && !isMobile && (
          <div className="md:col-span-3 border rounded-lg flex items-center justify-center bg-white dark:bg-gray-800 h-[600px]">
            <div className="text-center max-w-md p-6">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Sélectionnez une conversation</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choisissez une conversation dans la liste pour commencer à discuter.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
