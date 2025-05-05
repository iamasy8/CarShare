import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"

export default function BecomingOwner() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-10 items-center mb-16">
          <div className="md:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Rentabilisez votre voiture et rejoignez la communauté CarShare
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Gagnez jusqu'à 650€ par mois en louant votre voiture quand vous ne l'utilisez pas.
              Inscription simple, gratuite et sécurisée.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
                <Link href="/register">
                  Devenir propriétaire <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/owner-info/calculateur">
                  Estimez vos revenus
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 relative h-72 md:h-96 w-full">
            <Image 
              src="/images/owner-hero.jpg" 
              alt="Propriétaire avec clés de voiture" 
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Benefits Section */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Pourquoi devenir propriétaire sur CarShare ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="bg-red-100 p-3 rounded-full inline-block mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Revenus complémentaires</h3>
              <p className="text-gray-600">
                Transformez votre véhicule en source de revenus et couvrez ses frais d'entretien, d'assurance et de stationnement.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="bg-red-100 p-3 rounded-full inline-block mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Protection totale</h3>
              <p className="text-gray-600">
                Assurance tous risques incluse pendant les locations, vérification des locataires et assistance 24/7.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="bg-red-100 p-3 rounded-full inline-block mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Flexibilité totale</h3>
              <p className="text-gray-600">
                Vous gardez le contrôle : choisissez vos disponibilités, vos tarifs et acceptez uniquement les demandes qui vous conviennent.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Comment ça marche ?
          </h2>
          
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
            
            <div className="space-y-12 md:space-y-0 relative">
              {/* Step 1 */}
              <div className="md:grid md:grid-cols-2 md:gap-8 items-center relative">
                <div className="md:pr-12 mb-8 md:mb-0 md:text-right">
                  <span className="bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">Étape 1</span>
                  <h3 className="text-xl font-semibold mb-3">Inscrivez-vous gratuitement</h3>
                  <p className="text-gray-600">
                    Créez votre compte en 5 minutes et renseignez les informations sur votre véhicule : marque, modèle, année, photos et description.
                  </p>
                </div>
                <div className="md:hidden h-12 w-12 absolute left-0 top-0 flex items-center justify-center bg-red-600 text-white rounded-full">1</div>
                <div className="hidden md:block h-12 w-12 absolute left-1/2 top-5 flex items-center justify-center bg-red-600 text-white rounded-full transform -translate-x-1/2">1</div>
                <div className="md:pl-12 relative">
                  <div className="aspect-video bg-gray-100 rounded-lg relative">
                    <Image
                      src="/images/inscription.jpg"
                      alt="Inscription sur la plateforme"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="md:grid md:grid-cols-2 md:gap-8 items-center relative pt-6 md:pt-16">
                <div className="order-last md:pl-12 mb-8 md:mb-0">
                  <span className="bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">Étape 2</span>
                  <h3 className="text-xl font-semibold mb-3">Recevez des demandes de location</h3>
                  <p className="text-gray-600">
                    Les locataires intéressés vous envoient des demandes. Vérifiez leurs profils et leurs avis avant d'accepter. Vous restez maître de votre décision.
                  </p>
                </div>
                <div className="md:hidden h-12 w-12 absolute left-0 top-6 flex items-center justify-center bg-red-600 text-white rounded-full">2</div>
                <div className="hidden md:block h-12 w-12 absolute left-1/2 top-20 flex items-center justify-center bg-red-600 text-white rounded-full transform -translate-x-1/2">2</div>
                <div className="order-first md:pr-12 relative">
                  <div className="aspect-video bg-gray-100 rounded-lg relative">
                    <Image
                      src="/images/demandes.jpg"
                      alt="Recevoir des demandes de location"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="md:grid md:grid-cols-2 md:gap-8 items-center relative pt-6 md:pt-16">
                <div className="md:pr-12 mb-8 md:mb-0 md:text-right">
                  <span className="bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">Étape 3</span>
                  <h3 className="text-xl font-semibold mb-3">Remettez les clés et gagnez de l'argent</h3>
                  <p className="text-gray-600">
                    Rencontrez le locataire pour la remise des clés et faites un état des lieux via l'application. Vous recevez votre paiement 24h après la fin de la location.
                  </p>
                </div>
                <div className="md:hidden h-12 w-12 absolute left-0 top-6 flex items-center justify-center bg-red-600 text-white rounded-full">3</div>
                <div className="hidden md:block h-12 w-12 absolute left-1/2 top-20 flex items-center justify-center bg-red-600 text-white rounded-full transform -translate-x-1/2">3</div>
                <div className="md:pl-12 relative">
                  <div className="aspect-video bg-gray-100 rounded-lg relative">
                    <Image
                      src="/images/cles.jpg"
                      alt="Remise des clés au locataire"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="mb-20 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            Conditions requises pour inscrire votre véhicule
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Véhicule de moins de 15 ans</h3>
                <p className="text-gray-600 text-sm">
                  Votre véhicule doit avoir moins de 15 ans à compter de sa date de première mise en circulation.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Kilométrage inférieur à 200 000 km</h3>
                <p className="text-gray-600 text-sm">
                  Le compteur kilométrique de votre véhicule doit afficher moins de 200 000 km.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Contrôle technique valide</h3>
                <p className="text-gray-600 text-sm">
                  Votre véhicule doit avoir un contrôle technique à jour et valide.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Bon état général</h3>
                <p className="text-gray-600 text-sm">
                  Votre véhicule doit être en bon état de fonctionnement, sans dommages majeurs.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Assurance en cours de validité</h3>
                <p className="text-gray-600 text-sm">
                  Vous devez avoir une assurance valide pour votre véhicule.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Documents en règle</h3>
                <p className="text-gray-600 text-sm">
                  Carte grise à votre nom ou autorisation du propriétaire si le véhicule ne vous appartient pas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Ils louent déjà leur voiture sur CarShare
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-start mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-4 relative">
                  <Image
                    src="/images/sophie.jpg"
                    alt="Photo de Sophie"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold">Sophie B.</p>
                  <p className="text-sm text-gray-500">Paris</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Je gagne entre 300€ et 450€ par mois en louant ma Peugeot 208 les week-ends et pendant mes vacances. 
                C'est ma voiture qui finance son crédit !"
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-start mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-4 relative">
                  <Image
                    src="/images/thomas.jpg"
                    alt="Photo de Thomas"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold">Thomas L.</p>
                  <p className="text-sm text-gray-500">Lyon</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "J'utilise CarShare depuis 1 an et je suis ravi. L'assurance tous risques me rassure 
                et le service client est toujours disponible. Ma voiture me rapporte au lieu de me coûter !"
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-start mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-4 relative">
                  <Image
                    src="/images/maria.jpg"
                    alt="Photo de Maria"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold">Maria C.</p>
                  <p className="text-sm text-gray-500">Marseille</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "J'ai déjà eu 15 locations en 3 mois ! La plateforme est simple à utiliser et les locataires 
                sont sérieux. Je recommande à tous les propriétaires de voitures peu utilisées."
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Questions fréquentes
          </h2>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Est-ce que ma voiture sera bien assurée ?</h3>
              <p className="text-gray-600">
                Oui, tous les véhicules sont couverts par notre assurance tous risques pendant toute la durée de la location.
                Cette assurance prend automatiquement le relais de votre assurance personnelle dès le début de la location.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Combien puis-je gagner en louant ma voiture ?</h3>
              <p className="text-gray-600">
                Les revenus varient selon le modèle de votre véhicule, sa localisation et sa disponibilité.
                En moyenne, nos propriétaires gagnent entre 200€ et 650€ par mois.
                Utilisez notre <Link href="/owner-info/calculateur" className="text-red-600 hover:underline">calculateur de revenus</Link> pour obtenir une estimation personnalisée.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Comment sont sélectionnés les locataires ?</h3>
              <p className="text-gray-600">
                Tous les locataires sont vérifiés : permis de conduire, pièce d'identité et coordonnées bancaires.
                Vous pouvez également consulter les avis laissés par d'autres propriétaires avant d'accepter une location.
                Vous restez libre d'accepter ou de refuser toute demande.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Et si ma voiture est endommagée pendant la location ?</h3>
              <p className="text-gray-600">
                Notre assurance couvre tous les dommages qui pourraient survenir pendant la location.
                En cas de sinistre, notre service client vous accompagne dans toutes les démarches et
                la réparation de votre véhicule est prise en charge selon les conditions de notre assurance.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link href="/owner-info/faq" className="text-red-600 hover:underline inline-flex items-center">
              Voir toutes les questions fréquentes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-red-600 text-white rounded-lg p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Prêt à rentabiliser votre voiture ?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de propriétaires satisfaits et commencez à gagner de l'argent avec votre véhicule.
            L'inscription ne prend que 5 minutes !
          </p>
          <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100">
            <Link href="/register">
              Inscrire ma voiture maintenant
            </Link>
          </Button>
        </section>
      </div>
    </div>
  )
} 