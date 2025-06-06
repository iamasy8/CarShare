import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query")
    
    if (!query || query.length < 2) {
      return NextResponse.json({ users: [] })
    }

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
      token = request.headers.get("x-auth-token")
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
    
    // Make direct request to backend
    const response = await axios.get(
      `${apiUrl}/users/search?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    )

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("Error searching users:", error.response?.data || error.message)
    
    // Return detailed error for debugging
    return NextResponse.json(
      { 
        error: "Failed to search users", 
        details: error.response?.data || error.message,
        status: error.response?.status
      },
      { status: error.response?.status || 500 }
    )
  }
} 