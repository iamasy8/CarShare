"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  MoreVertical, 
  Phone, 
  Video, 
  ImageIcon, 
  Paperclip, 
  Send, 
  Info, 
  ChevronLeft, 
  Loader2 
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { cn, useRealApi } from "@/lib/utils"
import { messageService } from "@/lib/api/messages/messageService"
import { 
  isBookingConversation, 
  extractBookingId, 
  groupMessagesByDate, 
  safeFormatDate, 
  createUIMessage,
  type MessageWithDate
} from "@/lib/api/messages/messageUtils"
import { useAuth } from "@/lib/auth-context"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { Message, Conversation } from "@/lib/api/messages/types"
import { listenToPrivateChannel, stopListeningToPrivateChannel } from "@/lib/echo"

// Mock data for testing when API is not available
const mockConversation = {
  id: 1,
  user: {
    id: 101,
    name: "Marie Lefèvre",
    avatar: "/placeholder.svg",
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
    // Additional mock messages removed for brevity
  ],
}

/**
 * Get all conversations with a specific user
 * @param conversations - All conversations
 * @param userId - ID of the current user
 * @param otherUserId - ID of the other user
 */
const getConversationsWithUser = (
  conversations: Conversation[],
  userId: number,
  otherUserId: number
): Conversation[] => {
  return conversations.filter(conv => {
    // Check if this conversation involves both users
    const participants = conv.participantIds || [];
    return participants.includes(otherUserId) && participants.includes(userId);
  });
};

interface ChatWindowProps {
  conversationId?: number | string
  onBack?: () => void
  className?: string
  isMobile?: boolean
}

