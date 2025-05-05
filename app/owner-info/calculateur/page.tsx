import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Calculator, Car, Calendar, ArrowRight } from "lucide-react"

export default function RevenueCalculator() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Calculateur de revenus pour propriétaires
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Estimez combien vous pourriez gagner en louant votre voiture sur CarShare au Maroc. 
            Remplissez les informations ci-dessous pour obtenir une estimation personnalisée.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Calculator Form */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Calculator className="mr-3 text-red-600" size={20} />
              Informations sur votre véhicule
            </h2>

            <div className="space-y-6">
              {/* Vehicle Type */}
              <div>
                <Label htmlFor="vehicle-type" className="text-base mb-2 block">
                  Type de véhicule
                </Label>
                <Select defaultValue="compact">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un type de véhicule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="city">Citadine</SelectItem>
                    <SelectItem value="compact">Compacte</SelectItem>
                    <SelectItem value="sedan">Berline</SelectItem>
                    <SelectItem value="suv">SUV / Crossover</SelectItem>
                    <SelectItem value="minivan">Monospace</SelectItem>
                    <SelectItem value="luxury">Véhicule de luxe</SelectItem>
                    <SelectItem value="utility">Utilitaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Car Age */}
              <div>
                <Label htmlFor="car-age" className="text-base mb-2 block">
                  Âge du véhicule
                </Label>
                <Select defaultValue="3-5">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez l'âge du véhicule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-2">Moins de 2 ans</SelectItem>
                    <SelectItem value="3-5">3 à 5 ans</SelectItem>
                    <SelectItem value="6-8">6 à 8 ans</SelectItem>
                    <SelectItem value="9-12">9 à 12 ans</SelectItem>
                    <SelectItem value="13-15">13 à 15 ans</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location" className="text-base mb-2 block">
                  Localisation
                </Label>
                <Select defaultValue="casablanca">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre ville" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casablanca">Casablanca</SelectItem>
                    <SelectItem value="rabat">Rabat</SelectItem>
                    <SelectItem value="marrakech">Marrakech</SelectItem>
                    <SelectItem value="tanger">Tanger</SelectItem>
                    <SelectItem value="agadir">Agadir</SelectItem>
                    <SelectItem value="fes">Fès</SelectItem>
                    <SelectItem value="meknes">Meknès</SelectItem>
                    <SelectItem value="oujda">Oujda</SelectItem>
                    <SelectItem value="other">Autre ville</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2 border-t">
                <h2 className="text-xl font-semibold my-6 flex items-center">
                  <Calendar className="mr-3 text-red-600" size={20} />
                  Disponibilité
                </h2>

                {/* Availability - Weekends */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="weekends" className="text-base">
                      Disponibilité les week-ends par mois
                    </Label>
                    <span className="font-medium">2 week-ends</span>
                  </div>
                  <Slider
                    defaultValue={[2]}
                    max={4}
                    step={1}
                    className="my-4"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>0</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                  </div>
                </div>

                {/* Availability - Weekdays */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="weekdays" className="text-base">
                      Jours disponibles en semaine par mois
                    </Label>
                    <span className="font-medium">8 jours</span>
                  </div>
                  <Slider
                    defaultValue={[8]}
                    max={20}
                    step={1}
                    className="my-4"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>0</span>
                    <span>5</span>
                    <span>10</span>
                    <span>15</span>
                    <span>20</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-end mt-6">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Calculer mes revenus
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border flex flex-col">
            <h2 className="text-xl font-semibold mb-6">Vos revenus estimés</h2>
            
            <div className="bg-red-50 p-5 rounded-lg mb-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Revenu mensuel potentiel</h3>
                <p className="text-4xl font-bold text-red-600 mb-2">3 800 - 5 200 MAD</p>
                <p className="text-sm text-gray-500">Basé sur vos critères et votre disponibilité</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Revenus annuels estimés</span>
                <span className="font-semibold">45 600 - 62 400 MAD</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Prix journalier moyen</span>
                <span className="font-semibold">450 MAD</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Commission CarShare</span>
                <span className="font-semibold">15%</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Taux d'occupation estimé</span>
                <span className="font-semibold">75%</span>
              </div>
            </div>
            
            <div className="mt-auto">
              <p className="text-sm text-gray-500 mb-4">
                Ces estimations sont basées sur les données de locations similaires dans votre région. 
                Les revenus réels peuvent varier selon la demande, la saison et d'autres facteurs.
              </p>
              <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                <Link href="/register">
                  Devenir propriétaire <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <Car className="h-10 w-10 text-red-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Les voitures les plus demandées</h3>
            <p className="text-gray-600 mb-4">
              Les SUV, les compactes et les citadines sont les types de véhicules les plus demandés sur notre plateforme au Maroc.
            </p>
            <ul className="text-gray-600 space-y-1 mb-4">
              <li className="flex items-center gap-2">
                <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">SUV</span>
                <span>Jusqu'à 550 MAD/jour</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">Compacte</span>
                <span>Jusqu'à 450 MAD/jour</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">Citadine</span>
                <span>Jusqu'à 350 MAD/jour</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <Calendar className="h-10 w-10 text-red-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Périodes les plus rentables</h3>
            <p className="text-gray-600 mb-4">
              Les revenus peuvent varier selon la saison. Voici les périodes où la demande est la plus forte :
            </p>
            <ul className="text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">Été</span>
                <span>Juin à Août : +25% de demande</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">Ramadan</span>
                <span>Période du Ramadan : +30% de demande</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">Fêtes</span>
                <span>Aïd et jours fériés : +20% de demande</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="h-10 w-10 text-red-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Maximisez vos revenus</h3>
            <p className="text-gray-600 mb-4">
              Quelques conseils pour augmenter vos revenus sur CarShare au Maroc :
            </p>
            <ul className="text-gray-600 space-y-2 list-disc pl-5 mb-4">
              <li>Prenez des photos de qualité de votre véhicule</li>
              <li>Répondez rapidement aux demandes de location</li>
              <li>Maintenez votre véhicule propre et en bon état</li>
              <li>Offrez un service client exceptionnel</li>
              <li>Ajustez vos tarifs selon la saison et la demande</li>
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>
          
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold mb-2">Comment sont calculés ces revenus estimés ?</h3>
              <p className="text-gray-600">
                Nos estimations sont basées sur les données réelles de locations similaires dans votre région au Maroc, 
                en tenant compte du type de véhicule, de son âge, de votre localisation et de la disponibilité que vous avez indiquée.
                Nous prenons également en compte les variations saisonnières et le taux d'occupation moyen observé sur notre plateforme.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold mb-2">Puis-je gagner plus que ce qui est estimé ?</h3>
              <p className="text-gray-600">
                Absolument ! Ces estimations sont des moyennes basées sur des données historiques. 
                De nombreux propriétaires optimisent leurs revenus en ajustant leurs tarifs selon la demande, 
                en offrant des services supplémentaires, ou en rendant leur véhicule disponible pendant les périodes de forte demande.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold mb-2">Comment puis-je optimiser le prix de location de ma voiture ?</h3>
              <p className="text-gray-600">
                Nous vous recommandons de commencer avec le prix suggéré par notre algorithme, puis d'ajuster en fonction de la demande. 
                Nos données montrent qu'un prix compétitif au début permet d'obtenir rapidement des locations et des avis positifs, 
                ce qui vous permettra par la suite d'optimiser votre tarif. Notre équipe peut également vous conseiller sur le prix optimal.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-red-600 text-white rounded-lg p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Prêt à transformer votre voiture en source de revenus ?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            L'inscription ne prend que 5 minutes et notre équipe est là pour vous accompagner à chaque étape.
          </p>
          <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100">
            <Link href="/register">
              Inscrire ma voiture gratuitement
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 