"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { messageService, Message } from "@/lib/api/messages/messageService";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface BookingMessagesProps {
  bookingId: number;
  className?: string;
}

export function BookingMessages({ bookingId, className }: BookingMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [booking, setBooking] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
    // Set up polling every 10 seconds
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [bookingId]);
  
  const fetchMessages = async () => {
    try {
      const response = await messageService.getBookingMessages(bookingId);
      setMessages(response.messages);
      setOtherUser(response.otherUser);
      setBooking(response.booking);
    } catch (error) {
      console.error("Error fetching booking messages:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setSending(true);
    
    try {
      const response = await messageService.sendBookingMessage(bookingId, newMessage);
      
      // Add the new message to the list
      setMessages(prevMessages => [...prevMessages, response.data]);
      
      // Clear the input
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  if (loading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }
  
  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header with booking info */}
      {booking && (
        <div className="p-4 border-b">
          <h3 className="font-medium">Messages de réservation</h3>
          <p className="text-sm text-gray-500">
            {booking.car.make} {booking.car.model} • 
            {new Date(booking.start_date).toLocaleDateString()} - 
            {new Date(booking.end_date).toLocaleDateString()}
          </p>
        </div>
      )}
      
      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <MessageCircle className="h-12 w-12 mb-2" />
            <p>Aucun message pour cette réservation.</p>
            <p className="text-sm">Envoyez le premier message ci-dessous.</p>
          </div>
        ) : (
          messages.map(message => {
            const isCurrentUser = message.senderId === user?.id;
            const sender = isCurrentUser ? user : otherUser;
            
            return (
              <div 
                key={message.id} 
                className={cn(
                  "flex items-start gap-2",
                  isCurrentUser ? "flex-row-reverse" : ""
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={sender?.avatar} />
                  <AvatarFallback>{getInitials(sender?.name || "")}</AvatarFallback>
                </Avatar>
                <div className={cn(
                  "rounded-lg p-3 max-w-[80%]",
                  isCurrentUser 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                )}>
                  <p className="text-sm">{message.content}</p>
                  <p className={cn(
                    "text-xs mt-1",
                    isCurrentUser 
                      ? "text-primary-foreground/70" 
                      : "text-muted-foreground"
                  )}>
                    {formatDistanceToNow(new Date(message.createdAt), { 
                      addSuffix: true,
                      locale: fr
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t flex items-end gap-2">
        <Textarea
          placeholder="Tapez votre message..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          className="min-h-[80px] flex-1"
        />
        <Button 
          size="icon" 
          onClick={handleSendMessage} 
          disabled={sending || !newMessage.trim()}
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
} 