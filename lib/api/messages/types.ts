import type { User } from '@/lib/auth-context';

/**
 * Message entity representing a single message in a conversation
 */
export interface Message {
  id: number;
  conversationId: string | number;
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

/**
 * Conversation entity representing a chat thread between two users
 */
export interface Conversation {
  id: string | number;
  participantIds: number[];
  otherParticipant: User;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * Response structure for conversation queries
 */
export interface ConversationResponse {
  conversation: Conversation;
  messages: Message[];
  totalPages: number;
}

/**
 * Response structure for conversations list queries
 */
export interface ConversationsResponse {
  conversations: Conversation[];
  totalPages: number;
}

/**
 * Response structure for booking messages
 */
export interface BookingMessagesResponse {
  messages: Message[];
  booking: any;
  otherUser: User;
}

/**
 * Structure for message sending response
 */
export interface MessageResponse {
  message: string;
  data: Message;
}

/**
 * Parameters for starting a new conversation
 */
export interface StartConversationParams {
  userId: number;
  message: string;
}

/**
 * Parameters for car inquiry
 */
export interface CarInquiryParams {
  carId: number;
  message: string;
}

/**
 * Parameters for marking messages as read
 */
export interface MarkAsReadParams {
  messageIds: number[];
}

/**
 * UI-friendly conversation format for display
 */
export interface UIConversation {
  id: string | number;
  user: {
    id: number;
    name: string;
    avatar?: string;
    isOnline?: boolean;
  };
  lastMessage: {
    text: string;
    time: string;
    isRead: boolean;
    isOwn: boolean;
  };
  unreadCount: number;
} 