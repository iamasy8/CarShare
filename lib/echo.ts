import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Initialize Echo only on the client side
let echo: Echo<any> | null = null;
// Keep track of active channel subscriptions to avoid duplicates
const activeChannels: Record<string, boolean> = {};
// Track initialization attempts to prevent multiple tries
let initializationAttempted = false;

// Initialize Pusher and Laravel Echo
export function initEcho() {
  if (typeof window !== 'undefined' && !echo && !initializationAttempted) {
    initializationAttempted = true;
    
    try {
      // Log environment variables for debugging (remove in production)
      console.log('Initializing Echo with:', {
        key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER
      });

      if (!process.env.NEXT_PUBLIC_PUSHER_APP_KEY) {
        console.error('NEXT_PUBLIC_PUSHER_APP_KEY is not defined');
        return null;
      }

      if (!process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER) {
        console.error('NEXT_PUBLIC_PUSHER_APP_CLUSTER is not defined');
        return null;
      }

      // @ts-ignore - Pusher is attached to window for Laravel Echo
      window.Pusher = Pusher;

      // Enable Pusher logging for debugging
      Pusher.logToConsole = true;

      // Get auth token from localStorage
      const authToken = localStorage.getItem('auth_token');
      
      if (!authToken) {
        console.warn('No auth token found for Echo initialization');
      }

      echo = new Echo({
        broadcaster: 'pusher',
        key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
        forceTLS: true,
        authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,
        auth: {
          headers: {
            Accept: 'application/json',
            Authorization: authToken ? `Bearer ${authToken}` : '',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
        },
        enabledTransports: ['ws', 'wss', 'xhr_streaming', 'xhr_polling', 'sockjs'],
        // Add connection handlers
        connectionTimeout: 10000, // 10 seconds
        enableLogging: true,
      });
      
      // Add connection event listeners
      echo.connector.pusher.connection.bind('connected', () => {
        console.log('Pusher connection established');
      });
      
      echo.connector.pusher.connection.bind('disconnected', () => {
        console.log('Pusher disconnected');
      });
      
      echo.connector.pusher.connection.bind('error', (err: any) => {
        console.error('Pusher connection error:', err);
      });

      console.log('Echo initialized successfully');
    } catch (error) {
      console.error('Error initializing Echo:', error);
    }
  }
  return echo;
}

// Get the Echo instance, reinitialize if token changed
export function getEcho() {
  if (typeof window !== 'undefined') {
    // Check if token has changed
    const currentToken = localStorage.getItem('auth_token');
    const echoToken = echo?.options?.auth?.headers?.Authorization?.replace('Bearer ', '');
    
    if (currentToken && echoToken && currentToken !== echoToken) {
      console.log('Auth token changed, reinitializing Echo');
      cleanupEcho();
      initializationAttempted = false;
      return initEcho();
    }
    
    if (!echo) {
      return initEcho();
    }
  }
  return echo;
}

// Clean up Echo on logout
export function cleanupEcho() {
  if (echo) {
    try {
      // Clear all active channels
      Object.keys(activeChannels).forEach(channelKey => {
        const [channelName, event] = channelKey.split('|');
        try {
          echo?.private(channelName).stopListening(event);
        } catch (e) {
          console.warn(`Failed to stop listening to ${channelName}:${event}`, e);
        }
      });
      
      // Reset active channels
      Object.keys(activeChannels).forEach(key => delete activeChannels[key]);
      
      // Disconnect Echo
      echo.disconnect();
      echo = null;
      console.log('Echo connection cleaned up');
    } catch (error) {
      console.error('Error cleaning up Echo:', error);
    }
  }
}

// Helper to listen to private channels
export function listenToPrivateChannel(channelName: string, event: string, callback: (data: any) => void) {
  const echoInstance = getEcho();
  if (echoInstance) {
    try {
      // Create a unique key for this channel+event combination
      const channelKey = `${channelName}|${event}`;
      
      // Check if we're already listening to this channel+event
      if (activeChannels[channelKey]) {
        console.log(`Already listening to channel: ${channelName}, event: ${event}`);
        // Stop listening first to avoid duplicate handlers
        echoInstance.private(channelName).stopListening(event);
      }
      
      // Start listening and mark as active
      console.log(`Listening to channel: ${channelName}, event: ${event}`);
      
      // Add a wrapper around the callback to provide better logging
      const wrappedCallback = (data: any) => {
        console.log(`Received event on ${channelName}:${event}`, data);
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in callback for ${channelName}:${event}`, error);
        }
      };
      
      echoInstance.private(channelName).listen(event, wrappedCallback);
      activeChannels[channelKey] = true;
    } catch (error) {
      console.error(`Error listening to channel ${channelName}, event ${event}:`, error);
    }
  }
}

// Helper to stop listening to a private channel
export function stopListeningToPrivateChannel(channelName: string, event: string) {
  const echoInstance = getEcho();
  if (echoInstance) {
    try {
      const channelKey = `${channelName}|${event}`;
      
      if (activeChannels[channelKey]) {
        console.log(`Stopped listening to channel: ${channelName}, event: ${event}`);
        echoInstance.private(channelName).stopListening(event);
        delete activeChannels[channelKey];
      }
    } catch (error) {
      console.error(`Error stopping listener on channel ${channelName}, event ${event}:`, error);
    }
  }
} 