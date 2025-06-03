import { apiClient } from '../apiClient';
import type { User } from '@/lib/auth-context';

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  receiverId: number;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
  sender?: User;
  receiver?: User;
}

export interface Conversation {
  id: number;
  participantIds: number[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
  otherParticipant?: User;
}

class MessageService {
  /**
   * Get all conversations for the current user
   */
  async getConversations(): Promise<Conversation[]> {
    return apiClient.get<Conversation[]>('/messages/conversations');
  }
  
  /**
   * Get a single conversation by ID with messages
   */
  async getConversation(conversationId: number, page: number = 1, limit: number = 20): Promise<{
    conversation: Conversation;
    messages: Message[];
    totalPages: number;
  }> {
    return apiClient.get<{
      conversation: Conversation;
      messages: Message[];
      totalPages: number;
    }>(`/messages/conversations/${conversationId}`, {
      params: { page, limit }
    });
  }
  
  /**
   * Start a new conversation with another user
   */
  async startConversation(userId: number, initialMessage: string): Promise<Conversation> {
    return apiClient.post<Conversation>('/messages/conversations', {
      userId,
      message: initialMessage,
    });
  }
  
  /**
   * Send a message in an existing conversation
   */
  async sendMessage(conversationId: number, content: string): Promise<Message> {
    return apiClient.post<Message>(`/messages/conversations/${conversationId}/messages`, {
      content,
    });
  }
  
  /**
   * Mark all messages in a conversation as read
   */
  async markConversationAsRead(conversationId: number): Promise<void> {
    return apiClient.put<void>(`/messages/conversations/${conversationId}/read`);
  }
  
  /**
   * Get unread message count for the current user
   */
  async getUnreadCount(): Promise<{ count: number }> {
    return apiClient.get<{ count: number }>('/messages/unread-count');
  }
  
  /**
   * Send a message about a specific car (creates a conversation if needed)
   */
  async sendCarInquiry(carId: number, message: string): Promise<Conversation> {
    return apiClient.post<Conversation>('/messages/car-inquiry', {
      carId,
      message,
    });
  }
  
  /**
   * Get messages related to a specific booking
   */
  async getBookingMessages(bookingId: number): Promise<Message[]> {
    return apiClient.get<Message[]>(`/messages/bookings/${bookingId}`);
  }
  
  /**
   * Send a message related to a specific booking
   */
  async sendBookingMessage(bookingId: number, content: string): Promise<Message> {
    return apiClient.post<Message>(`/messages/bookings/${bookingId}`, {
      content,
    });
  }
  
  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: number): Promise<void> {
    return apiClient.delete<void>(`/messages/conversations/${conversationId}`);
  }
  
  /**
   * Delete a specific message
   */
  async deleteMessage(messageId: number): Promise<void> {
    return apiClient.delete<void>(`/messages/messages/${messageId}`);
  }
  
  /**
   * Mark messages as read
   */
  async markMessagesAsRead(conversationId: number, messageIds: number[]): Promise<void> {
    return apiClient.post<void>(`/messages/conversations/${conversationId}/read`, {
      messageIds
    });
  }
}

export const messageService = new MessageService(); 