"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertTriangle, Clock, ShieldCheck } from "lucide-react"
import Link from "next/link"

/**
 * Component to display the verification status for owners
 * This will be used in the owner dashboard and other relevant pages
 */
export function VerificationStatus() {
  const { user } = useAuth()
  
  if (!user || user.role !== "owner") {
    return null
  }
  
  const isVerified = user.isVerified === true
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Statut de vérification</CardTitle>
          {isVerified ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          )}
        </div>
        <CardDescription>
          {isVerified 
            ? "Votre identité est vérifiée" 
            : "La vérification est requise pour publier des véhicules"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isVerified ? (
          <div className="flex items-center gap-3 text-sm">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <span>
              Votre compte est vérifié. Vous pouvez publier des véhicules et recevoir des demandes de location.
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-sm">
              <Clock className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="mb-1 font-medium">Vérification en attente</p>
                <p className="text-gray-500 dark:text-gray-400">
                  Pour des raisons de sécurité, nous devons vérifier votre identité avant que vous puissiez publier des véhicules.
                  Cela nous aide à assurer la sécurité de tous les utilisateurs.
                </p>
              </div>
            </div>
            
            <Button asChild className="w-full">
              <Link href="/owner/verify">
                Compléter la vérification
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 