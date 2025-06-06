"use client"

import { useEffect } from "react"
import { useMessages } from "@/components/providers/message-provider"
import ChatSidebar from "@/components/chat/chat-sidebar"
import ChatMessages from "@/components/chat/chat-messages"
import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"

export default function MessagesPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { loadConversations } = useMessages()

  useEffect(() => {
    if (user) {
      loadConversations()
    }
  }, [user, loadConversations])

  // Redirect if not authenticated
  if (!authLoading && !user) {
    redirect("/login?redirect=/messages")
  }

  return (
    <div className="flex h-[calc(100vh-160px)] flex-col md:flex-row">
      <div className="w-full md:w-1/3 border-r dark:border-gray-700">
        <ChatSidebar />
      </div>
      <div className="w-full md:w-2/3 flex flex-col">
        <ChatMessages />
      </div>
    </div>
  )
}
