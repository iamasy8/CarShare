"use client"

import { useState } from "react"
import Image from "next/image"
import { useMessages } from "@/components/providers/message-provider"
import { Button } from "@/components/ui/button"
import { PlusCircle, Search } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { NewConversationDialog } from "./new-conversation-dialog"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

export function ChatSidebar() {
  const { user: currentUser } = useAuth()
  const { conversations, selectConversation, currentConversation } = useMessages()
  const [searchQuery, setSearchQuery] = useState("")
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false)

  const filteredConversations = conversations.filter((conversation) => {
    // For direct messages, search in the other user's name
    if (!conversation.is_group && conversation.users && conversation.users.length > 0) {
      return conversation.users[0].name.toLowerCase().includes(searchQuery.toLowerCase())
    }
    // For group conversations, search in the group name
    return (
      conversation.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false
    )
  })

  // Get the display name for a conversation
  const getConversationName = (conversation: any) => {
    if (conversation.is_group) {
      return conversation.name || "Groupe sans nom"
    }
    
    // For direct messages, show the other user's name
    if (conversation.users && conversation.users.length > 0) {
      // Find users other than the current user
      const otherUsers = conversation.users.filter((user: any) => 
        user.id !== currentUser?.id
      )
      
      if (otherUsers.length > 0) {
        return otherUsers[0].name
      }
      
      // If for some reason all users are filtered out (shouldn't happen),
      // fallback to the first user's name
      return conversation.users[0].name
    }
    
    return "Conversation"
  }

  // Get the avatar for a conversation
  const getConversationAvatar = (conversation: any) => {
    if (conversation.image_url) {
      return conversation.image_url
    }
    
    if (!conversation.is_group && conversation.users && conversation.users.length > 0) {
      // Find users other than the current user
      const otherUsers = conversation.users.filter((user: any) => 
        user.id !== currentUser?.id
      )
      
      if (otherUsers.length > 0) {
        return otherUsers[0].avatar || "/placeholder-avatar.png"
      }
      
      // Fallback to first user's avatar
      return conversation.users[0].avatar || "/placeholder-avatar.png"
    }
    
    return "/placeholder-group.png"
  }

  // Format the timestamp
  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: fr,
      })
    } catch (error) {
      return ""
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Messages</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsNewConversationOpen(true)}
            title="Nouvelle conversation"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une conversation..."
            className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
            <p>Aucune conversation trouvée</p>
            <Button 
              variant="link" 
              onClick={() => setIsNewConversationOpen(true)}
              className="mt-2"
            >
              Démarrer une nouvelle conversation
            </Button>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={cn(
                "flex items-center p-3 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800",
                currentConversation?.id === conversation.id && "bg-gray-100 dark:bg-gray-800"
              )}
              onClick={() => selectConversation(conversation.id)}
            >
              <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3">
                <Image
                  src={getConversationAvatar(conversation)}
                  alt={getConversationName(conversation)}
                  fill
                  className="object-cover"
                />
                {conversation.is_group && (
                  <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full h-3 w-3 border-2 border-white dark:border-gray-800"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold truncate">
                    {getConversationName(conversation)}
                  </h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {formatTime(conversation.updated_at)}
                  </span>
                </div>
                <div className="flex items-center">
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.latest_message?.body || "Aucun message"}
                  </p>
                  {conversation.messages_count && conversation.messages_count > 0 && (
                    <div className="ml-2 bg-blue-500 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                      {conversation.messages_count}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <NewConversationDialog 
        open={isNewConversationOpen}
        onOpenChange={setIsNewConversationOpen}
      />
    </div>
  )
}

// Add default export
export default ChatSidebar;