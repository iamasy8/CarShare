"use client"

import { useState, useRef, useEffect } from "react"
import { useMessages } from "@/components/providers/message-provider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Paperclip, Image as ImageIcon, Send, Info, MoreVertical, Smile } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { Message } from "@/types/message"
import { MessageActions } from "./message-actions"
import { ConversationHeader } from "./conversation-header"
import { EmptyState } from "./empty-state"

export function ChatMessages() {
  const { currentConversation, messages, sendMessage } = useMessages()
  const { user } = useAuth()
  const [messageText, setMessageText] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [docFile, setDocFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Debugging helper - Remove in production
  useEffect(() => {
    if (user && messages.length > 0) {
      console.log("Current user ID:", user.id);
      console.log("Messages:", messages.map(m => ({ 
        id: m.id,
        user_id: m.user_id, 
        user_name: m.user?.name,
        body: m.body,
        isOwn: m.user_id === user.id
      })));
    }
  }, [user, messages]);

  const handleImageClick = () => {
    imageInputRef.current?.click()
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setDocFile(file)
    }
  }

  const resetAttachments = () => {
    setImageFile(null)
    setDocFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (imageInputRef.current) imageInputRef.current.value = ""
  }

  const handleSendMessage = async () => {
    if ((!messageText.trim() && !imageFile && !docFile) || !currentConversation || !user) {
      return
    }

    setIsSubmitting(true)
    try {
      await sendMessage(
        currentConversation.id,
        messageText,
        imageFile || undefined,
        docFile || undefined
      )
      setMessageText("")
      resetAttachments()
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}
    
    messages.forEach(message => {
      const date = new Date(message.created_at).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })
    
    // Sort dates chronologically (oldest to newest)
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => {
        return new Date(dateA).getTime() - new Date(dateB).getTime()
      })
      .map(([date, messages]) => ({
        date,
        messages,
      }))
  }

  const messageGroups = groupMessagesByDate(messages)

  // Format date for display
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier"
    } else {
      return format(date, "EEEE d MMMM yyyy", { locale: fr })
    }
  }

  // Render time for message
  const formatMessageTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm")
  }

  // Check if message is from current user
  const isOwnMessage = (message: Message) => {
    if (!user) return false;
    
    // Make sure to compare as numbers to avoid string/number type issues
    const messageUserId = typeof message.user_id === 'string' ? parseInt(message.user_id) : message.user_id;
    const currentUserId = typeof user.id === 'string' ? parseInt(user.id) : user.id;
    
    return messageUserId === currentUserId;
  }

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
  }

  if (!currentConversation) {
    return <EmptyState />
  }

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader conversation={currentConversation} />
      
      <div className="flex-1 overflow-y-auto p-4">
        {messageGroups.map(group => (
          <div key={group.date} className="mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-600 dark:text-gray-300">
                {formatMessageDate(group.date)}
              </div>
            </div>
            
            {group.messages.map((message, index) => {
              // Check if message is from the current user
              const isOwn = isOwnMessage(message)
              
              // Only show avatar for other users' messages
              const showAvatar = !isOwn && (index === 0 || group.messages[index - 1]?.user_id !== message.user_id)
              
              // Only show name for other users' messages when avatar is shown
              const showName = !isOwn && showAvatar
              
              return (
                <div key={message.id} className={cn(
                  "mb-4", 
                  isOwn ? "flex flex-row-reverse" : "flex"
                )}>
                  {!isOwn && (
                    <div className="flex-shrink-0 mr-3">
                      {showAvatar ? (
                        <Avatar>
                          <AvatarImage src={message.user?.avatar} alt={message.user?.name || ""} />
                          <AvatarFallback>{getInitials(message.user?.name || "")}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8" />
                      )}
                    </div>
                  )}
                  
                  <div className={cn("max-w-[70%]", isOwn ? "items-end" : "items-start")}>
                    {showName && (
                      <div className="ml-2 mb-1 text-sm font-medium">
                        {message.user?.name}
                      </div>
                    )}
                    
                    <div className="flex group">
                      <div
                        className={cn(
                          "rounded-lg py-2 px-3",
                          isOwn 
                            ? "bg-blue-500 text-white rounded-tr-none" 
                            : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none"
                        )}
                      >
                        {/* Debug info - will be visible to help troubleshoot */}
                        {process.env.NODE_ENV === 'development' && (
                          <div className="text-xs opacity-75 mb-1 p-1 bg-black/10 rounded">
                            Sender ID: {message.user_id} | Your ID: {user?.id} <br />
                            {message.user?.name || 'Unknown'} 
                            {isOwn ? ' (You)' : ' (Other)'} <br />
                            Created: {new Date(message.created_at).toLocaleTimeString()}
                          </div>
                        )}
                        
                        {message.body && <p className="whitespace-pre-wrap">{message.body}</p>}
                        
                        {message.image_url && (
                          <div className="mt-2">
                            <img
                              src={message.image_url}
                              alt="Image"
                              className="max-w-full rounded"
                            />
                          </div>
                        )}
                        
                        {message.file_url && (
                          <div className="mt-2 flex items-center bg-white dark:bg-gray-700 p-2 rounded">
                            <Paperclip className="h-4 w-4 mr-2" />
                            <a
                              href={message.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline text-sm"
                            >
                              {message.file_name || "Document"}
                            </a>
                          </div>
                        )}
                        
                        <div className={cn(
                          "text-xs mt-1",
                          isOwn ? "text-blue-200" : "text-gray-500"
                        )}>
                          {formatMessageTime(message.created_at)}
                        </div>
                      </div>
                      
                      {isOwn && (
                        <div className="opacity-0 group-hover:opacity-100 self-end ml-2">
                          <MessageActions message={message} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Attachments preview */}
      {(imagePreview || docFile) && (
        <div className="border-t p-2 flex flex-wrap gap-2">
          {imagePreview && (
            <div className="relative inline-block">
              <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded" />
              <button
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                onClick={() => {
                  setImageFile(null)
                  setImagePreview(null)
                  if (imageInputRef.current) imageInputRef.current.value = ""
                }}
              >
                &times;
              </button>
            </div>
          )}
          
          {docFile && (
            <div className="relative inline-flex items-center bg-gray-100 dark:bg-gray-800 p-2 rounded">
              <Paperclip className="h-4 w-4 mr-2" />
              <span className="text-sm">{docFile.name}</span>
              <button
                className="ml-2 text-red-500"
                onClick={() => {
                  setDocFile(null)
                  if (fileInputRef.current) fileInputRef.current.value = ""
                }}
              >
                &times;
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Message input */}
      <div className="border-t p-4">
        <div className="flex items-end">
          <Textarea
            placeholder="Écrivez votre message..."
            className="flex-1 resize-none"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <div className="flex ml-2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={handleImageClick}
              className="text-gray-500"
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
            <input
              type="file"
              ref={imageInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={handleFileClick}
              className="text-gray-500"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
              className="hidden"
              onChange={handleFileChange}
            />
            
            <Button
              type="button"
              size="icon"
              onClick={handleSendMessage}
              className="text-white bg-blue-500 hover:bg-blue-600"
              disabled={(!messageText.trim() && !imageFile && !docFile) || isSubmitting}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatMessages;