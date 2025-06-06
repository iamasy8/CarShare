/**
 * Gets the authentication token from local storage (client-side) or cookies (server-side)
 */
export async function getAuthToken(): Promise<string | null> {
  // Client-side: Get from localStorage
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  
  // Server-side: Can't access localStorage, return null
  // In a real app, you might get the token from cookies or an auth service
  return null;
} 