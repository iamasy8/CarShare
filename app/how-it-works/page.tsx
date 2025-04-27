import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MessageSquare, Calendar, Car, CreditCard, Shield, Clock, Zap } from "lucide-react"
import Link from "next/link"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Comment ça marche</h1>
            <p className="text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[700px] mx-auto">
              Découvrez comment CarShare facilite la location de voitures entre particuliers
            </p>
          </div>
        </div>

        <Tabs defaultValue="renter" className="mt-12">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="renter">Je veux louer une voiture</TabsTrigger>
              <TabsTrigger value="owner">Je veux proposer ma voiture</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="renter" className="space-y-12">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
                    <Search className="h-8 w-8" />
                  </div>
                  <div className="absolute top-1/2 left-full w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 hidden lg:block" />
                </div>
                <h3 className="text-xl font-bold mb-2">1. Recherchez</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Trouvez la voiture idéale parmi notre large sélection en utilisant les filtres de recherche.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
                    <MessageSquare className="h-8 w-8" />
                  </div>
                  <div className="absolute top-1/2 left-full w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 hidden lg:block" />
                </div>
                <h3 className="text-xl font-bold mb-2">2. Réservez</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Sélectionnez vos dates et envoyez une demande de réservation au propriétaire.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
                    <Calendar className="h-8 w-8" />
                  </div>
                  <div className="absolute top-1/2 left-full w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 hidden lg:block" />
                </div>
                <h3 className="text-xl font-bold mb-2">3. Récupérez</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Rencontrez le propriétaire pour récupérer les clés et faire l'état des lieux du véhicule.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
                    <Car className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">4. Profitez</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Conduisez en toute liberté et restituez le véhicule à la fin de votre location.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Les avantages pour les locataires</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full text-red-600 dark:text-red-300 mb-4">
                        <Zap className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold mb-2">Simplicité</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Réservez en quelques clics et gérez toutes vos locations depuis votre espace personnel.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full text-red-600 dark:text-red-300 mb-4">
                        <Shield className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold mb-2">Sécurité</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tous les véhicules sont vérifiés et les propriétaires sont évalués par la communauté.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full text-red-600 dark:text-red-300 mb-4">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold mb-2">Économies</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Des prix compétitifs et transparents, sans frais cachés ni surprises.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Prêt à trouver votre voiture idéale ?</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Des milliers de propriétaires dans toute la France sont prêts à vous louer leur véhicule. Commencez
                votre recherche dès maintenant !
              </p>
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
                <Link href="/search">
                  Rechercher une voiture
                  <Search className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="owner" className="space-y-12">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
                    <Car className="h-8 w-8" />
                  </div>
                  <div className="absolute top-1/2 left-full w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 hidden lg:block" />
                </div>
                <h3 className="text-xl font-bold mb-2">1. Inscrivez-vous</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Créez votre compte propriétaire et ajoutez les informations de votre véhicule.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
                    <Calendar className="h-8 w-8" />
                  </div>
                  <div className="absolute top-1/2 left-full w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 hidden lg:block" />
                </div>
                <h3 className="text-xl font-bold mb-2">2. Publiez</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Créez votre annonce avec photos, description et définissez vos disponibilités et tarifs.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
                    <MessageSquare className="h-8 w-8" />
                  </div>
                  <div className="absolute top-1/2 left-full w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 hidden lg:block" />
                </div>
                <h3 className="text-xl font-bold mb-2">3. Échangez</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Recevez des demandes de réservation et échangez avec les locataires potentiels.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
                    <CreditCard className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">4. Gagnez</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Remettez les clés au locataire et recevez votre paiement de manière sécurisée.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Les avantages pour les propriétaires</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full text-red-600 dark:text-red-300 mb-4">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold mb-2">Revenus complémentaires</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Rentabilisez votre véhicule lorsque vous ne l'utilisez pas et générez des revenus
                        supplémentaires.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full text-red-600 dark:text-red-300 mb-4">
                        <Shield className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold mb-2">Assurance incluse</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Votre véhicule est couvert pendant toute la durée de la location par notre assurance partenaire.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full text-red-600 dark:text-red-300 mb-4">
                        <Clock className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold mb-2">Flexibilité totale</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Vous gardez le contrôle total sur vos disponibilités, vos tarifs et les locataires que vous
                        acceptez.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Prêt à rentabiliser votre véhicule ?</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Rejoignez notre communauté de propriétaires et commencez à générer des revenus avec votre véhicule dès
                aujourd'hui.
              </p>
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
                <Link href="/register?type=owner">
                  Devenir propriétaire
                  <Car className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-8 text-center">Questions fréquentes</h2>
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
              <h3 className="font-semibold text-lg mb-2">Comment fonctionne l'assurance ?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Toutes les locations incluent une assurance tous risques fournie par notre partenaire. Cette assurance
                couvre les dommages matériels et corporels pendant la durée de la location.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
              <h3 className="font-semibold text-lg mb-2">Que faire en cas de panne ou d'accident ?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                En cas de problème, contactez immédiatement notre assistance 24/7. Nous vous guiderons dans les
                démarches à suivre et vous aiderons à trouver une solution rapidement.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
              <h3 className="font-semibold text-lg mb-2">Comment sont gérés les paiements ?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Les paiements sont sécurisés et traités par notre plateforme. Le locataire paie lors de la réservation,
                et le propriétaire reçoit son paiement 24h après le début de la location.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
              <h3 className="font-semibold text-lg mb-2">Puis-je annuler une réservation ?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Oui, les annulations sont possibles selon notre politique. Les conditions varient en fonction du délai
                avant le début de la location. Consultez nos conditions générales pour plus de détails.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/faq">Voir toutes les questions fréquentes</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
