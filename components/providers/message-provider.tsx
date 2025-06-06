"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import axios from "axios"
import { useAuth } from "@/lib/auth-context"
import { Conversation, Message, User } from "@/types/message"

interface MessageContextType {
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  isLoading: boolean
  loadConversations: () => Promise<void>
  selectConversation: (id: number) => Promise<void>
  sendMessage: (conversationId: number, body: string, image?: File, file?: File) => Promise<void>
  createConversation: (userIds: number[], isGroup: boolean, name?: string, imageUrl?: string) => Promise<Conversation>
  updateMessage: (messageId: number, body: string) => Promise<void>
  deleteMessage: (messageId: number) => Promise<void>
  markConversationAsRead: (conversationId: number) => Promise<void>
  updateConversation: (conversationId: number, data: { name?: string; imageUrl?: string }) => Promise<void>
  addUsersToConversation: (conversationId: number, userIds: number[]) => Promise<void>
  removeUserFromConversation: (conversationId: number, userId: number) => Promise<void>
  deleteConversation: (conversationId: number) => Promise<void>
  totalUnreadCount: number
}

const MessageContext = createContext<MessageContextType | undefined>(undefined)

export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalUnreadCount, setTotalUnreadCount] = useState(0)

  // Load all conversations for the user
  const loadConversations = useCallback(async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const token = localStorage.getItem('auth_token')
      const { data } = await axios.get("/api/conversations", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token || ''
        }
      })
      setConversations(data.conversations)
      
      // Calculate total unread messages
      const unreadTotal = data.conversations.reduce(
        (sum: number, conv: Conversation) => sum + (conv.messages_count || 0), 
        0
      )
      setTotalUnreadCount(unreadTotal)
    } catch (error) {
      console.error("Error loading conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Select and load a conversation
  const selectConversation = useCallback(async (id: number) => {
    if (!user) return

    try {
      setIsLoading(true)
      const token = localStorage.getItem('auth_token')
      const { data } = await axios.get(`/api/conversations/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token || ''
        }
      })
      
      // Log the data received from the server for debugging
      console.log('Current user:', user);
      console.log('Conversation data received:', data);
      
      setCurrentConversation(data.conversation)
      
      // Sort messages in chronological order (oldest to newest)
      const sortedMessages = [...data.messages.data].sort((a, b) => {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      })
      
      // Log the sorted messages for debugging
      console.log('Sorted messages:', sortedMessages.map(m => ({
        id: m.id,
        user_id: m.user_id,
        user_name: m.user?.name,
        body: m.body,
        isCurrentUser: m.user_id === user.id
      })));
      
      setMessages(sortedMessages)

      // Update conversations list to reflect read status
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === id ? { ...conv, messages_count: 0 } : conv
        )
      )
      
      // Recalculate total unread
      setTotalUnreadCount(prev => 
        prev - (conversations.find(c => c.id === id)?.messages_count || 0)
      )
    } catch (error) {
      console.error("Error loading conversation:", error)
    } finally {
      setIsLoading(false)
    }
  }, [user, conversations])

  // Send a new message
  const sendMessage = useCallback(async (conversationId: number, body: string, image?: File, file?: File) => {
    if (!user) return

    try {
      const formData = new FormData()
      if (body) formData.append("body", body)
      if (image) formData.append("image", image)
      if (file) {
        formData.append("file", file)
        formData.append("file_name", file.name)
      }

      const token = localStorage.getItem('auth_token')
      const { data } = await axios.post(`/api/conversations/${conversationId}/messages`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token || ''
        },
      })

      // Add the new message to the end of the current conversation (chronological order)
      setMessages(prev => [...prev, data.message])

      // Update the conversation in the list
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? {
                ...conv,
                updated_at: new Date().toISOString(),
                latest_message: data.message,
              }
            : conv
        )
      )
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }, [user])

  // Create a new conversation
  const createConversation = useCallback(async (
    userIds: number[], 
    isGroup: boolean, 
    name?: string, 
    imageUrl?: string
  ): Promise<Conversation> => {
    if (!user) throw new Error("User not authenticated")

    try {
      const token = localStorage.getItem('auth_token')
      const { data } = await axios.post("/api/conversations", {
        users: userIds,
        is_group: isGroup,
        name: name,
        image_url: imageUrl,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token || ''
        }
      })

      // Add the new conversation to the list
      setConversations(prev => [data.conversation, ...prev])

      return data.conversation
    } catch (error) {
      console.error("Error creating conversation:", error)
      throw error
    }
  }, [user])

  // Update a message
  const updateMessage = useCallback(async (messageId: number, body: string) => {
    if (!user) return

    try {
      const token = localStorage.getItem('auth_token')
      const { data } = await axios.put(`/api/messages/${messageId}`, { body }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token || ''
        }
      })

      // Update the message in the current conversation
      setMessages(prev =>
        prev.map(msg => (msg.id === messageId ? { ...msg, body } : msg))
      )

      // If it's the latest message, update the conversation preview
      setConversations(prev =>
        prev.map(conv =>
          conv.latest_message?.id === messageId
            ? { ...conv, latest_message: { ...conv.latest_message, body } }
            : conv
        )
      )
    } catch (error) {
      console.error("Error updating message:", error)
    }
  }, [user])

  // Delete a message
  const deleteMessage = useCallback(async (messageId: number) => {
    if (!user) return

    try {
      const token = localStorage.getItem('auth_token')
      await axios.delete(`/api/messages/${messageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token || ''
        }
      })

      // Remove the message from the current conversation
      setMessages(prev => prev.filter(msg => msg.id !== messageId))

      // If it was the latest message, we need to update the conversation preview
      // This is a simplification; in a real app, you'd need to fetch the new latest message
      setConversations(prev =>
        prev.map(conv =>
          conv.latest_message?.id === messageId
            ? { ...conv, latest_message: null }
            : conv
        )
      )
    } catch (error) {
      console.error("Error deleting message:", error)
    }
  }, [user])

  // Mark a conversation as read
  const markConversationAsRead = useCallback(async (conversationId: number) => {
    if (!user) return

    try {
      const token = localStorage.getItem('auth_token')
      await axios.post(`/api/conversations/${conversationId}/read`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token || ''
        }
      })

      // Update the conversation in the list
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId ? { ...conv, messages_count: 0 } : conv
        )
      )
      
      // Recalculate total unread
      setTotalUnreadCount(prev => 
        prev - (conversations.find(c => c.id === conversationId)?.messages_count || 0)
      )
    } catch (error) {
      console.error("Error marking conversation as read:", error)
    }
  }, [user, conversations])

  // Update a conversation (group name, image)
  const updateConversation = useCallback(async (
    conversationId: number, 
    data: { name?: string; imageUrl?: string }
  ) => {
    if (!user) return

    try {
      const token = localStorage.getItem('auth_token')
      const { data: responseData } = await axios.put(`/api/conversations/${conversationId}`, {
        name: data.name,
        image_url: data.imageUrl,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token || ''
        }
      })

      // Update the conversation in the list and current conversation if selected
      const updatedConversation = responseData.conversation
      
      setConversations(prev =>
        prev.map(conv => (conv.id === conversationId ? updatedConversation : conv))
      )
      
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(updatedConversation)
      }
    } catch (error) {
      console.error("Error updating conversation:", error)
    }
  }, [user, currentConversation])

  // Add users to a conversation
  const addUsersToConversation = useCallback(async (conversationId: number, userIds: number[]) => {
    if (!user) return

    try {
      const token = localStorage.getItem('auth_token')
      const { data } = await axios.post(`/api/conversations/${conversationId}/users`, {
        users: userIds
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token || ''
        }
      })

      // Update the current conversation if selected
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(data.conversation)
      }

      // Update the conversation in the list
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId ? { ...conv, users: data.conversation.users } : conv
        )
      )
    } catch (error) {
      console.error("Error adding users to conversation:", error)
    }
  }, [user, currentConversation])

  // Remove a user from a conversation
  const removeUserFromConversation = useCallback(async (conversationId: number, userId: number) => {
    if (!user) return

    try {
      const token = localStorage.getItem('auth_token')
      const { data } = await axios.delete(`/api/conversations/${conversationId}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token || ''
        }
      })

      // If the conversation was deleted, remove it from the list
      if (data.message === 'Conversation deleted') {
        setConversations(prev => prev.filter(conv => conv.id !== conversationId))
        if (currentConversation?.id === conversationId) {
          setCurrentConversation(null)
          setMessages([])
        }
        return
      }

      // Update the current conversation if selected
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(data.conversation)
      }

      // Update the conversation in the list
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId ? { ...conv, users: data.conversation.users } : conv
        )
      )
    } catch (error) {
      console.error("Error removing user from conversation:", error)
    }
  }, [user, currentConversation])

  // Delete a conversation
  const deleteConversation = useCallback(async (conversationId: number) => {
    if (!user) return

    try {
      const token = localStorage.getItem('auth_token')
      await axios.delete(`/api/conversations/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token || ''
        }
      })

      // Remove the conversation from the list
      setConversations(prev => prev.filter(conv => conv.id !== conversationId))

      // Clear current conversation if it was selected
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null)
        setMessages([])
      }
    } catch (error) {
      console.error("Error deleting conversation:", error)
    }
  }, [user, currentConversation])

  // Load conversations when user logs in
  useEffect(() => {
    if (user) {
      loadConversations()
    } else {
      setConversations([])
      setCurrentConversation(null)
      setMessages([])
    }
  }, [user, loadConversations])

  // Listen for new messages via Laravel Echo
  useEffect(() => {
    if (!user || !window.Echo) return

    // Listen for new messages in the current conversation
    if (currentConversation) {
      const channel = window.Echo.private(`conversation.${currentConversation.id}`)
        .listen('.message.sent', (e: { message: Message }) => {
          // Add the new message to the current conversation
          setMessages(prev => [...prev, e.message])
          
          // Mark it as read since the user is currently viewing this conversation
          axios.post(`/api/conversations/${currentConversation.id}/read`)
        })

      return () => {
        channel.stopListening('.message.sent')
      }
    }
  }, [user, currentConversation])

  // Listen for new conversations or messages in any conversation
  useEffect(() => {
    if (!user || !window.Echo) return

    const channel = window.Echo.private(`App.Models.User.${user.id}`)
      .listen('.conversation.updated', (e: { conversation: Conversation }) => {
        setConversations(prev => {
          // Check if the conversation exists in the list
          const exists = prev.some(conv => conv.id === e.conversation.id)
          
          if (exists) {
            // Update the existing conversation
            return prev.map(conv => 
              conv.id === e.conversation.id ? e.conversation : conv
            )
          } else {
            // Add the new conversation
            return [e.conversation, ...prev]
          }
        })
        
        // Update unread count
        if (e.conversation.messages_count && e.conversation.messages_count > 0) {
          setTotalUnreadCount(prev => prev + 1)
        }
      })

    return () => {
      channel.stopListening('.conversation.updated')
    }
  }, [user])

  // Effect to handle real-time message reception with Echo
  useEffect(() => {
    if (!user) return

    // Initialize Echo when user is available
    loadConversations()

    // Listen for new messages in conversations the user is part of
    const setupEchoListeners = () => {
      if (window.Echo) {
        conversations.forEach(conversation => {
          window.Echo.private(`conversation.${conversation.id}`)
            .listen('MessageSent', (e: { message: Message }) => {
              // Check if this is a message from another user, not our own
              if (e.message.user_id !== user.id) {
                // Add the message to the current conversation if it's open
                if (currentConversation?.id === e.message.conversation_id) {
                  setMessages(prev => [...prev, e.message])
                }
                
                // Update the conversation in the list
                setConversations(prev =>
                  prev.map(conv =>
                    conv.id === e.message.conversation_id
                      ? {
                          ...conv,
                          updated_at: new Date().toISOString(),
                          latest_message: e.message,
                          messages_count: (conv.messages_count || 0) + 1
                        }
                      : conv
                  )
                )
                
                // Update total unread count
                setTotalUnreadCount(prev => prev + 1)
              }
            })
        })
      }
    }

    setupEchoListeners()

    // Cleanup Echo listeners on unmount
    return () => {
      if (window.Echo) {
        conversations.forEach(conversation => {
          window.Echo.private(`conversation.${conversation.id}`)
            .stopListening('MessageSent')
        })
      }
    }
  }, [user, conversations, currentConversation, loadConversations])

  const value = {
    conversations,
    currentConversation,
    messages,
    isLoading,
    loadConversations,
    selectConversation,
    sendMessage,
    createConversation,
    updateMessage,
    deleteMessage,
    markConversationAsRead,
    updateConversation,
    addUsersToConversation,
    removeUserFromConversation,
    deleteConversation,
    totalUnreadCount,
  }

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
}

export const useMessages = () => {
  const context = useContext(MessageContext)
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessageProvider")
  }
  return context
}