"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Loader2 } from "lucide-react"
import { cn, useRealApi } from "@/lib/utils"
import { messageService } from "@/lib/api/messages/messageService"
import { convertToUIConversations } from "@/lib/api/messages/messageUtils"
import { useAuth } from "@/lib/auth-context"
import { useQuery } from "@tanstack/react-query"
import { format, formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { listenToPrivateChannel, stopListeningToPrivateChannel } from "@/lib/echo"
import { useQueryClient } from "@tanstack/react-query"
import { NewConversationModal } from "./new-conversation-modal"
import type { UIConversation, Conversation } from "@/lib/api/messages/types"

// Mock conversations for testing
const mockConversations: UIConversation[] = [
  {
    id: 1,
    user: {
      id: 101,
      name: "Marie Lefèvre",
      avatar: "/placeholder.svg",
      isOnline: true,
    },
    lastMessage: {
      text: "Parfait, merci pour ces informations. Je vais procéder à la réservation.",
      time: "il y a 2 heures",
      isRead: false,
      isOwn: false,
    },
    unreadCount: 1,
  },
  {
    id: 2,
    user: {
      id: 102,
      name: "Thomas Dubois",
      avatar: "/placeholder.svg",
      isOnline: false,
    },
    lastMessage: {
      text: "D'accord, je vous attendrai au point de rendez-vous convenu.",
      time: "hier",
      isRead: true,
      isOwn: true,
    },
    unreadCount: 0,
  },
  {
    id: 3,
    user: {
      id: 103,
      name: "Sophie Martin",
      avatar: "/placeholder.svg",
      isOnline: true,
    },
    lastMessage: {
      text: "Est-ce que la voiture a un GPS intégré ?",
      time: "il y a 3 jours",
      isRead: true,
      isOwn: false,
    },
    unreadCount: 0,
  },
];

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

/**
 * Group conversations by user and return only the most recent conversation per user
 * @param conversations - Array of conversations to group
 * @param currentUserId - ID of the current user
 */
const groupConversationsByUser = (conversations: Conversation[], currentUserId: number): Conversation[] => {
  // Map to store the most recent conversation for each user
  const userConversations = new Map<number, Conversation>();
  
  conversations.forEach(conversation => {
    // Find the other participant's ID
    const otherParticipantId = conversation.otherParticipant?.id;
    
    // Skip if we can't identify the other participant
    if (!otherParticipantId) return;
    
    // If we already have a conversation with this user, compare timestamps
    if (userConversations.has(otherParticipantId)) {
      const existingConv = userConversations.get(otherParticipantId)!;
      
      // Parse dates for comparison
      const existingDate = new Date(existingConv.updatedAt).getTime();
      const currentDate = new Date(conversation.updatedAt).getTime();
      
      // Replace if current conversation is more recent
      if (currentDate > existingDate) {
        userConversations.set(otherParticipantId, conversation);
      }
    } else {
      // First conversation with this user
      userConversations.set(otherParticipantId, conversation);
    }
  });
  
  // Convert map values to array
  return Array.from(userConversations.values());
};

interface ChatListProps {
  onSelectConversation?: (conversationId: string | number) => void
  selectedConversationId?: string | number
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
    refetchInterval: 30000, // Refetch every 30 seconds as a fallback
  })
  
  // Convert API conversations to UI format
  const [conversations, setConversations] = useState<UIConversation[]>(mockConversations)
  
  // Update conversations when API data changes
  useEffect(() => {
    if (isUsingRealApi && apiConversations?.conversations && user?.id) {
      console.log('Processing conversations for user:', user.id);
      
      // Filter conversations to ensure they belong to the current user
      const userConversations = apiConversations.conversations.filter(conversation => {
        // Check if the current user is a participant
        return conversation.participantIds.includes(user.id);
      });
      
      console.log(`Filtered ${apiConversations.conversations.length} conversations to ${userConversations.length} for user ${user.id}`);
      
      // Group conversations by other user ID
      const uniqueConversations = groupConversationsByUser(userConversations, user.id);
      
      console.log(`Grouped into ${uniqueConversations.length} unique user conversations`);
      
      // Convert to UI format
      const uiConversations = convertToUIConversations(
        uniqueConversations,
        user.id
      );
      
      setConversations(uiConversations);
    }
  }, [isUsingRealApi, apiConversations, user?.id]);

  // Set up real-time conversation listening with better error handling
  useEffect(() => {
    if (isUsingRealApi && isAuthenticated && user && user.id) {
      // Listen to the user's private channel for conversation updates
      const channelName = `user.${user.id}`;
      
      try {
        // Listen for the message.sent event to update conversations list
        listenToPrivateChannel(channelName, 'message.sent', (data) => {
          console.log('Received message.sent event:', data);
          // Invalidate conversations query to refresh the list
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        });
        
        // Also listen for messages.read event to update unread counts
        listenToPrivateChannel(channelName, 'messages.read', (data) => {
          console.log('Received messages.read event:', data);
          // Invalidate conversations query to refresh the list
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        });
        
        // Cleanup function
        return () => {
          stopListeningToPrivateChannel(channelName, 'message.sent');
          stopListeningToPrivateChannel(channelName, 'messages.read');
        };
      } catch (error) {
        console.error('Error setting up real-time listeners:', error);
      }
    }
  }, [isUsingRealApi, isAuthenticated, user?.id, queryClient]);

  // Add a polling mechanism as a fallback for real-time updates
  useEffect(() => {
    if (isUsingRealApi && isAuthenticated) {
      // Set up polling every 15 seconds to refresh conversations
      const interval = setInterval(() => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      }, 15000);
      
      return () => clearInterval(interval);
    }
  }, [isUsingRealApi, isAuthenticated, queryClient]);

  // Filter conversations based on search query
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
                key={`conversation-${conversation.id}`}
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
                      <h3 className="font-medium truncate">{conversation.user.name}</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                        {conversation.lastMessage.time}
                      </span>
                    </div>
                    <p className={cn(
                        "text-sm truncate",
                      conversation.unreadCount > 0 && !conversation.lastMessage.isOwn
                        ? "font-medium text-gray-900 dark:text-gray-100"
                        : "text-gray-500 dark:text-gray-400",
                    )}>
                      {conversation.lastMessage.isOwn && "Vous: "}{conversation.lastMessage.text}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && !conversation.lastMessage.isOwn && (
                    <span className="ml-2 bg-red-600 text-white text-xs font-medium rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
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
