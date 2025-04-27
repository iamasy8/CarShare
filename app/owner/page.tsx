"use client"

import { useEffect } from "react"
import { redirect } from "next/navigation"

export default function OwnerPage() {
  useEffect(() => {
    redirect("/owner/dashboard")
  }, [])
  
  return null
} 