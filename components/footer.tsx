"use client"

import React from "react"
import Link from "next/link"
import { Car, Facebook, Instagram, MessageCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { moroccoLocalization } from "@/lib/localization"

// Footer links structure
const footerLinks = {
  quickLinks: [
    { name: "Accueil", href: "/" },
    { name: "Rechercher", href: "/search" },
    { name: "Comment ça marche", href: "/how-it-works" },
    { name: "À propos de nous", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  owners: [
    { name: "Devenir propriétaire", href: "/register?type=owner" },
    { name: "Comment ça marche", href: "/owner-info/how-it-works" },
    { name: "Tarifs et abonnements", href: "/owner-info/pricing" },
    { name: "Guide du propriétaire", href: "/owner-info/guide" },
    { name: "FAQ propriétaires", href: "/owner-info/faq" },
  ],
  legal: [
    { name: "Conditions générales", href: "/terms" },
    { name: "Politique de confidentialité", href: "/privacy" },
    { name: "Politique de cookies", href: "/cookies" },
    { name: "Mentions légales", href: "/legal" },
  ],
}

// Social media links with default values
const socialLinks = [
  {
    name: "Facebook",
    href: moroccoLocalization.socialMedia?.facebook || "https://www.facebook.com/carshare",
    icon: Facebook,
  },
  {
    name: "Instagram",
    href: moroccoLocalization.socialMedia?.instagram || "https://www.instagram.com/carshare",
    icon: Instagram,
  },
  {
    name: "WhatsApp",
    href: moroccoLocalization.socialMedia?.whatsapp || "https://wa.me/2126123456",
    icon: MessageCircle,
  },
]

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold mb-4">
              <Car className="h-6 w-6 text-red-500" />
              <span className="text-white">CarShare</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              CarShare est une plateforme permettant d'emprunter ou de louer des véhicules particuliers à des tarifs avantageux.
            </p>
            <div className="flex space-x-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 rounded-full p-2 flex items-center justify-center transition-colors"
                  aria-label={`Visiter notre page ${social.name}`}
                >
                  <social.icon className="h-5 w-5 text-gray-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold uppercase mb-4 tracking-wider">
              Liens rapides
            </h3>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Owners Section */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold uppercase mb-4 tracking-wider">
              Propriétaires
            </h3>
            <ul className="space-y-2">
              {footerLinks.owners.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Section */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold uppercase mb-4 tracking-wider">
              Légal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} CarShare. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
