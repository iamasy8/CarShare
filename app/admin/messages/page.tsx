"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Search, RefreshCw, Send, User, AlertCircle } from "lucide-react"
import { adminService, AdminMessage } from "@/lib/api/adminService"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"

export default function AdminMessagesPage() {
  const { user, isAdmin, isSuperAdmin } = useAuth()
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [replyContent, setReplyContent] = useState<string>('')
  const [replying, setReplying] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  
  // Fetch messages from backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await adminService.getMessages(1);
        setMessages(response.messages);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        toast({
          title: 'Error',
          description: 'Failed to load messages. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin || isSuperAdmin) {
      fetchMessages();
    }
  }, [isAdmin, isSuperAdmin]);

  // Handle message selection
  const handleSelectMessage = async (message: AdminMessage) => {
    try {
      const messageDetails = await adminService.getMessage(message.id);
      setSelectedMessage(messageDetails);
    } catch (error) {
      console.error('Failed to fetch message details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load message details. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle reply submission
  const handleReply = async () => {
    if (!selectedMessage || !replyContent.trim()) return;
    
    try {
      setReplying(true);
      await adminService.replyToMessage(selectedMessage.id, replyContent);
      
      // Refresh message details
      const updatedMessage = await adminService.getMessage(selectedMessage.id);
      setSelectedMessage(updatedMessage);
      setReplyContent('');
      
      toast({
        title: 'Success',
        description: 'Reply sent successfully.',
      });
    } catch (error) {
      console.error('Failed to send reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to send reply. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setReplying(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      setLoading(true);
      const response = await adminService.getMessages(1);
      setMessages(response.messages);
      
      if (selectedMessage) {
        const updatedMessage = await adminService.getMessage(selectedMessage.id);
        setSelectedMessage(updatedMessage);
      }
      
      toast({
        title: 'Refreshed',
        description: 'Messages updated successfully.',
      });
    } catch (error) {
      console.error('Failed to refresh messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh messages. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter messages by search term
  const filteredMessages = messages.filter(message =>
    message.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Messages</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4">
          <Card className="h-[calc(100vh-16rem)]">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
              <CardDescription>
                Gérez les conversations avec les utilisateurs
              </CardDescription>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher un utilisateur..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="p-3 rounded-md">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-[120px]" />
                        <Skeleton className="h-4 w-[40px]" />
                      </div>
                      <div className="mt-1">
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredMessages.length > 0 ? (
                <div className="space-y-2">
                  {filteredMessages.map(message => (
                    <div 
                      key={message.id} 
                      className={`p-3 rounded-md cursor-pointer ${
                        !message.isRead ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-muted"
                      } ${selectedMessage?.id === message.id ? 'border border-primary' : ''}`}
                      onClick={() => handleSelectMessage(message)}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{message.senderName}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(message.createdAt), 'dd/MM/yy')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {message.subject}
                        </p>
                        {!message.isRead && (
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[calc(100%-4rem)]">
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">Aucun message trouvé</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-8">
          <Card className="h-[calc(100vh-16rem)] flex flex-col">
            {selectedMessage ? (
              <>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <User className="h-8 w-8 text-primary" />
                    <div className="flex-1">
                      <CardTitle>{selectedMessage.subject}</CardTitle>
                      <CardDescription>
                        De: {selectedMessage.senderName} &lt;{selectedMessage.senderName}&gt;
                      </CardDescription>
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(selectedMessage.createdAt), 'dd MMM yyyy HH:mm')}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto">
                  <div className="prose max-w-none dark:prose-invert">
                    <p>{selectedMessage.content}</p>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <div className="w-full space-y-2">
                    <Textarea 
                      placeholder="Écrire une réponse..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleReply} 
                        disabled={!replyContent.trim() || replying}
                      >
                        {replying ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Envoyer la réponse
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </>
            ) : (
              <>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <MessageCircle className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle>Centre de Messages</CardTitle>
                      <CardDescription>
                        Sélectionnez une conversation pour commencer
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[calc(100%-6rem)]">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">Aucune conversation sélectionnée</h3>
                    <p className="text-gray-500">
                      Cliquez sur une conversation dans la liste pour afficher les messages
                    </p>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
