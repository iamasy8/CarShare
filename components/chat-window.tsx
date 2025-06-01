"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MoreVertical, Phone, Video, ImageIcon, Paperclip, Send, Info, ChevronLeft } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { BackButton } from "@/components/ui/back-button"

// Mock data for a conversation
const mockConversation = {
  id: 1,
  user: {
    id: 101,
    name: "Marie Lefèvre",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
  },
  messages: [
    {
      id: 1,
      text: "Bonjour, je suis intéressé par votre Renault Clio. Est-elle toujours disponible pour ce week-end ?",
      time: new Date(2023, 3, 10, 10, 30),
      isOwn: false,
    },
    {
      id: 2,
      text: "Bonjour Marie, oui la voiture est disponible ce week-end. Quelles seraient vos dates exactes de location ?",
      time: new Date(2023, 3, 10, 10, 45),
      isOwn: true,
    },
    {
      id: 3,
      text: "Je souhaiterais la louer du vendredi 14 avril à 18h jusqu'au dimanche 16 avril à 20h. Est-ce possible ?",
      time: new Date(2023, 3, 10, 11, 0),
      isOwn: false,
    },
    {
      id: 4,
      text: "Oui, ces dates sont disponibles. Avez-vous des questions sur le véhicule ?",
      time: new Date(2023, 3, 10, 11, 15),
      isOwn: true,
    },
    {
      id: 5,
      text: "Est-ce que la voiture a un GPS intégré ? Et quel est le kilométrage inclus dans la location ?",
      time: new Date(2023, 3, 10, 11, 30),
      isOwn: false,
    },
    {
      id: 6,
      text: "Oui, la voiture dispose d'un GPS intégré. Le forfait inclut 200 km par jour. Au-delà, c'est 0,25€ par kilomètre supplémentaire.",
      time: new Date(2023, 3, 10, 11, 45),
      isOwn: true,
    },
    {
      id: 7,
      text: "Parfait, merci pour ces informations. Je vais procéder à la réservation sur la plateforme.",
      time: new Date(2023, 3, 10, 12, 0),
      isOwn: false,
    },
    {
      id: 8,
      text: "Très bien ! N'hésitez pas si vous avez d'autres questions. À bientôt !",
      time: new Date(2023, 3, 10, 12, 15),
      isOwn: true,
    },
  ],
}

interface ChatWindowProps {
  conversationId?: number
  onBack?: () => void
  className?: string
  isMobile?: boolean
}

export default function ChatWindow({ conversationId, onBack, className, isMobile = false }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mockConversation.messages])

  // If no conversation is selected, show empty state
  if (!conversationId) {
    return (
      <div className={cn("flex flex-col h-full items-center justify-center p-4 text-center", className)}>
        <div className="max-w-md">
          <h3 className="text-lg font-medium mb-2">Sélectionnez une conversation</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Choisissez une conversation dans la liste ou démarrez une nouvelle discussion.
          </p>
        </div>
      </div>
    )
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, you would send the message to the server here
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Group messages by date
  const groupedMessages: { [key: string]: typeof mockConversation.messages } = {}
  mockConversation.messages.forEach((message) => {
    const date = format(message.time, "P", { locale: fr })
    if (!groupedMessages[date]) {
      groupedMessages[date] = []
    }
    groupedMessages[date].push(message)
  })

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        {isMobile && (
          <BackButton variant="ghost" size="icon" className="mr-2" label="" onClick={onBack} />
        )}
        <div className="flex items-center flex-1">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={mockConversation.user.avatar || "/placeholder.svg"} alt={mockConversation.user.name} />
            <AvatarFallback>{mockConversation.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{mockConversation.user.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {mockConversation.user.isOnline ? "En ligne" : "Hors ligne"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Info className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Voir le profil</DropdownMenuItem>
              <DropdownMenuItem>Bloquer l'utilisateur</DropdownMenuItem>
              <DropdownMenuItem>Signaler la conversation</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Supprimer la conversation</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <div key={date} className="space-y-4">
            <div className="flex justify-center">
              <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full">
                {date}
              </span>
            </div>

            {messages.map((message) => (
              <div key={message.id} className={cn("flex", message.isOwn ? "justify-end" : "justify-start")}>
                <div className="flex items-end gap-2 max-w-[80%]">
                  {!message.isOwn && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={mockConversation.user.avatar || "/placeholder.svg"}
                        alt={mockConversation.user.name}
                      />
                      <AvatarFallback>{mockConversation.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm",
                      message.isOwn
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                    )}
                  >
                    <p>{message.text}</p>
                    <span
                      className={cn(
                        "text-xs block mt-1",
                        message.isOwn ? "text-red-100" : "text-gray-500 dark:text-gray-400",
                      )}
                    >
                      {format(message.time, "p", { locale: fr })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex items-end gap-2">
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ImageIcon className="h-5 w-5" />
            </Button>
          </div>
          <Textarea
            placeholder="Écrivez votre message..."
            className="flex-1 min-h-[40px] resize-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            className="bg-red-600 hover:bg-red-700 h-9 w-9 p-0"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
