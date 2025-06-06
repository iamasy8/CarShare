import { format, formatDistanceToNow, Locale } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Message, Conversation, UIConversation } from './types';
import type { User } from '@/lib/auth-context';

/**
 * Safely formats a date with fallback handling
 * @param date - The date to format
 * @param formatStr - The format string to use
 * @param options - Format options
 */
export function safeFormatDate(
  date: Date | string | undefined,
  formatStr: string = 'P',
  options: { locale?: Locale } = { locale: fr }
): string {
  if (!date) return '';
  
  try {
    // Ensure we have a Date object
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date:', date);
      return '';
    }
    
    return format(dateObj, formatStr, options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Safely formats a time distance with fallback handling
 * @param date - The date to format
 */
export function safeFormatDistance(date: Date | string | undefined): string {
  if (!date) return '';
  
  try {
    // Ensure we have a Date object
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date for distance formatting:', date);
      return '';
    }
    
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: fr });
  } catch (error) {
    console.error('Error formatting date distance:', error);
    return '';
  }
}

// Define UI message interface for internal use
export interface MessageWithDate {
  id: number;
  createdAt?: Date | string;
  time?: Date | string;
  content?: string;
  text?: string;
  isOwn?: boolean;
  [key: string]: any;
}

/**
 * Group messages by date
 * @param messages - Array of messages to group
 */
export function groupMessagesByDate<T extends MessageWithDate>(messages: T[]): Record<string, T[]> {
  const groupedMessages: Record<string, T[]> = {};
  
  messages.forEach((message) => {
    try {
      // Get a valid date object - support both API message format and UI message format
      const messageDate = message.time instanceof Date 
        ? message.time 
        : message.createdAt instanceof Date
          ? message.createdAt
          : new Date(message.time || message.createdAt || Date.now());
      
      // Format the date for grouping (just the day part)
      const dateStr = safeFormatDate(messageDate);
      
      // Create the group if it doesn't exist
      if (!groupedMessages[dateStr]) {
        groupedMessages[dateStr] = [];
      }
      
      // Add message to its date group
      groupedMessages[dateStr].push(message);
    } catch (e) {
      console.error("Error grouping message by date:", message, e);
      
      // Fallback: add to "Unknown date" group
      const fallbackGroup = "Date inconnue";
      if (!groupedMessages[fallbackGroup]) {
        groupedMessages[fallbackGroup] = [];
      }
      groupedMessages[fallbackGroup].push(message);
    }
  });
  
  // Sort messages within each group by time
  Object.keys(groupedMessages).forEach(date => {
    groupedMessages[date].sort((a, b) => {
      // Convert to timestamp for reliable comparison
      const timeA = a.time instanceof Date 
        ? a.time.getTime() 
        : a.createdAt instanceof Date
          ? a.createdAt.getTime()
          : new Date(a.time || a.createdAt || 0).getTime();
        
      const timeB = b.time instanceof Date 
        ? b.time.getTime() 
        : b.createdAt instanceof Date
          ? b.createdAt.getTime()
          : new Date(b.time || b.createdAt || 0).getTime();
        
      return timeA - timeB;
    });
  });
  
  return groupedMessages;
}

/**
 * Convert API conversations to UI-friendly format
 * @param conversations - Array of API conversations
 * @param currentUserId - ID of the current user
 */
export function convertToUIConversations(
  conversations: Conversation[],
  currentUserId: number
): UIConversation[] {
  return conversations.map(conversation => {
    const lastMessage = conversation.lastMessage;
    
    return {
      id: conversation.id,
      user: {
        id: conversation.otherParticipant.id,
        name: conversation.otherParticipant.name,
        avatar: conversation.otherParticipant.avatar || '/placeholder.svg',
        isOnline: false // We don't have online status from the API
      },
      lastMessage: lastMessage ? {
        text: lastMessage.content,
        time: safeFormatDistance(lastMessage.createdAt),
        isRead: lastMessage.isRead,
        isOwn: lastMessage.senderId === currentUserId
      } : {
        text: 'Nouvelle conversation',
        time: safeFormatDistance(conversation.createdAt),
        isRead: true,
        isOwn: false
      },
      unreadCount: conversation.unreadCount
    };
  });
}

/**
 * Determine if a booking conversation ID is valid
 * @param conversationId - The ID to check
 */
export function isBookingConversation(conversationId: string | number): boolean {
  return typeof conversationId === 'string' && conversationId.startsWith('booking_');
}

/**
 * Extract booking ID from a booking conversation ID
 * @param conversationId - The booking conversation ID
 */
export function extractBookingId(conversationId: string | number): number | null {
  if (!isBookingConversation(conversationId)) return null;
  
  const bookingId = String(conversationId).split('_')[1];
  return bookingId ? parseInt(bookingId, 10) : null;
}

/**
 * Create a UI-friendly message object
 * @param message - The message to convert
 * @param currentUserId - ID of the current user
 */
export function createUIMessage(message: any, currentUserId: number) {
  // Ensure we have a valid date
  let messageTime;
  try {
    // Try both camelCase and snake_case property names
    const dateValue = message.createdAt || message.created_at;
    messageTime = new Date(dateValue);
    if (isNaN(messageTime.getTime())) {
      messageTime = new Date();
    }
  } catch (e) {
    console.error('Error parsing message date:', e);
    messageTime = new Date();
  }
  
  // Handle both camelCase and snake_case property names
  const senderId = message.senderId || message.sender_id;
  const content = message.content || message.text;
  
  // A message is "own" if the current user is the sender
  const isOwn = senderId === currentUserId;
  
  return {
    id: message.id,
    text: content,
    content: content,
    time: messageTime,
    createdAt: messageTime,
    isOwn,
    senderId: senderId,
    receiverId: message.receiverId || message.receiver_id,
    isRead: message.isRead || message.is_read || false
  };
} 