import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Initialize Echo only on the client side
let echo: Echo<any> | null = null;

// Initialize Pusher and Laravel Echo
export function initEcho() {
  if (typeof window !== 'undefined' && !echo) {
    // @ts-ignore - Pusher is attached to window for Laravel Echo
    window.Pusher = Pusher;

    echo = new Echo({
      broadcaster: 'pusher',
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      forceTLS: true,
      // Enable if you need to debug
      // enabledTransports: ['ws', 'wss'],
      // disabledTransports: ['sockjs', 'xhr_polling', 'xhr_streaming'],
    });
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
    echo.disconnect();
    echo = null;
  }
}

// Helper to listen to private channels
export function listenToPrivateChannel(channelName: string, event: string, callback: (data: any) => void) {
  const echoInstance = getEcho();
  if (echoInstance) {
    return echoInstance.private(channelName).listen(event, callback);
  }
}

// Helper to stop listening to a private channel
export function stopListeningToPrivateChannel(channelName: string, event: string) {
  const echoInstance = getEcho();
  if (echoInstance) {
    echoInstance.private(channelName).stopListening(event);
  }
} 