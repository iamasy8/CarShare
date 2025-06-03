import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Initialize Echo only on the client side
let echo: Echo<any> | null = null;

// Initialize Pusher and Laravel Echo
export function initEcho() {
  if (typeof window !== 'undefined' && !echo) {
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

      echo = new Echo({
        broadcaster: 'pusher',
        key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
        forceTLS: true,
        authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,
        auth: {
          headers: {
            Accept: 'application/json',
            Authorization: typeof window !== 'undefined' ? 
              `Bearer ${localStorage.getItem('auth_token')}` : '',
          },
        },
        enabledTransports: ['ws', 'wss', 'xhr_streaming', 'xhr_polling', 'sockjs'],
      });

      console.log('Echo initialized successfully');
    } catch (error) {
      console.error('Error initializing Echo:', error);
    }
  }
  return echo;
}

// Get the Echo instance
export function getEcho() {
  if (!echo && typeof window !== 'undefined') {
    return initEcho();
  }
  return echo;
}

// Clean up Echo on logout
export function cleanupEcho() {
  if (echo) {
    try {
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
    console.log(`Listening to channel: ${channelName}, event: ${event}`);
    return echoInstance.private(channelName).listen(event, callback);
  }
}

// Helper to stop listening to a private channel
export function stopListeningToPrivateChannel(channelName: string, event: string) {
  const echoInstance = getEcho();
  if (echoInstance) {
    console.log(`Stopped listening to channel: ${channelName}, event: ${event}`);
    echoInstance.private(channelName).stopListening(event);
  }
} 