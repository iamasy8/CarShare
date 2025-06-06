import { listenToPrivateChannel, stopListeningToPrivateChannel } from '@/lib/echo';
import { QueryClient } from '@tanstack/react-query';
import type { Message } from './types';

/**
 * Manages real-time messaging events
 */
export class RealTimeMessageHandler {
  private queryClient: QueryClient;
  private userId: number | null = null;
  private activeListeners: Record<string, boolean> = {};

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  /**
   * Initialize real-time listeners for a user
   * @param userId - The ID of the current user
   */
  public initialize(userId: number): void {
    if (!userId) {
      console.error('Cannot initialize real-time handler without a user ID');
      return;
    }

    // Store the user ID
    this.userId = userId;
    const channelName = `user.${userId}`;

    // Set up message.sent listener
    this.setupMessageSentListener(channelName);
    
    // Set up messages.read listener
    this.setupMessagesReadListener(channelName);
    
    console.log(`Real-time message handler initialized for user ${userId}`);
  }

  /**
   * Clean up all listeners
   */
  public cleanup(): void {
    if (!this.userId) return;
    
    const channelName = `user.${this.userId}`;
    
    // Clean up all active listeners
    if (this.activeListeners[`${channelName}|message.sent`]) {
      stopListeningToPrivateChannel(channelName, 'message.sent');
      delete this.activeListeners[`${channelName}|message.sent`];
    }
    
    if (this.activeListeners[`${channelName}|messages.read`]) {
      stopListeningToPrivateChannel(channelName, 'messages.read');
      delete this.activeListeners[`${channelName}|messages.read`];
    }
    
    console.log('Real-time message handler cleaned up');
  }

  /**
   * Set up listener for new messages
   * @param channelName - The channel to listen on
   */
  private setupMessageSentListener(channelName: string): void {
    try {
      listenToPrivateChannel(channelName, 'message.sent', (data) => {
        console.log('Received real-time message:', data);
        
        // Ensure this message is relevant to the current user
        if (!this.isMessageForCurrentUser(data)) {
          console.log('Message is not for current user, ignoring');
          return;
        }
        
        // Update the conversation list immediately
        this.queryClient.invalidateQueries({ queryKey: ['conversations'] });
        
        // If we have the conversation open, update that too
        if (data.conversationId || data.conversation_id) {
          const conversationId = data.conversationId || data.conversation_id;
          console.log(`Checking if conversation ${conversationId} is open`);
          
          // Check if we have this conversation in the cache
          const conversationData = this.queryClient.getQueryData(['conversation', conversationId]);
          
          if (conversationData) {
            console.log(`Conversation ${conversationId} is in cache, updating with new message`);
            // Update the specific conversation with the new message
            this.updateConversationWithNewMessage(conversationId, data);
            
            // Also invalidate the query to force a refetch
            setTimeout(() => {
              this.queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
            }, 200);
          } else {
            console.log(`Conversation ${conversationId} not in cache`);
          }
        }
      });
      
      this.activeListeners[`${channelName}|message.sent`] = true;
    } catch (error) {
      console.error('Error setting up message.sent listener:', error);
    }
  }

  /**
   * Check if a message is relevant to the current user
   * @param message - The message to check
   * @returns boolean - True if the message is for the current user
   */
  private isMessageForCurrentUser(message: any): boolean {
    if (!this.userId) return false;
    
    // Get sender and receiver IDs from the message
    const senderId = message.senderId || message.sender_id;
    const receiverId = message.receiverId || message.receiver_id;
    
    // Message is relevant if the current user is either the sender or receiver
    const isRelevant = senderId === this.userId || receiverId === this.userId;
    
    console.log(`Message relevance check: senderId=${senderId}, receiverId=${receiverId}, currentUserId=${this.userId}, isRelevant=${isRelevant}`);
    
    return isRelevant;
  }

  /**
   * Set up listener for read messages
   * @param channelName - The channel to listen on
   */
  private setupMessagesReadListener(channelName: string): void {
    try {
      listenToPrivateChannel(channelName, 'messages.read', (data) => {
        console.log('Messages marked as read:', data);
        
        // Update the conversation list to reflect read status changes
        this.queryClient.invalidateQueries({ queryKey: ['conversations'] });
        
        // If we have the affected conversation open, update its messages
        if (data.conversationId) {
          this.queryClient.invalidateQueries({ queryKey: ['conversation', data.conversationId] });
        }
      });
      
      this.activeListeners[`${channelName}|messages.read`] = true;
    } catch (error) {
      console.error('Error setting up messages.read listener:', error);
    }
  }

  /**
   * Update a conversation in the cache with a new message
   * @param conversationId - The ID of the conversation to update
   * @param newMessage - The new message to add
   */
  private updateConversationWithNewMessage(conversationId: string | number, newMessage: any): void {
    try {
      // Get the current conversation data from the cache
      const conversationData = this.queryClient.getQueryData(['conversation', conversationId]);
      
      if (!conversationData) return;
      
      // Make sure the message isn't already in the conversation
      const messageExists = (conversationData as any).messages.some(
        (msg: Message) => msg.id === newMessage.id
      );
      
      if (messageExists) return;
      
      // Create a properly formatted message from the event data
      const formattedMessage: Message = {
        id: newMessage.id,
        conversationId: newMessage.conversationId,
        senderId: newMessage.senderId,
        receiverId: newMessage.receiverId,
        content: newMessage.content,
        isRead: newMessage.isRead || false,
        bookingId: newMessage.bookingId,
        createdAt: new Date(newMessage.createdAt || newMessage.created_at),
        updatedAt: new Date(newMessage.updatedAt || newMessage.updated_at),
        sender: newMessage.sender,
        receiver: newMessage.receiver
      };
      
      // Add the new message to the conversation
      const updatedMessages = [...(conversationData as any).messages, formattedMessage];
      
      // Update the cache
      this.queryClient.setQueryData(['conversation', conversationId], {
        ...(conversationData as any),
        messages: updatedMessages,
      });
    } catch (error) {
      console.error('Error updating conversation with new message:', error);
    }
  }
}

// Create a singleton instance
let realTimeHandlerInstance: RealTimeMessageHandler | null = null;

/**
 * Get the real-time message handler instance
 * @param queryClient - The query client to use
 */
export function getRealTimeMessageHandler(queryClient: QueryClient): RealTimeMessageHandler {
  if (!realTimeHandlerInstance) {
    realTimeHandlerInstance = new RealTimeMessageHandler(queryClient);
  }
  return realTimeHandlerInstance;
} 