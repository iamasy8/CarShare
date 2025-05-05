import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight } from "lucide-react"

const pricingPlans = [
  {
    name: "Basique",
    price: "50",
    features: [
      "1 véhicule sur la plateforme",
      "Commission standard de 25%",
      "Support par email",
      "Assurance standard",
    ],
    isPopular: false,
  },
  {
    name: "Premium",
    price: "199",
    features: [
      "Jusqu'à 3 véhicules sur la plateforme",
      "Commission réduite de 20%",
      "Support prioritaire",
      "Assurance premium",
      "Visibilité accrue dans les résultats de recherche",
    ],
    isPopular: true,
  },
  {
    name: "Pro",
    price: "499",
    features: [
      "Véhicules illimités sur la plateforme",
      "Commission réduite de 15%",
      "Support dédié 24/7",
      "Assurance premium+",
      "Visibilité maximale dans les résultats de recherche",
      "Outils de gestion avancés",
    ],
    isPopular: false,
  }
]

export default function OwnerPricing() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Tarifs et abonnements pour les propriétaires</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choisissez le plan qui correspond le mieux à vos besoins et commencez à rentabiliser votre voiture au Maroc dès aujourd'hui.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.name} 
              className={`bg-white rounded-lg shadow-lg overflow-hidden flex flex-col ${
                plan.isPopular ? 'ring-2 ring-red-500 relative' : ''
              }`}
            >
              {plan.isPopular && (
                <div className="bg-red-500 text-white py-1 px-4 text-xs font-semibold uppercase absolute top-0 right-0 rounded-bl-lg">
                  Populaire
                </div>
              )}
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">{plan.price} MAD</span>
                  <span className="text-gray-500 ml-1">/mois</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="text-green-500 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 bg-gray-50">
                <Button 
                  className={`w-full ${plan.isPopular ? 'bg-red-600 hover:bg-red-700' : ''}`}
                  variant={plan.isPopular ? 'default' : 'outline'}
                  asChild
                >
                  <Link href={`/register?type=owner&plan=${plan.name.toLowerCase()}`}>
                    Choisir ce plan
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Questions fréquentes</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Puis-je changer de plan ultérieurement ?</h3>
              <p className="text-gray-600">
                Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment depuis votre tableau de bord.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Comment fonctionne la commission ?</h3>
              <p className="text-gray-600">
                La commission est prélevée uniquement sur les locations réalisées. Elle varie en fonction de votre plan d'abonnement.
                Pour le marché marocain, cette commission est calculée selon les tarifs locaux et versée en MAD.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Les abonnements sont-ils avec engagement ?</h3>
              <p className="text-gray-600">
                Non, tous nos plans sont sans engagement. Vous pouvez annuler à tout moment.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Les prix incluent-ils la TVA ?</h3>
              <p className="text-gray-600">
                Oui, tous nos prix affichés incluent la TVA marocaine de 20%.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
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