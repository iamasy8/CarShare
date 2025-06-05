"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MoreVertical, Phone, Video, ImageIcon, Paperclip, Send, Info, ChevronLeft, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn, useRealApi } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { messageService, type Message, type Conversation } from "@/lib/api/messages/messageService"
import { useAuth } from "@/lib/auth-context"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { listenToPrivateChannel, stopListeningToPrivateChannel } from "@/lib/echo"

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
  conversationId?: number | string
  onBack?: () => void
  className?: string
  isMobile?: boolean
}

export default function ChatWindow({ conversationId, onBack, className, isMobile = false }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated, user } = useAuth()
  const isUsingRealApi = useRealApi()
  const queryClient = useQueryClient()

  // Add a ref to track which messages have been marked as read
  const markedAsReadRef = useRef<Record<number, boolean>>({})

  // Fetch conversation data from API if conversationId is provided
  const {
    data: conversationData,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      try {
        // Check if the conversation ID is valid
        if (!conversationId) {
          throw new Error('Invalid conversation ID');
        }
        
        // Convert the conversationId to string to ensure we can check its format
        const convIdStr = String(conversationId);
        
        // Handle different conversation ID formats
        if (convIdStr.startsWith('booking_')) {
          // Extract the booking ID from the conversation ID
          const bookingId = convIdStr.split('_')[1];
          if (!bookingId) {
            throw new Error('Invalid booking conversation ID');
          }
          
          // Fetch booking messages instead
          const bookingMessages = await messageService.getBookingMessages(Number(bookingId));
          
          // Convert booking messages to conversation format
          return {
            conversation: {
              id: convIdStr,
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
          // Regular conversation
          return messageService.getConversation(conversationId);
        }
      } catch (error) {
        console.error('Error fetching conversation:', error);
        throw error;
      }
    },
    enabled: isUsingRealApi && isAuthenticated && !!conversationId,
  })

  // Mutation for sending a message
  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: number | string, content: string }) => {
      const convIdStr = String(conversationId);
      
      // Handle different conversation ID formats
      if (convIdStr.startsWith('booking_')) {
        // Extract the booking ID from the conversation ID
        const bookingId = convIdStr.split('_')[1];
        if (!bookingId) {
          throw new Error('Invalid booking conversation ID');
        }
        
        // Send message to booking conversation
        return messageService.sendBookingMessage(Number(bookingId), content);
      } else {
        // Regular conversation
        return messageService.sendMessage(conversationId, content);
      }
    },
    onSuccess: (data) => {
      // Clear the message input first
      setNewMessage("");
      
      // Add the new message to the local state immediately for better UX
      if (conversationData && data) {
        // Create a new message object from the response data
        const newMessage = data;
        
        // Update the conversation data with the new message
        const updatedMessages = [...conversationData.messages, newMessage];
        
        // Use queryClient.setQueryData to update the cache without triggering a refetch
        queryClient.setQueryData(['conversation', conversationId], {
          ...conversationData,
          messages: updatedMessages,
        });
      }
      
      // Then invalidate queries to refresh data from the server
      // Use a small delay to ensure the UI is responsive first
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
        queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
      }, 300);
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error("Impossible d'envoyer le message. Veuillez réessayer.");
    }
  })

  // Fix the real-time message listening with proper cleanup
  useEffect(() => {
    if (isUsingRealApi && isAuthenticated && user && user.id) {
      // First, make sure we clean up any existing listeners
      const channelName = `user.${user.id}`;
      stopListeningToPrivateChannel(channelName, 'message.sent');
      stopListeningToPrivateChannel(channelName, 'messages.read');
      
      // Then set up new listeners
      console.log(`Setting up new listeners for conversation ${conversationId}`);
      
      // Listen for the message.sent event
      listenToPrivateChannel(channelName, 'message.sent', (data) => {
        // Check if the message is for the current conversation
        if (data.conversationId === conversationId) {
          // Invalidate queries to refresh the messages
          queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      });
      
      // Listen for the messages.read event
      listenToPrivateChannel(channelName, 'messages.read', (data) => {
        // Invalidate queries to refresh the read status
        queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      });
      
      // Cleanup function
      return () => {
        console.log(`Cleaning up listeners for conversation ${conversationId}`);
        stopListeningToPrivateChannel(channelName, 'message.sent');
        stopListeningToPrivateChannel(channelName, 'messages.read');
      };
    }
  }, [isUsingRealApi, isAuthenticated, user?.id, conversationId, queryClient]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversationData])

  // Fix the mark messages as read functionality to prevent loops
  useEffect(() => {
    if (isUsingRealApi && isAuthenticated && conversationId && conversationData) {
      // Get unread messages from the other user that haven't been marked yet
      const unreadMessages = conversationData.messages
        .filter(msg => {
          // Only include messages that:
          // 1. Are not read
          // 2. Are from the other user
          // 3. Haven't been marked as read in this session
          const shouldMark = !msg.isRead && 
                            msg.senderId !== user?.id && 
                            !markedAsReadRef.current[msg.id];
          
          if (shouldMark) {
            // Mark this message as "being processed" to prevent duplicate requests
            markedAsReadRef.current[msg.id] = true;
          }
          
          return shouldMark;
        })
        .map(msg => msg.id);
      
      // If there are unread messages, mark them as read
      if (unreadMessages.length > 0) {
        try {
          console.log(`Marking ${unreadMessages.length} messages as read for conversation ${conversationId}`);
          console.log('Message IDs:', unreadMessages);
          
          // Use a safer approach without waiting for the promise
          messageService.markMessagesAsRead(conversationId, unreadMessages)
            .then((response) => {
              console.log(`Marked messages as read:`, response);
              // Only invalidate the conversations list, not the current conversation
              // to prevent an infinite loop
              queryClient.invalidateQueries({ queryKey: ['conversations'] });
            })
            .catch(error => {
              console.error('Error marking messages as read:', error);
              // If there was an error, remove the messages from the "being processed" list
              unreadMessages.forEach(id => {
                delete markedAsReadRef.current[id];
              });
            });
        } catch (error) {
          console.error('Error in marking messages as read:', error);
          // If there was an error, remove the messages from the "being processed" list
          unreadMessages.forEach(id => {
            delete markedAsReadRef.current[id];
          });
        }
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
            onClick={() => queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] })}
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
  let currentConversation: any = { messages: [] }
  let otherUser = mockConversation.user
  
  if (isUsingRealApi && conversationData) {
    currentConversation = {
      ...conversationData.conversation,
      messages: conversationData.messages || []
    }
    
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
  } else {
    currentConversation = mockConversation
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      if (isUsingRealApi && isAuthenticated && conversationId) {
        // Send to real API
        sendMessageMutation.mutate({ 
          conversationId, 
          content: newMessage.trim() 
        })
      } else {
        // Simulate sending in mock mode
        console.log("Sending message in mock mode:", newMessage)
      }
      
      setNewMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Process messages for display
  let messages = []
  if (isUsingRealApi && conversationData) {
    messages = conversationData.messages.map((msg: Message) => {
      // Make sure we have a valid date
      let messageTime;
      try {
        messageTime = new Date(msg.createdAt);
        // Check if the date is valid
        if (isNaN(messageTime.getTime())) {
          messageTime = new Date(); // Fallback to current date if invalid
        }
      } catch (e) {
        console.error("Invalid date format:", msg.createdAt);
        messageTime = new Date(); // Fallback to current date
      }
      
      return {
        id: msg.id,
        text: msg.content,
        time: messageTime,
        isOwn: msg.senderId === currentUser.id
      };
    });
  } else {
    messages = mockConversation.messages;
  }

  // Group messages by date
  const groupedMessages: { [key: string]: any[] } = {}
  messages.forEach((message) => {
    try {
      const date = format(message.time, "P", { locale: fr });
      if (!groupedMessages[date]) {
        groupedMessages[date] = [];
      }
      groupedMessages[date].push(message);
    } catch (e) {
      console.error("Error formatting date:", e);
      // Skip this message if we can't format its date
    }
  });

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
                    <p>{message.text}</p>
                    <span
                      className={cn(
                        "text-xs block mt-1",
                        message.isOwn ? "text-red-100" : "text-gray-500 dark:text-gray-400",
                      )}
                    >
                      {(() => {
                        try {
                          return format(message.time, "p", { locale: fr });
                        } catch (e) {
                          console.error("Error formatting time:", e);
                          return ""; // Return empty string if formatting fails
                        }
                      })()}
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
