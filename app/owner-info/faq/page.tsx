import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ChevronRight } from "lucide-react"

export default function OwnerFAQ() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">FAQ propriétaires</h1>
        <p className="text-lg text-gray-600 mb-12">
          Trouvez des réponses aux questions fréquemment posées par les propriétaires sur CarShare.
        </p>

        {/* FAQ Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <a 
            href="#inscription" 
            className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors flex items-center justify-between"
          >
            <span className="font-medium">Inscription</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </a>
          <a 
            href="#voiture" 
            className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors flex items-center justify-between"
          >
            <span className="font-medium">Votre voiture</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </a>
          <a 
            href="#locations" 
            className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors flex items-center justify-between"
          >
            <span className="font-medium">Locations</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </a>
          <a 
            href="#paiements" 
            className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors flex items-center justify-between"
          >
            <span className="font-medium">Paiements</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </a>
          <a 
            href="#assurance" 
            className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors flex items-center justify-between"
          >
            <span className="font-medium">Assurance</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </a>
          <a 
            href="#problemes" 
            className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors flex items-center justify-between"
          >
            <span className="font-medium">Problèmes</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </a>
        </div>

        {/* Inscription Section */}
        <section id="inscription" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-6">Inscription</h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium py-4">
                Quelles sont les conditions pour devenir propriétaire sur CarShare ?
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-600">
                Pour devenir propriétaire sur CarShare, vous devez avoir un véhicule de moins de 15 ans, 
                en bon état, avec tous les documents en règle (assurance, contrôle technique valide). 
                Vous devez également être majeur, posséder un permis de conduire valide et disposer d'un compte bancaire 
                pour recevoir vos paiements.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium py-4">
                Combien coûte l'inscription en tant que propriétaire ?
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-600">
                L'inscription en tant que propriétaire est gratuite. CarShare prélève uniquement une commission sur chaque 
                location réalisée. Vous pouvez consulter nos différentes formules d'abonnement 
                <Link href="/owner-info/pricing" className="text-red-600 hover:underline"> ici</Link> pour réduire ces commissions.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium py-4">
                Combien de temps prend la validation de mon profil ?
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-600">
                Généralement, la validation de votre profil prend entre 24 et 48 heures ouvrées. 
                Cela peut prendre plus de temps si des documents supplémentaires sont nécessaires 
                ou pendant les périodes de forte demande.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Votre voiture Section */}
        <section id="voiture" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-6">Votre voiture</h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium py-4">
                Quels types de véhicules sont acceptés sur CarShare ?
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-600">
                CarShare accepte presque tous les types de véhicules personnels en bon état : 
                citadines, berlines, SUV, monospaces, utilitaires, etc. Les véhicules doivent avoir moins de 15 ans,
                un kilométrage raisonnable et être en bon état de fonctionnement avec un contrôle technique valide.
                Certains véhicules de luxe ou de collection peuvent faire l'objet d'une procédure spéciale.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium py-4">
                Comment optimiser l'annonce de ma voiture ?
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-600">
                Pour optimiser votre annonce, prenez des photos de qualité sous plusieurs angles (extérieur et intérieur),
                rédigez une description détaillée mentionnant les équipements et spécificités de votre véhicule,
                fixez un prix compétitif en fonction du marché local, et indiquez une large disponibilité.
                Consultez notre <Link href="/owner-info/guide" className="text-red-600 hover:underline">guide du propriétaire</Link> pour plus de conseils.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium py-4">
                Comment déterminer le prix de location de ma voiture ?
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-600">
                Pour fixer votre tarif, comparez avec des véhicules similaires dans votre région, 
                prenez en compte l'âge, le modèle et l'état de votre véhicule, ainsi que la demande saisonnière.
                Notre algorithme vous propose également un prix recommandé basé sur ces facteurs.
                N'oubliez pas que vous pouvez proposer des réductions pour les locations longue durée.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Locations Section */}
        <section id="locations" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-6">Locations</h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium py-4">
                Comment puis-je définir la disponibilité de ma voiture ?
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-600">
                Dans votre tableau de bord propriétaire, vous pouvez définir un calendrier de disponibilité
                en indiquant les jours où votre véhicule est disponible à la location. Vous pouvez définir
                des périodes récurrentes ou bloquer des dates spécifiques. Plus votre véhicule est disponible,
                plus vous augmentez vos chances de location.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium py-4">
                Puis-je refuser une demande de location ?
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-600">
                Oui, vous pouvez refuser une demande de location si vous avez des raisons valables.
                Cependant, un taux élevé de refus peut affecter négativement votre visibilité sur la plateforme.
                Si vous savez que votre véhicule ne sera pas disponible à certaines dates, il est préférable
                de les bloquer à l'avance dans votre calendrier.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium py-4">
                Comment se déroule la remise des clés ?
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-600">
                La remise des clés se fait généralement en personne, à un lieu convenu avec le locataire.
                Lors de cette rencontre, vous faites un état des lieux du véhicule en utilisant notre application.
                Vous vérifiez ensemble le niveau de carburant, le kilométrage et l'état général du véhicule.
                Notre application vous guide à chaque étape de ce processus pour assurer une transaction sécurisée.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Paiements Section */}
        <section id="paiements" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-6">Paiements</h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium py-4">
                Quand suis-je payé pour mes locations ?
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-600">
                Le paiement est généralement effectué 24 à 48 heures après la fin de la location, 
                une fois que le locataire a confirmé la remise du véhicule. Les fonds sont versés directement 
                sur votre compte bancaire. Vous pouvez suivre tous vos paiements dans la section 
                "Mes revenus" de votre tableau de bord propriétaire.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium py-4">
                Quelle commission prélève CarShare sur mes locations ?
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-600">
                CarShare prélève une commission de 15% à 25% sur chaque location, selon votre formule d'abonnement.
                Vous pouvez consulter nos différentes formules et leurs avantages 
                <Link href="/owner-info/pricing" className="text-red-600 hover:underline"> ici</Link>. 
                Cette commission couvre les frais de service, l'assurance pendant la location, et le support client.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium py-4">
                Comment sont calculés mes revenus potentiels ?
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-600">
                Vos revenus potentiels dépendent de plusieurs facteurs : le tarif journalier de votre véhicule,
                sa disponibilité, sa catégorie, sa localisation et la demande dans votre région.
                Dans votre tableau de bord, vous trouverez un estimateur de revenus qui vous aide à
                évaluer vos gains potentiels en fonction de ces paramètres.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Assurance Section */}
        <section id="assurance" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-6">Assurance</h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium py-4">
                Mon véhicule est-il assuré pendant les locations ?
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-600">
                Oui, tous les véhicules loués via CarShare sont couverts par notre assurance tous risques
                pendant toute la durée de la location. Cette assurance prend automatiquement le relais
                de votre assurance personnelle dès que le locataire prend possession du véhicule et
                jusqu'à sa restitution.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium py-4">
                Que couvre l'assurance CarShare exactement ?
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-600">
                Notre assurance couvre les dommages matériels au véhicule, le vol, les catastrophes naturelles,
                ainsi que la responsabilité civile du conducteur. Le montant de la franchise varie selon
                le type de véhicule et l'option d'assurance choisie par le locataire.
                Les effets personnels laissés dans le véhicule ne sont pas couverts par cette assurance.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium py-4">
                Que faire en cas d'accident pendant une location ?
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-600">
                En cas d'accident, le locataire doit immédiatement contacter notre service d'assistance
                au 01 23 45 67 89 et remplir un constat à l'amiable. En tant que propriétaire,
                vous serez informé de la situation et notre équipe vous guidera dans les démarches.
                Tous les sinistres sont traités directement par notre service d'assurance sans impact sur
                votre bonus personnel.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Problèmes Section */}
        <section id="problemes" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-6">Problèmes</h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium py-4">
                Que faire si le locataire rend le véhicule en retard ?
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-600">
                Si le locataire est en retard, essayez d'abord de le contacter directement.
                Si vous n'obtenez pas de réponse, contactez notre service client qui vous aidera
                à résoudre la situation. Des frais de retard sont automatiquement facturés au locataire,
                et vous serez indemnisé pour ce dépassement de la durée de location initialement prévue.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium py-4">
                Comment gérer un désaccord avec un locataire ?
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-600">
                En cas de désaccord, essayez d'abord de résoudre le problème à l'amiable avec le locataire.
                Si cela n'est pas possible, contactez notre service de médiation qui examinera la situation
                et proposera une solution équitable. Tous les échanges et transactions étant enregistrés
                sur notre plateforme, nous pouvons facilement vérifier les faits en cas de litige.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-medium py-4">
                Que faire si je constate des dommages sur mon véhicule après une location ?
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-gray-600">
                Si vous constatez des dommages non signalés lors de la restitution du véhicule,
                vous devez le signaler via l'application dans les 24 heures suivant la fin de la location.
                Prenez des photos des dégâts et décrivez-les précisément. Notre service d'assurance
                examinera votre demande et prendra les mesures nécessaires pour la réparation de votre véhicule.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Contact section */}
        <div className="bg-gray-50 p-8 rounded-lg mt-12">
          <h2 className="text-xl font-bold mb-4">Vous n'avez pas trouvé la réponse à votre question ?</h2>
          <p className="mb-6 text-gray-600">
            Notre équipe de support est disponible pour vous aider à résoudre toutes vos questions ou préoccupations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/contact">
                Contacter le support
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/owner-info/guide">
                Consulter le guide du propriétaire
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 