import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  // In a real app, you would fetch the unread message count from your database
  // based on the authenticated user
  
  try {
    // Return mock data - 2 unread messages
    return NextResponse.json({ count: 2 });
  } catch (error) {
    console.error('Error fetching unread message count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unread message count' },
      { status: 500 }
    );
  }
} 