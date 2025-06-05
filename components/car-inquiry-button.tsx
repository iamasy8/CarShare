"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { messageService } from "@/lib/api/messages/messageService";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Loader2, MessageCircle } from "lucide-react";

interface CarInquiryButtonProps {
  carId: number;
  carTitle: string;
  ownerId: number;
  className?: string;
}

export function CarInquiryButton({ carId, carTitle, ownerId, className }: CarInquiryButtonProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  // Don't show the button if the current user is the owner
  if (isAuthenticated && user?.id === ownerId) {
    return null;
  }
  
  const handleSendInquiry = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour envoyer un message au propriétaire.",
        variant: "destructive",
      });
      router.push(`/login?redirect=/cars/${carId}`);
      return;
    }
    
    if (!message.trim()) {
      toast({
        title: "Message requis",
        description: "Veuillez saisir un message.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      const response = await messageService.sendCarInquiry(carId, message);
      
      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé au propriétaire.",
      });
      
      // Close the dialog
      setOpen(false);
      
      // Reset the message
      setMessage("");
      
      // Redirect to the conversation
      router.push(`/messages/${response.conversation.id}`);
    } catch (error) {
      console.error("Error sending car inquiry:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Contacter le propriétaire
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Envoyer un message au propriétaire</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <p className="text-sm text-gray-500">
              À propos de: <span className="font-medium text-gray-900">{carTitle}</span>
            </p>
            <Textarea
              id="message"
              placeholder="Bonjour, je suis intéressé(e) par votre véhicule. Est-il toujours disponible?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <Button 
            onClick={handleSendInquiry} 
            disabled={isSending || !message.trim()}
            className="w-full"
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Envoyer le message"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 