"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { messageService } from "@/lib/api/messages/messageService"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface NewConversationModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: (conversationId: number) => void
}

export function NewConversationModal({ open, onClose, onSuccess }: NewConversationModalProps) {
  const [userId, setUserId] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour envoyer un message")
      return
    }
    
    if (!userId || !message) {
      toast.error("Veuillez remplir tous les champs")
      return
    }
    
    try {
      setIsLoading(true)
      const response = await messageService.startConversation(parseInt(userId), message)
      toast.success("Conversation créée avec succès")
      
      // Reset form
      setUserId("")
      setMessage("")
      
      // Close modal
      onClose()
      
      // Navigate to the new conversation
      if (onSuccess && response.conversation?.id) {
        const conversationId = typeof response.conversation.id === 'string' 
          ? parseInt(response.conversation.id) 
          : response.conversation.id
        onSuccess(conversationId)
      }
    } catch (error) {
      console.error("Failed to start conversation:", error)
      toast.error("Impossible de créer la conversation")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nouvelle conversation</DialogTitle>
          <DialogDescription>
            Démarrez une nouvelle conversation avec un autre utilisateur.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="userId" className="text-sm font-medium">
              ID de l'utilisateur
            </label>
            <Input
              id="userId"
              placeholder="Entrez l'ID de l'utilisateur"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              type="number"
              min="1"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <Textarea
              id="message"
              placeholder="Écrivez votre premier message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                "Envoyer"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 