import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    // For FormData requests, we need to handle them differently
    const contentType = request.headers.get("content-type") || ""
    let response

    if (contentType.includes("multipart/form-data")) {
      // Handle FormData
      const formData = await request.formData()
      
      // Get base URL without trailing /api since it's already included in NEXT_PUBLIC_API_URL
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
      // Use the URL from environment variable if available
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || `${baseUrl}/api`
      
      response = await axios.post(
        `${apiUrl}/conversations/${id}/messages`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data"
          },
        }
      )
    } else {
      // Parse JSON body
      const body = await request.json()
      
      // Get base URL without trailing /api since it's already included in NEXT_PUBLIC_API_URL
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
      // Use the URL from environment variable if available
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || `${baseUrl}/api`
      
      response = await axios.post(
        `${apiUrl}/conversations/${id}/messages`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          },
        }
      )
    }

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("Error sending message:", error.response?.data || error.message)
    
    // Return detailed error for debugging
    return NextResponse.json(
      { 
        error: "Failed to send message", 
        details: error.response?.data || error.message,
        status: error.response?.status
      },
      { status: error.response?.status || 500 }
    )
  }
} 