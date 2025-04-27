"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for conversations
const conversations = [
  {
    id: 1,
    user: {
      id: 101,
      name: "Marie Lefèvre",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
    lastMessage: {
      text: "Bonjour, est-ce que la voiture est toujours disponible pour ce week-end ?",
      time: "10:42",
      isRead: true,
      isOwn: false,
    },
    unreadCount: 0,
  },
  {
    id: 2,
    user: {
      id: 102,
      name: "Thomas Dubois",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: false,
    },
    lastMessage: {
      text: "Parfait, je vous confirme la réservation pour lundi prochain.",
      time: "Hier",
      isRead: false,
      isOwn: true,
    },
    unreadCount: 2,
  },
  {
    id: 3,
    user: {
      id: 103,
      name: "Sophie Bernard",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
    lastMessage: {
      text: "Merci pour les informations. Je vous contacterai à mon arrivée.",
      time: "Lun",
      isRead: true,
      isOwn: false,
    },
    unreadCount: 0,
  },
  {
    id: 4,
    user: {
      id: 104,
      name: "Lucas Martin",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: false,
    },
    lastMessage: {
      text: "Est-ce que le GPS est inclus dans la location ?",
      time: "28/03",
      isRead: true,
      isOwn: false,
    },
    unreadCount: 0,
  },
  {
    id: 5,
    user: {
      id: 105,
      name: "Julie Moreau",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: false,
    },
    lastMessage: {
      text: "Voiture rendue. Merci beaucoup, tout s'est très bien passé !",
      time: "15/03",
      isRead: true,
      isOwn: false,
    },
    unreadCount: 0,
  },
]

interface ChatListProps {
  onSelectConversation?: (conversationId: number) => void
  selectedConversationId?: number
  className?: string
}

export default function ChatList({ onSelectConversation, selectedConversationId, className }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter((conversation) =>
    conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className={cn("flex flex-col h-full border-r", className)}>
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher une conversation..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          <ul className="divide-y">
            {filteredConversations.map((conversation) => (
              <li
                key={conversation.id}
                className={cn(
                  "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",
                  selectedConversationId === conversation.id && "bg-gray-100 dark:bg-gray-800",
                )}
                onClick={() => onSelectConversation?.(conversation.id)}
              >
                <div className="flex items-start p-4">
                  <div className="relative mr-3">
                    <Avatar>
                      <AvatarImage src={conversation.user.avatar || "/placeholder.svg"} alt={conversation.user.name} />
                      <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conversation.user.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-medium truncate">{conversation.user.name}</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                        {conversation.lastMessage.time}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-sm truncate",
                        conversation.lastMessage.isRead
                          ? "text-gray-500 dark:text-gray-400"
                          : "font-medium text-gray-900 dark:text-gray-100",
                      )}
                    >
                      {conversation.lastMessage.isOwn && "Vous: "}
                      {conversation.lastMessage.text}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="ml-2 bg-red-600 text-white text-xs font-medium rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Aucune conversation trouvée</p>
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Nouvelle conversation
            </Button>
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <Button className="w-full bg-red-600 hover:bg-red-700 gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle conversation
        </Button>
      </div>
    </div>
  )
}
