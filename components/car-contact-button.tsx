"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Loader2 } from "lucide-react"

interface CarContactButtonProps {
  carId: number
  carTitle: string
  ownerId: number
  ownerName: string
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  fullWidth?: boolean
}

export function CarContactButton({
  carId,
  carTitle,
  ownerId,
  ownerName,
  className,
  variant = "default",
  size = "default",
  fullWidth = false,
}: CarContactButtonProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!message.trim()) return

    setIsSubmitting(true)

    try {
      // In a real app, you would call an API to send the message
      console.log("Sending message to owner:", ownerId, "about car:", carId, "Message:", message)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Close dialog and redirect to messages
      setIsDialogOpen(false)

      // In a real app, you would redirect to the specific conversation
      router.push("/messages/1")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsDialogOpen(true)}
        style={fullWidth ? { width: "100%" } : undefined}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Contacter le propriétaire
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contacter {ownerName}</DialogTitle>
            <DialogDescription>
              Envoyez un message au propriétaire de {carTitle} pour poser vos questions ou organiser une location.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            placeholder="Bonjour, je suis intéressé(e) par votre voiture. Est-elle disponible pour..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[150px]"
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !message.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Envoyer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CarContactButton
