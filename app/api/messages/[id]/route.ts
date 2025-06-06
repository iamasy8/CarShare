import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
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
    const response = await axios.put(
      `${apiUrl}/messages/${id}`,
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
    console.error("Error updating message:", error.response?.data || error.message)
    
    // Return detailed error for debugging
    return NextResponse.json(
      { 
        error: "Failed to update message", 
        details: error.response?.data || error.message,
        status: error.response?.status
      },
      { status: error.response?.status || 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
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
    const response = await axios.delete(
      `${apiUrl}/messages/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    )

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("Error deleting message:", error.response?.data || error.message)
    
    // Return detailed error for debugging
    return NextResponse.json(
      { 
        error: "Failed to delete message", 
        details: error.response?.data || error.message,
        status: error.response?.status
      },
      { status: error.response?.status || 500 }
    )
  }
} 