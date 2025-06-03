"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Loader2 } from "lucide-react"
import { cn, useRealApi } from "@/lib/utils"
import { messageService, type Conversation } from "@/lib/api/messages/messageService"
import { useAuth } from "@/lib/auth-context"
import { useQuery } from "@tanstack/react-query"
import { format, formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { listenToPrivateChannel, stopListeningToPrivateChannel } from "@/lib/echo"
import { useQueryClient } from "@tanstack/react-query"
import { NewConversationModal } from "./new-conversation-modal"

// Define the type for conversation participant
interface ConversationUser {
  id: number;
  name: string;
  avatar?: string;
  isOnline?: boolean;
}

// Define the type for our UI conversation format
interface UIConversation {
  id: string | number;
  user: ConversationUser;
  lastMessage: {
    text: string;
    time: string;
    isRead: boolean;
    isOwn: boolean;
  };
  unreadCount: number;
}

// Mock data for conversations
const mockConversations = [
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

// Format the time for display
const formatMessageTime = (date: Date | string) => {
  if (!date) return "";
  
  const messageDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    // Today, show time
    return format(messageDate, 'HH:mm', { locale: fr });
  } else if (diffInDays === 1) {
    // Yesterday
    return 'Hier';
  } else if (diffInDays < 7) {
    // Within the last week, show day name
    return format(messageDate, 'EEE', { locale: fr });
  } else {
    // Older, show date
    return format(messageDate, 'dd/MM', { locale: fr });
  }
};

interface ChatListProps {
  onSelectConversation?: (conversationId: number) => void
  selectedConversationId?: number
  className?: string
}

// Add a function to handle creating a new conversation
const handleNewConversation = () => {
  // You can implement this to open a modal or navigate to a new conversation page
  console.log("Creating a new conversation");
  // For now, we'll just alert the user
  alert("Cette fonctionnalité sera bientôt disponible!");
};

export default function ChatList({ onSelectConversation, selectedConversationId, className }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { isAuthenticated, user } = useAuth()
  const isUsingRealApi = useRealApi()
  const queryClient = useQueryClient()
  const [isNewConversationModalOpen, setIsNewConversationModalOpen] = useState(false)
  
  // Fetch conversations from API
  const { 
    data: apiConversations = { conversations: [], totalPages: 1 }, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messageService.getConversations(),
    enabled: isUsingRealApi && isAuthenticated,
  })
  
  // State to hold the conversations data (either mock or real)
  const [conversations, setConversations] = useState<UIConversation[]>(mockConversations)
  
  // Process API data when it changes
  useEffect(() => {
    if (isUsingRealApi && isAuthenticated) {
      if (apiConversations.conversations && apiConversations.conversations.length > 0) {
        // Transform the API conversations to match our UI format
        const formattedConversations = apiConversations.conversations.map(conv => {
          // Extract the other user from the conversation
          const otherUser = conv.otherParticipant || { id: 0, name: "Utilisateur" } as ConversationUser;
          
          return {
            id: conv.id,
            user: {
              id: otherUser.id,
              name: otherUser.name || "Utilisateur",
              avatar: otherUser.avatar || "/placeholder.svg?height=40&width=40",
              isOnline: false, // We don't have online status from API
            },
            lastMessage: {
              text: conv.lastMessage?.content || "Nouvelle conversation",
              time: formatMessageTime(conv.lastMessage?.createdAt || conv.createdAt),
              isRead: !conv.unreadCount || conv.unreadCount === 0,
              isOwn: conv.lastMessage?.senderId === user?.id,
            },
            unreadCount: conv.unreadCount || 0,
          };
        });
        
        console.log("Formatted conversations:", formattedConversations);
        setConversations(formattedConversations);
      } else {
        // If no conversations, show empty array
        setConversations([]);
      }
    } else {
      // In development mode with mock data
      setConversations(mockConversations);
    }
  }, [apiConversations, isAuthenticated, isUsingRealApi, user]);

  // Set up real-time conversation listening
  useEffect(() => {
    if (isUsingRealApi && isAuthenticated && user && user.id) {
      // Listen to the user's private channel for conversation updates
      const channelName = `user.${user.id}`;
      
      // Listen for the message.sent event to update conversations list
      listenToPrivateChannel(channelName, 'message.sent', () => {
        // Invalidate conversations query to refresh the list
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      });
      
      // Cleanup function
      return () => {
        stopListeningToPrivateChannel(channelName, 'message.sent');
      };
    }
  }, [isUsingRealApi, isAuthenticated, user, queryClient]);

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
        {isLoading ? (
          <div className="flex justify-center items-center h-full p-4">
            <Loader2 className="h-6 w-6 text-gray-400 animate-spin mr-2" />
            <p className="text-gray-500">Chargement des conversations...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Erreur lors du chargement des conversations</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={() => setIsNewConversationModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Nouvelle conversation
            </Button>
          </div>
        ) : filteredConversations.length > 0 ? (
          <ul className="divide-y">
            {filteredConversations.map((conversation) => (
              <li
                key={`conversation-${conversation.id || Math.random().toString(36).substr(2, 9)}`}
                className={cn(
                  "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",
                  selectedConversationId === conversation.id && "bg-gray-100 dark:bg-gray-800",
                )}
                onClick={() => onSelectConversation?.(typeof conversation.id === 'string' ? parseInt(conversation.id) : conversation.id)}
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
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={() => setIsNewConversationModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Nouvelle conversation
            </Button>
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <Button 
          className="w-full bg-red-600 hover:bg-red-700 gap-2"
          onClick={() => setIsNewConversationModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Nouvelle conversation
        </Button>
      </div>
      
      <NewConversationModal
        open={isNewConversationModalOpen}
        onClose={() => setIsNewConversationModalOpen(false)}
        onSuccess={onSelectConversation}
      />
    </div>
  )
}
