import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function POST(request: NextRequest) {
  try {
    // Get the auth token from the cookie or authorization header
    let token = request.cookies.get("auth_token")?.value
    
    // If not in cookies, try to get from the Authorization header
    if (!token) {
      const authHeader = request.headers.get("Authorization")
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7)
      }
    }
    
    // If still no token, check headers for forwarded token
    if (!token) {
      const xAuthToken = request.headers.get("x-auth-token")
      if (xAuthToken) {
        token = xAuthToken
      }
    }
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      )
    }

    // Parse the request body
    const body = await request.json()
    
    // Get base URL without trailing /api since it's already included in NEXT_PUBLIC_API_URL
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
    // Use the URL from environment variable if available
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || `${baseUrl}/api`
    
    // Forward the request to the backend
    const response = await axios.post(
      `${apiUrl}/conversations`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
      }
    )

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("Error creating conversation:", error.response?.data || error.message)
    
    // Return detailed error for debugging
    return NextResponse.json(
      { 
        error: "Failed to create conversation", 
        details: error.response?.data || error.message,
        status: error.response?.status
      },
      { status: error.response?.status || 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the auth token from the cookie or authorization header
    let token = request.cookies.get("auth_token")?.value
    
    // If not in cookies, try to get from the Authorization header
    if (!token) {
      const authHeader = request.headers.get("Authorization")
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7)
      }
    }
    
    // If still no token, check headers for forwarded token
    if (!token) {
      const xAuthToken = request.headers.get("x-auth-token")
      if (xAuthToken) {
        token = xAuthToken
      }
    }
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      )
    }
    
    // Get base URL without trailing /api since it's already included in NEXT_PUBLIC_API_URL
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
    // Use the URL from environment variable if available
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || `${baseUrl}/api`
    
    // Forward the request to the backend
    const response = await axios.get(
      `${apiUrl}/conversations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    )

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("Error fetching conversations:", error.response?.data || error.message)
    
    // Return detailed error for debugging
    return NextResponse.json(
      { 
        error: "Failed to fetch conversations", 
        details: error.response?.data || error.message,
        status: error.response?.status
      },
      { status: error.response?.status || 500 }
    )
  }
} 