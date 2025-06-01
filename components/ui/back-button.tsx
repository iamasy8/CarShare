"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BackButtonProps {
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  label?: string
  onClick?: (e: React.MouseEvent) => void
}

export function BackButton({
  className,
  variant = "ghost",
  size = "sm",
  label = "Retour",
  onClick
}: BackButtonProps) {
  const router = useRouter()

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onClick) {
      onClick(e)
    } else {
      router.back()
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleBack}
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      {label !== "" && label}
    </Button>
  )
} 