import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("Testing API connection to backend...");
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

    // Make a request to the backend API
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cars`);
    
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);
    console.log("Response data:", response.data);
    
    // Return the response data
    res.status(200).json({
      success: true,
      data: response.data,
      message: 'Backend API connection successful'
    });
  } catch (error: any) {
    console.error("API test error:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response ? error.response.data : null
    });
  }
} 