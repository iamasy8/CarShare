export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: number
  conversation_id: number
  user_id: number
  body: string | null
  image_url: string | null
  file_url: string | null
  file_name: string | null
  read_at: string | null
  created_at: string
  updated_at: string
  user?: User
}

export interface Conversation {
  id: number
  name: string | null
  is_group: boolean
  image_url: string | null
  created_at: string
  updated_at: string
  users?: User[]
  latest_message?: Message | null
  messages_count?: number
  pivot?: {
    is_admin: boolean
    last_read_at: string | null
  }
}

// Window augmentation for Laravel Echo
declare global {
  interface Window {
    Echo: {
      private: (channel: string) => {
        listen: (event: string, callback: (e: any) => void) => any
        stopListening: (event: string) => void
      }
    }
  }
} 