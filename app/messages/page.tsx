"use client"

import { useState, useEffect } from "react"
import ChatList from "@/components/chat/chat-list"
import ChatWindow from "@/components/chat/chat-window"
import { useMediaQuery } from "@/hooks/use-media-query"
import { RouteProtection } from "@/components/route-protection"

export default function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | number | undefined>(undefined)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [showChatList, setShowChatList] = useState(true)

  // On mobile, when a conversation is selected, hide the chat list
  useEffect(() => {
    if (isMobile && selectedConversationId) {
      setShowChatList(false)
    } else if (!isMobile) {
      setShowChatList(true)
    }
  }, [selectedConversationId, isMobile])

  const handleSelectConversation = (conversationId: string | number) => {
    console.log("Selected conversation ID:", conversationId);
    setSelectedConversationId(conversationId)
  }

  const handleBack = () => {
    setShowChatList(true)
  }

  return (
    <RouteProtection>
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="container px-0 md:px-6 mx-auto">
          <div className="flex flex-col">
            <div className="py-6 px-4 md:px-0">
              <h1 className="text-2xl font-bold">Messages</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Gérez vos conversations avec les propriétaires et les locataires
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border rounded-lg overflow-hidden h-[calc(100vh-200px)]">
              <div className="flex h-full">
                {/* On mobile, conditionally show either chat list or chat window */}
                {(showChatList || !isMobile) && (
                  <ChatList
                    onSelectConversation={handleSelectConversation}
                    selectedConversationId={selectedConversationId as any}
                    className={isMobile ? "w-full" : "w-1/3"}
                  />
                )}

                {(!showChatList || !isMobile) && (
                  <ChatWindow
                    conversationId={selectedConversationId}
                    onBack={handleBack}
                    className={isMobile ? "w-full" : "w-2/3"}
                    isMobile={isMobile}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </RouteProtection>
  )
}
