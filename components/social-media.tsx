"use client"

import { Facebook, Instagram, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { moroccoLocalization } from "@/lib/localization"

interface SocialMediaProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function SocialMedia({ className, size = "md" }: SocialMediaProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const socialLinks = [
    {
      name: "Instagram",
      href: moroccoLocalization.socialMedia.instagram,
      icon: Instagram,
      color: "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500",
    },
    {
      name: "Facebook",
      href: moroccoLocalization.socialMedia.facebook,
      icon: Facebook,
      color: "bg-blue-600",
    },
    {
      name: "WhatsApp",
      href: moroccoLocalization.socialMedia.whatsapp,
      icon: MessageCircle,
      color: "bg-green-500",
    },
  ]

  return (
    <div className={cn("flex items-center space-x-4", className)}>
      {socialLinks.map((social) => (
        <Button
          key={social.name}
          variant="ghost"
          size="icon"
          className={cn(
            "rounded-full transition-all hover:scale-110",
            social.color,
            sizeClasses[size]
          )}
          asChild
        >
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visiter notre page ${social.name}`}
          >
            <social.icon className="h-1/2 w-1/2 text-white" />
          </a>
        </Button>
      ))}
    </div>
  )
} 