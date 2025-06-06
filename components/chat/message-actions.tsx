"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { MoreHorizontal, Trash, Edit, Copy } from "lucide-react"
import { useMessages } from "@/components/providers/message-provider"
import { Message } from "@/types/message"

interface MessageActionsProps {
  message: Message
}

export function MessageActions({ message }: MessageActionsProps) {
  const { deleteMessage, updateMessage } = useMessages()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editedText, setEditedText] = useState(message.body || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEdit = async () => {
    if (!editedText.trim()) return
    
    setIsSubmitting(true)
    try {
      await updateMessage(message.id, editedText)
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating message:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      try {
        await deleteMessage(message.id)
      } catch (error) {
        console.error("Error deleting message:", error)
      }
    }
  }

  const handleCopy = () => {
    if (message.body) {
      navigator.clipboard.writeText(message.body)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {message.body && (
            <>
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copier
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem onClick={handleDelete} className="text-red-500">
            <Trash className="h-4 w-4 mr-2" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le message</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              placeholder="Écrivez votre message..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleEdit}
              disabled={!editedText.trim() || isSubmitting}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 