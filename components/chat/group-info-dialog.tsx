"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserPlus, UserMinus, Crown } from "lucide-react"
import { useMessages } from "@/components/providers/message-provider"
import { Conversation, User } from "@/types/message"
import { useAuth } from "@/lib/auth-context"

interface GroupInfoDialogProps {
  conversation: Conversation
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GroupInfoDialog({
  conversation,
  open,
  onOpenChange,
}: GroupInfoDialogProps) {
  const { user: currentUser } = useAuth()
  const { updateConversation, removeUserFromConversation } = useMessages()
  const [groupName, setGroupName] = useState(conversation.name || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get group participants sorted by admin status
  const participants = conversation.users?.sort((a, b) => {
    const aIsAdmin = conversation.pivot?.is_admin || false
    const bIsAdmin = conversation.pivot?.is_admin || false
    return aIsAdmin === bIsAdmin ? 0 : aIsAdmin ? -1 : 1
  }) || []

  // Check if current user is admin
  const isAdmin = conversation.pivot?.is_admin || false

  const handleSave = async () => {
    if (!groupName.trim()) return
    
    setIsSubmitting(true)
    try {
      await updateConversation(conversation.id, { name: groupName })
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating group:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveUser = async (userId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir retirer cet utilisateur du groupe ?")) {
      try {
        await removeUserFromConversation(conversation.id, userId)
      } catch (error) {
        console.error("Error removing user:", error)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Informations du groupe</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Nom du groupe</Label>
            <Input
              id="group-name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Entrez le nom du groupe"
              disabled={!isAdmin}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Participants ({participants.length})</Label>
              {isAdmin && (
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <UserPlus className="h-3 w-3 mr-1" />
                  Ajouter
                </Button>
              )}
            </div>
            
            <ScrollArea className="h-60 rounded-md border">
              {participants.map((participant) => {
                const isCurrentUser = participant.id === currentUser?.id
                const isParticipantAdmin = conversation.pivot?.is_admin || false // In a real app, check admin status for each user
                
                return (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={participant.avatar} alt={participant.name} />
                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">
                            {participant.name}
                            {isCurrentUser && " (Vous)"}
                          </p>
                          {isParticipantAdmin && (
                            <Crown className="h-3 w-3 ml-1 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{participant.email}</p>
                      </div>
                    </div>
                    
                    {isAdmin && !isCurrentUser && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleRemoveUser(participant.id)}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )
              })}
            </ScrollArea>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          {isAdmin && (
            <Button
              onClick={handleSave}
              disabled={!groupName.trim() || isSubmitting}
            >
              Enregistrer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 