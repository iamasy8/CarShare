"use client"

import React from "react"
import { NavigationEvents } from "@/components/navigation-events"

export function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <NavigationEvents />
    </>
  )
} 