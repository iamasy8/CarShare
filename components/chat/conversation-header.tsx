"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Phone, Video, UserPlus, Trash, Edit, LogOut } from "lucide-react"
import { useMessages } from "@/components/providers/message-provider"
import { Conversation } from "@/types/message"
import { GroupInfoDialog } from "./group-info-dialog"
import { useAuth } from "@/lib/auth-context"

interface ConversationHeaderProps {
  conversation: Conversation
}

export function ConversationHeader({ conversation }: ConversationHeaderProps) {
  const { user: currentUser } = useAuth()
  const { deleteConversation } = useMessages()
  const [showGroupInfo, setShowGroupInfo] = useState(false)

  // Get the display name for a conversation
  const getConversationName = () => {
    if (conversation.is_group) {
      return conversation.name || "Groupe sans nom"
    }
    
    // For direct messages, show the other user's name
    if (conversation.users && conversation.users.length > 0) {
      // Find users other than the current user
      const otherUsers = conversation.users.filter(user => 
        user.id !== currentUser?.id
      )
      
      if (otherUsers.length > 0) {
        return otherUsers[0].name
      }
      
      // Fallback to first user's name if needed
      return conversation.users[0].name
    }
    
    return "Conversation"
  }

  // Get the avatar for a conversation
  const getConversationAvatar = () => {
    if (conversation.image_url) {
      return conversation.image_url
    }
    
    if (!conversation.is_group && conversation.users && conversation.users.length > 0) {
      // Find users other than the current user
      const otherUsers = conversation.users.filter(user => 
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

  // Get the online status display (in a real app, you'd check if users are online)
  const getStatusText = () => {
    if (conversation.is_group && conversation.users) {
      return `${conversation.users.length} participants`
    }
    return "En ligne" // In a real app, you'd have real online status
  }

  // Check if current user is admin in group
  const isAdmin = () => {
    if (!conversation.is_group || !currentUser) return false
    return conversation.pivot?.is_admin || false
  }

  const handleDeleteConversation = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette conversation ?")) {
      await deleteConversation(conversation.id)
    }
  }

  return (
    <div className="border-b dark:border-gray-700 p-3 flex items-center justify-between">
      <div className="flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={getConversationAvatar()} alt={getConversationName()} />
          <AvatarFallback>
            {getConversationName()
              .split(" ")
              .map(part => part[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{getConversationName()}</h2>
          <p className="text-xs text-gray-500">{getStatusText()}</p>
        </div>
      </div>
      
      <div className="flex items-center">
        {/* These buttons would be functional in a complete app */}
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Video className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-500">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {conversation.is_group && (
              <>
                <DropdownMenuItem onClick={() => setShowGroupInfo(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Infos du groupe
                </DropdownMenuItem>
                
                {isAdmin() && (
                  <DropdownMenuItem>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Ajouter des participants
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
              </>
            )}
            
            <DropdownMenuItem onClick={handleDeleteConversation} className="text-red-500">
              {conversation.is_group ? (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Quitter le groupe
                </>
              ) : (
                <>
                  <Trash className="h-4 w-4 mr-2" />
                  Supprimer la conversation
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {conversation.is_group && (
        <GroupInfoDialog
          conversation={conversation}
          open={showGroupInfo}
          onOpenChange={setShowGroupInfo}
        />
      )}
    </div>
  )
}