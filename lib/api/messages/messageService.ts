import ApiClient from "../apiClient";
import type { User } from '@/lib/auth-context';

// Create an instance of the API client
const apiClient = new ApiClient();

export interface Message {
  id: number;
  conversationId: string;
  senderId: number;
  receiverId: number;
  content: string;
  isRead: boolean;
  bookingId?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  sender?: User;
  receiver?: User;
}

export interface Conversation {
  id: string;
  participantIds: number[];
  otherParticipant: User;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ConversationResponse {
  conversation: Conversation;
  messages: Message[];
  totalPages: number;
}

export interface ConversationsResponse {
  conversations: Conversation[];
  totalPages: number;
}

class MessageService {
  /**
   * Get all conversations for the authenticated user
   */
  async getConversations(): Promise<ConversationsResponse> {
    return apiClient.get<ConversationsResponse>('/messages/conversations');
  }

  /**
   * Get a specific conversation by ID with messages
   */
  async getConversation(conversationId: string | number): Promise<ConversationResponse> {
    return apiClient.get<ConversationResponse>(`/messages/conversations/${conversationId}`);
  }

  /**
   * Send a message in an existing conversation
   */
  async sendMessage(conversationId: string | number, content: string): Promise<Message> {
    return apiClient.post<Message>(`/messages/conversations/${conversationId}/messages`, {
      content,
    });
  }
  
  /**
   * Start a new conversation with another user
   */
  async startConversation(userId: number, initialMessage: string): Promise<{
    message: string;
    conversation: Conversation;
  }> {
    return apiClient.post<{
      message: string;
      conversation: Conversation;
    }>('/messages/conversations', {
      userId,
      message: initialMessage,
    });
  }

  /**
   * Mark messages as read in a conversation
   */
  async markMessagesAsRead(conversationId: string | number, messageIds: number[]): Promise<{ message: string }> {
    // Check if messageIds is empty to avoid API errors
    if (!messageIds || messageIds.length === 0) {
      console.log('No messages to mark as read');
      return { message: 'No messages to mark as read' };
    }
    
    console.log(`Marking messages as read for conversation ${conversationId}:`, messageIds);
    
    try {
      // Make sure we're using the correct field name expected by the backend
      const response = await apiClient.post<{ message: string }>(`/messages/conversations/${conversationId}/read`, {
        messageIds: messageIds,
      });
      console.log('Mark as read response:', response);
      return response;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      // Return a resolved promise instead of throwing to prevent UI errors
      return { message: 'Failed to mark messages as read' };
    }
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string | number): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/messages/conversations/${conversationId}`);
  }

  /**
   * Get unread message count for the authenticated user
   */
  async getUnreadCount(): Promise<{ count: number }> {
    return apiClient.get<{ count: number }>('/messages/unread-count');
  }

  /**
   * Send a message about a specific car (creates a conversation if needed)
   */
  async sendCarInquiry(carId: number, message: string): Promise<{
    message: string;
    conversation: Conversation;
  }> {
    return apiClient.post<{
      message: string;
      conversation: Conversation;
    }>('/messages/car-inquiry', {
      carId,
      message,
    });
  }
  
  /**
   * Get messages related to a specific booking
   */
  async getBookingMessages(bookingId: number): Promise<{
    messages: Message[];
    booking: any;
    otherUser: User;
  }> {
    return apiClient.get<{
      messages: Message[];
      booking: any;
      otherUser: User;
    }>(`/messages/bookings/${bookingId}`);
  }
  
  /**
   * Send a message related to a specific booking
   */
  async sendBookingMessage(bookingId: number, content: string): Promise<{
    message: string;
    data: Message;
  }> {
    return apiClient.post<{
      message: string;
      data: Message;
    }>(`/messages/bookings/${bookingId}`, {
      content,
    });
  }
}

export const messageService = new MessageService(); 