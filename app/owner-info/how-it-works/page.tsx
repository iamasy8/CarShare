import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Car, ArrowRight, Check } from "lucide-react"

export default function OwnerHowItWorks() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Comment ça marche pour les propriétaires</h1>
        <p className="text-lg text-gray-600 mb-8">
          Découvrez comment mettre votre véhicule en location et commencer à gagner de l'argent en quelques étapes simples.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-red-600 font-bold text-xl">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Inscrivez-vous</h3>
            <p className="text-gray-600">
              Créez un compte sur notre plateforme en quelques minutes et vérifiez votre identité.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-red-600 font-bold text-xl">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Ajoutez votre véhicule</h3>
            <p className="text-gray-600">
              Publiez les détails et photos de votre voiture et définissez vos tarifs et disponibilités.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-red-600 font-bold text-xl">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Louez et gagnez</h3>
            <p className="text-gray-600">
              Acceptez les demandes de location, remettez les clés et recevez votre paiement.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-bold mb-4">Avantages pour les propriétaires</h2>
          <ul className="space-y-3">
            {[
              "Rentabilisez votre véhicule lorsque vous ne l'utilisez pas",
              "Gagnez jusqu'à 1000€ par mois selon votre véhicule",
              "Assurance complète pendant les locations",
              "Plateforme sécurisée avec vérification des conducteurs",
              "Assistance 24/7 en cas de problème"
            ].map((benefit, index) => (
              <li key={index} className="flex items-start">
                <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Prêt à commencer ?</h2>
          <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
            <Link href="/register?type=owner">
              Devenir propriétaire
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 