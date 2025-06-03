import Pusher from 'pusher-js';

// Extend the Window interface to include Pusher
declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
} 