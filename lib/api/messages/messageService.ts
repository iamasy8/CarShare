import ApiClient from "../apiClient";
import type { 
  Message, 
  Conversation, 
  ConversationResponse, 
  ConversationsResponse,
  BookingMessagesResponse,
  MessageResponse,
  StartConversationParams,
  CarInquiryParams,
  MarkAsReadParams
} from "./types";

// Create an instance of the API client
const apiClient = new ApiClient();

/**
 * Service for handling message and conversation operations
 */
class MessageService {
  /**
   * Get all conversations for the authenticated user
   */
  async getConversations(): Promise<ConversationsResponse> {
    // Get the current user's ID from localStorage if available
    let userId = null;
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        userId = user.id;
      }
    } catch (e) {
      console.error('Error getting user ID from localStorage:', e);
    }
    
    // Add the user ID as a query parameter for better filtering
    const queryParams = userId ? `?userId=${userId}` : '';
    return apiClient.get<ConversationsResponse>(`/messages/conversations${queryParams}`);
  }

  /**
   * Get a specific conversation by ID with messages
   * @param conversationId - The ID of the conversation to fetch
   */
  async getConversation(conversationId: string | number): Promise<ConversationResponse> {
    return apiClient.get<ConversationResponse>(`/messages/conversations/${conversationId}`);
  }

  /**
   * Send a message in an existing conversation
   * @param conversationId - The ID of the conversation
   * @param content - The message content
   */
  async sendMessage(conversationId: string | number, content: string): Promise<Message> {
    return apiClient.post<Message>(`/messages/conversations/${conversationId}/messages`, {
      content,
    });
  }
  
  /**
   * Start a new conversation with another user
   * @param userId - The ID of the user to start a conversation with
   * @param initialMessage - The initial message content
   */
  async startConversation(userId: number, initialMessage: string): Promise<{
    message: string;
    conversation: Conversation;
  }> {
    const params: StartConversationParams = {
      userId,
      message: initialMessage,
    };
    
    return apiClient.post<{
      message: string;
      conversation: Conversation;
    }>('/messages/conversations', params);
  }

  /**
   * Mark messages as read in a conversation
   * @param conversationId - The ID of the conversation
   * @param messageIds - Array of message IDs to mark as read
   */
  async markMessagesAsRead(conversationId: string | number, messageIds: number[]): Promise<{ message: string }> {
    // Check if messageIds is empty to avoid API errors
    if (!messageIds || messageIds.length === 0) {
      return Promise.resolve({ message: 'No messages to mark as read' });
    }
    
    const params: MarkAsReadParams = {
      messageIds: messageIds,
    };
    
    return apiClient.post<{ message: string }>(
      `/messages/conversations/${conversationId}/read`, 
      params
    );
  }

  /**
   * Delete a conversation
   * @param conversationId - The ID of the conversation to delete
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
   * @param carId - The ID of the car
   * @param message - The message content
   */
  async sendCarInquiry(carId: number, message: string): Promise<{
    message: string;
    conversation: Conversation;
  }> {
    const params: CarInquiryParams = {
      carId,
      message,
    };
    
    return apiClient.post<{
      message: string;
      conversation: Conversation;
    }>('/messages/car-inquiry', params);
  }
  
  /**
   * Get messages related to a specific booking
   * @param bookingId - The ID of the booking
   */
  async getBookingMessages(bookingId: number): Promise<BookingMessagesResponse> {
    return apiClient.get<BookingMessagesResponse>(`/messages/bookings/${bookingId}`);
  }
  
  /**
   * Send a message related to a specific booking
   * @param bookingId - The ID of the booking
   * @param content - The message content
   */
  async sendBookingMessage(bookingId: number, content: string): Promise<MessageResponse> {
    return apiClient.post<MessageResponse>(`/messages/bookings/${bookingId}`, {
      content,
    });
  }
}

export const messageService = new MessageService(); 

// Re-export types
export type { 
  Message, 
  Conversation, 
  ConversationResponse, 
  ConversationsResponse,
  BookingMessagesResponse,
  MessageResponse,
  UIConversation
} from './types'; 