export default function ChatWindow({ 
  conversationId, 
  onBack, 
  className, 
  isMobile = false 
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated, user } = useAuth()
  const isUsingRealApi = useRealApi()
  const queryClient = useQueryClient()
  const [lastReceivedMessageId, setLastReceivedMessageId] = useState<number | null>(null)
  const [otherUserId, setOtherUserId] = useState<number | null>(null)

  // Track which messages have been marked as read
  const markedAsReadRef = useRef<Record<number, boolean>>({})

  // Fetch all conversations to find those with the same user
  const { data: allConversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messageService.getConversations(),
    enabled: isUsingRealApi && isAuthenticated && !!conversationId && !isBookingConversation(conversationId),
  });

  // Fetch conversation data from API
  const {
    data: conversationData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['conversation', conversationId, otherUserId, user?.id],
    queryFn: async () => {
      // Check if the conversation ID is valid
      if (!conversationId) {
        throw new Error('Invalid conversation ID');
      }
      
      // Handle different conversation ID formats
      if (isBookingConversation(conversationId)) {
        // Extract the booking ID
        const bookingId = extractBookingId(conversationId);
        if (!bookingId) {
          throw new Error('Invalid booking conversation ID');
        }
        
        // Fetch booking messages
        const bookingMessages = await messageService.getBookingMessages(bookingId);
        
        // Set the other user ID
        if (bookingMessages.otherUser?.id) {
          setOtherUserId(bookingMessages.otherUser.id);
        }
        
        // Convert booking messages to conversation format
        return {
          conversation: {
            id: conversationId,
            participantIds: [user?.id || 0, bookingMessages.otherUser?.id || 0],
            otherParticipant: bookingMessages.otherUser,
            lastMessage: bookingMessages.messages[bookingMessages.messages.length - 1],
            unreadCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          messages: bookingMessages.messages,
          totalPages: 1
        };
      } else {
        // Get the conversation to find the other user's ID
        const convData = await messageService.getConversation(conversationId);
        
        // Check if we have a valid conversation and other participant
        if (!convData?.conversation?.otherParticipant?.id || !user?.id) {
          return convData; // Return original data if we can't get user IDs
        }
        
        // Get the other user's ID
        const otherParticipantId = convData.conversation.otherParticipant.id;
        setOtherUserId(otherParticipantId);
        
        try {
          // Get all conversations for the current user
          const allConversations = await messageService.getConversations();
          
          // Filter conversations with the same other user
          const conversationsWithUser = getConversationsWithUser(
            allConversations.conversations,
            user.id,
            otherParticipantId
          );
          
          console.log(`Found ${conversationsWithUser.length} conversations with user ${otherParticipantId}`);
          
          // If we only have one conversation, return the original data
          if (conversationsWithUser.length <= 1) {
            return convData;
          }
          
          // Get all messages from all conversations with this user
          const allMessages: Message[] = [];
          const conversationIds = conversationsWithUser.map(conv => conv.id);
          
          // Fetch messages from each conversation
          for (const convId of conversationIds) {
            try {
              const convMessages = await messageService.getConversation(convId);
              if (convMessages?.messages?.length) {
                allMessages.push(...convMessages.messages);
              }
            } catch (error) {
              console.error(`Error fetching messages for conversation ${convId}:`, error);
            }
          }
          
          // Sort messages by date
          allMessages.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateA - dateB;
          });
          
          console.log(`Combined ${allMessages.length} messages from all conversations with user ${otherParticipantId}`);
          
          // Return combined data
          return {
            conversation: convData.conversation,
            messages: allMessages,
            totalPages: convData.totalPages
          };
        } catch (error) {
          console.error('Error combining messages:', error);
          // Return original data if there was an error
          return convData;
        }
      }
    },
    enabled: isUsingRealApi && isAuthenticated && !!conversationId,
  })

  // Set up automatic polling for the active conversation
  useEffect(() => {
    if (isUsingRealApi && isAuthenticated && conversationId) {
      console.log('Setting up automatic polling for conversation:', conversationId);
      
      // Poll every 3 seconds for new messages in the current conversation
      const interval = setInterval(() => {
        console.log('Polling for new messages in conversation:', conversationId);
        refetch();
      }, 3000);
      
      // Clean up interval on unmount or when conversation changes
      return () => {
        console.log('Cleaning up polling for conversation:', conversationId);
        clearInterval(interval);
      };
    }
  }, [isUsingRealApi, isAuthenticated, conversationId, refetch]);

  // Set up real-time message listener
  useEffect(() => {
    if (isUsingRealApi && isAuthenticated && user?.id && conversationId) {
      const channelName = `user.${user.id}`;
      
      try {
        // Listen for the message.sent event to update the current conversation
        listenToPrivateChannel(channelName, 'message.sent', (data) => {
          console.log('Chat window received message.sent event:', data);
          
          // Check if this message involves the current other user
          const senderId = data.senderId || data.sender_id;
          const receiverId = data.receiverId || data.receiver_id;
          
          // If otherUserId is set, check if this message involves that user
          if (otherUserId) {
            const isMessageWithCurrentUser = senderId === otherUserId || receiverId === otherUserId;
            
            if (isMessageWithCurrentUser) {
              console.log('Updating current conversation with new message from/to current user');
              
              // Set the last received message ID to trigger re-render
              setLastReceivedMessageId(data.id);
              
              // Force a refetch to get all messages
              refetch();
            }
          } else {
            // If otherUserId is not set yet, check if this message is for the current conversation
            const msgConversationId = data.conversationId || data.conversation_id;
            const isForCurrentConversation = msgConversationId == conversationId;
            
            if (isForCurrentConversation) {
              console.log('Updating current conversation with new message');
              
              // Set the last received message ID to trigger re-render
              setLastReceivedMessageId(data.id);
              
              // Force a refetch
              refetch();
            }
          }
        });
        
        // Cleanup function
        return () => {
          stopListeningToPrivateChannel(channelName, 'message.sent');
        };
      } catch (error) {
        console.error('Error setting up real-time listener:', error);
      }
    }
  }, [isUsingRealApi, isAuthenticated, user?.id, conversationId, otherUserId, refetch, queryClient]);

  // Mutation for sending a new message
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, conversationId }: { content: string, conversationId: string | number }) => {
      if (isBookingConversation(conversationId)) {
        // Extract the booking ID
        const bookingId = extractBookingId(conversationId);
        if (!bookingId) {
          throw new Error('Invalid booking conversation ID');
        }
        
        // Send the message for a booking
        return messageService.sendBookingMessage(bookingId, content);
      } else {
        // Send a regular message
        return messageService.sendMessage(conversationId, content);
      }
    },
    onSuccess: (data) => {
      // Clear the input
      setNewMessage("");
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      
      // Invalidate and refetch conversation
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId, otherUserId, user?.id] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error("Échec de l'envoi du message. Veuillez réessayer.");
    }
  });

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !conversationId) return;
    
    try {
      sendMessageMutation.mutate({ 
        content: newMessage.trim(), 
        conversationId: conversationId 
      });
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      toast.error("Échec de l'envoi du message. Veuillez réessayer.");
    }
  };

  // Scroll to bottom when messages change or when a new message is received
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversationData?.messages?.length, lastReceivedMessageId])

  // Mark messages as read
  useEffect(() => {
    if (isUsingRealApi && isAuthenticated && conversationId && conversationData) {
      // Get unread messages from the other user that haven't been marked yet
      const unreadMessages = conversationData.messages
        .filter(msg => {
          const shouldMark = !msg.isRead && 
                           msg.senderId !== user?.id && 
                           !markedAsReadRef.current[msg.id];
          
          if (shouldMark) {
            // Mark this message as "being processed"
            markedAsReadRef.current[msg.id] = true;
          }
          
          return shouldMark;
        })
        .map(msg => msg.id);
      
      // If there are unread messages, mark them as read
      if (unreadMessages.length > 0) {
        messageService.markMessagesAsRead(conversationId, unreadMessages)
          .then(() => {
            // Only invalidate the conversations list, not the current conversation
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
          })
          .catch(error => {
            console.error('Error marking messages as read:', error);
            // Remove the messages from the "being processed" list
            unreadMessages.forEach(id => {
              delete markedAsReadRef.current[id];
            });
          });
      }
    }
  }, [isUsingRealApi, isAuthenticated, conversationId, conversationData?.messages, user?.id, queryClient]);

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

  // Show loading state
  if (isUsingRealApi && isLoading) {
    return (
      <div className={cn("flex flex-col h-full items-center justify-center p-4", className)}>
        <Loader2 className="h-8 w-8 text-red-600 animate-spin mb-4" />
        <p className="text-gray-500">Chargement de la conversation...</p>
      </div>
    )
  }

  // Show error state
  if (isUsingRealApi && isError) {
    return (
      <div className={cn("flex flex-col h-full items-center justify-center p-4 text-center", className)}>
        <div className="max-w-md">
          <h3 className="text-lg font-medium mb-2">Erreur de chargement</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {error instanceof Error ? error.message : "Une erreur s'est produite lors du chargement de la conversation."}
          </p>
          <Button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['conversation', conversationId, otherUserId, user?.id] })}
            className="bg-red-600 hover:bg-red-700"
          >
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  // Determine which data to use (real or mock)
  const currentUser = user || { id: 0 }
  let otherUser = mockConversation.user
  
  if (isUsingRealApi && conversationData) {
    // Use a local placeholder instead of external URLs for avatars
    let avatarUrl = "/placeholder.svg";
    if (conversationData.conversation.otherParticipant?.avatar && 
        !conversationData.conversation.otherParticipant.avatar.includes('randomuser.me')) {
      avatarUrl = conversationData.conversation.otherParticipant.avatar;
    }
    
    otherUser = {
      id: conversationData.conversation.otherParticipant?.id || 0,
      name: conversationData.conversation.otherParticipant?.name || "Utilisateur",
      avatar: avatarUrl,
      isOnline: false
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Process messages for display
  let uiMessages: MessageWithDate[] = [];
  if (isUsingRealApi && conversationData) {
    console.log('Processing messages for display:', conversationData.messages);
    uiMessages = conversationData.messages.map(msg => {
      // Create a UI message with consistent properties
      return createUIMessage(msg, currentUser.id) as MessageWithDate;
    });
  } else {
    uiMessages = mockConversation.messages.map(msg => {
      // For mock data, ensure consistent properties
      return {
        id: msg.id,
        text: msg.text,
        content: msg.text,
        time: msg.time,
        createdAt: msg.time,
        isOwn: msg.isOwn
      } as MessageWithDate;
    });
  }

  // Group messages by date
  const groupedMessages = groupMessagesByDate(uiMessages);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        {isMobile && (
          <Button variant="ghost" size="icon" className="mr-2" onClick={onBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center flex-1">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={otherUser.avatar || "/placeholder.svg"} alt={otherUser.name} />
            <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{otherUser.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {otherUser.isOnline ? "En ligne" : "Hors ligne"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              console.log('Manually refreshing conversation');
              refetch();
            }}
            title="Actualiser la conversation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
              <path d="M16 21h5v-5"></path>
            </svg>
          </Button>
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

            {messages.map((message: MessageWithDate) => (
              <div key={message.id} className={cn("flex", message.isOwn ? "justify-end" : "justify-start")}>
                <div className="flex items-end gap-2 max-w-[80%]">
                  {!message.isOwn && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={otherUser.avatar || "/placeholder.svg"}
                        alt={otherUser.name}
                      />
                      <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
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
                    <p>{message.content}</p>
                    <span
                      className={cn(
                        "text-xs block mt-1",
                        message.isOwn ? "text-red-100" : "text-gray-500 dark:text-gray-400",
                      )}
                    >
                      {safeFormatDate(message.createdAt, 'p')}
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
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
