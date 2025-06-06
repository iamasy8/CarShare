"use client"

import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { NewConversationDialog } from "./new-conversation-dialog"

export function EmptyState() {
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
        <MessageSquare className="h-10 w-10 text-blue-500 dark:text-blue-300" />
      </div>
      <h2 className="text-xl font-bold mb-2">Vos messages</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md">
        Envoyez des messages privés aux propriétaires de voitures ou aux locataires
        pour discuter des détails de location ou poser des questions.
      </p>
      <Button onClick={() => setIsNewConversationOpen(true)}>
        Démarrer une conversation
      </Button>
      
      <NewConversationDialog 
        open={isNewConversationOpen}
        onOpenChange={setIsNewConversationOpen}
      />
    </div>
  )
} 