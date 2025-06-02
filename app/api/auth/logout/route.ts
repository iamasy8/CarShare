import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api/apiClient';

/**
 * Handles logout requests by forwarding them to the backend API
 * This fixes the "api/api/auth/logout not found" error by providing a proper route
 */
export async function POST(request: NextRequest) {
  try {
    // Call the actual backend logout endpoint
    await apiClient.post('/logout');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  } catch (error: any) {
    console.error('Error during logout:', error);
    
    // Even if the backend call fails, we'll still return success
    // since we want the frontend to clear tokens and redirect
    return NextResponse.json({ 
      success: true, 
      message: 'Logged out client-side' 
    });
  }
}
