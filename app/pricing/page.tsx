import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Tarifs et abonnements</h1>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[700px] mx-auto">
              Choisissez l'abonnement qui vous convient pour louer vos véhicules sur CarShare
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
          {/* Free tier - hidden for this site as it doesn't have a free tier */}
          <div className="hidden flex flex-col p-6 bg-white rounded-xl shadow-sm border relative">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold">Découverte</h3>
              <div className="mt-4 text-center">
                <span className="text-3xl font-bold">Gratuit</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Pour les particuliers occasionnels</p>
            </div>
            <ul className="space-y-3 py-6">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-gray-700">1 véhicule maximum</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-gray-700">Photos limitées par annonce</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-gray-700">Messagerie de base</span>
              </li>
            </ul>
            <Button variant="outline" className="mt-auto">
              Sélectionner
            </Button>
          </div>

          {/* Standard plan */}
          <div className="flex flex-col p-6 bg-white rounded-xl shadow-sm border relative">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold">Standard</h3>
              <div className="mt-4 text-center">
                <span className="text-3xl font-bold">19,99€</span>
                <span className="text-gray-500">/mois</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Pour les propriétaires individuels</p>
            </div>
            <ul className="space-y-3 py-6">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-gray-700">Jusqu'à 3 véhicules</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-gray-700">20 photos par annonce</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-gray-700">Messagerie illimitée</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-gray-700">Statistiques de base</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-gray-700">Support par email</span>
              </li>
            </ul>
            <Button className="mt-auto bg-red-600 hover:bg-red-700">Sélectionner</Button>
          </div>

          {/* Premium plan */}
          <div className="flex flex-col p-6 bg-white rounded-xl shadow-sm border relative">
            <div className="absolute top-0 right-0 bg-red-600 text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg font-medium">
              Populaire
            </div>
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold">Premium</h3>
              <div className="mt-4 text-center">
                <span className="text-3xl font-bold">39,99€</span>
                <span className="text-gray-500">/mois</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Pour les propriétaires actifs</p>
            </div>
            <ul className="space-y-3 py-6">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-gray-700">Jusqu'à 10 véhicules</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-gray-700">50 photos par annonce</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-gray-700">Messagerie illimitée</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-gray-700">Statistiques avancées</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-gray-700">Annonces mises en avant</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-gray-700">Support prioritaire</span>
              </li>
            </ul>
            <Button className="mt-auto bg-red-600 hover:bg-red-700">Sélectionner</Button>
          </div>

          {/* Pro plan */}
          <div className="flex flex-col p-6 bg-white rounded-xl shadow-sm border relative">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold">Professionnel</h3>
              <div className="mt-4 text-center">
                <span className="text-3xl font-bold">89,99€</span>
                <span className="text-gray-500">/mois</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Pour les entreprises et professionnels</p>
            </div>
            <ul className="space-y-3 py-6">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-gray-700">Véhicules illimités</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-gray-700">100 photos par annonce</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-gray-700">API d'intégration</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-gray-700">Tableau de bord personnalisé</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-gray-700">Gestionnaire de compte dédié</span>
              </li>
            </ul>
            <Button className="mt-auto bg-red-600 hover:bg-red-700">Sélectionner</Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Abonnements annuels</h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-6">
            Économisez jusqu'à 20% avec nos abonnements annuels. Contactez-nous pour plus d'informations ou pour obtenir
            un devis personnalisé.
          </p>
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>

        <div className="mt-20 bg-white rounded-xl border p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Questions fréquentes</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-lg mb-2">Puis-je changer d'abonnement à tout moment ?</h3>
              <p className="text-gray-600">
                Oui, vous pouvez passer à un forfait supérieur à tout moment. Le changement prendra effet immédiatement
                et la différence sera calculée au prorata.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Quels moyens de paiement acceptez-vous ?</h3>
              <p className="text-gray-600">
                Nous acceptons les cartes de crédit (Visa, Mastercard, American Express) ainsi que les prélèvements SEPA
                pour les abonnements.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Y a-t-il un engagement de durée ?</h3>
              <p className="text-gray-600">
                Les abonnements mensuels sont sans engagement. Les abonnements annuels sont engageants pour 12 mois mais
                offrent une réduction importante.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Comment résilier mon abonnement ?</h3>
              <p className="text-gray-600">
                Vous pouvez résilier votre abonnement à tout moment depuis votre espace propriétaire. La résiliation
                prendra effet à la fin de la période en cours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
