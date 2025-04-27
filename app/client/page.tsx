"use client"

import { useEffect } from "react"
import { redirect } from "next/navigation"

export default function ClientPage() {
  useEffect(() => {
    redirect("/client/dashboard")
  }, [])
  
  return null
} 