import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: "booking",
    message: "Nouvelle réservation confirmée pour votre Renault Clio",
    time: "Il y a 2 heures",
    read: false
  },
  {
    id: 2,
    type: "system",
    message: "Bienvenue sur CarShare! Complétez votre profil pour attirer plus de clients.",
    time: "Il y a 1 jour",
    read: true
  },
  {
    id: 3,
    type: "review",
    message: "Vous avez reçu une nouvelle évaluation 5 étoiles!",
    time: "Il y a 3 jours",
    read: false
  }
];

export async function GET() {
  // In a real app, you would fetch notifications from your database
  // based on the authenticated user
  
  try {
    // Return mock data
    return NextResponse.json(mockNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
} 