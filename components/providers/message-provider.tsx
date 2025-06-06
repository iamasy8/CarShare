"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useQueryClient } from '@tanstack/react-query';
import { getRealTimeMessageHandler } from '@/lib/api/messages/realTimeHandler';
import { messageService } from '@/lib/api/messages/messageService';
import { useRealApi } from '@/lib/utils';

interface MessageContextType {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
}

const MessageContext = createContext<MessageContextType>({
  unreadCount: 0,
  refreshUnreadCount: async () => {}
});

export function MessageProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);
  const isUsingRealApi = useRealApi();
  
  // Initialize real-time message handler
  useEffect(() => {
    if (isUsingRealApi && isAuthenticated && user?.id) {
      // Get the real-time handler and initialize it
      const realTimeHandler = getRealTimeMessageHandler(queryClient);
      realTimeHandler.initialize(user.id);
      
      // Fetch initial unread count
      refreshUnreadCount();
      
      // Clean up on unmount
      return () => {
        realTimeHandler.cleanup();
      };
    }
  }, [isUsingRealApi, isAuthenticated, user?.id, queryClient]);
  
  // Set up polling for unread count
  useEffect(() => {
    if (isUsingRealApi && isAuthenticated) {
      // Poll every 30 seconds
      const interval = setInterval(refreshUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isUsingRealApi, isAuthenticated]);
  
  // Function to refresh unread count
  const refreshUnreadCount = async () => {
    if (!isUsingRealApi || !isAuthenticated) return;
    
    try {
      const response = await messageService.getUnreadCount();
      setUnreadCount(response.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };
  
  return (
    <MessageContext.Provider value={{ unreadCount, refreshUnreadCount }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  return useContext(MessageContext);
} 