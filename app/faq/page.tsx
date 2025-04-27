import type { Metadata } from "next"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "FAQ - CarShare",
  description: "Foire aux questions sur CarShare",
}

export default function FAQPage() {
  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Foire aux questions</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Trouvez des réponses aux questions les plus fréquemment posées sur CarShare.
        </p>

        <Tabs defaultValue="general" className="mb-8">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="renting">Location</TabsTrigger>
            <TabsTrigger value="owners">Propriétaires</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Questions générales</CardTitle>
                <CardDescription>Informations générales sur CarShare et son fonctionnement</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left">Qu'est-ce que CarShare ?</AccordionTrigger>
                    <AccordionContent>
                      CarShare est une plateforme de location de voitures entre particuliers. Nous mettons en relation
                      des propriétaires de véhicules avec des personnes qui ont besoin d'une voiture pour une courte
                      durée. Notre mission est de rendre la location de voitures plus accessible, plus économique et
                      plus écologique.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left">Comment fonctionne CarShare ?</AccordionTrigger>
                    <AccordionContent>
                      Les propriétaires de voitures peuvent créer une annonce sur notre plateforme, en précisant les
                      détails de leur véhicule, sa disponibilité et son prix de location. Les locataires peuvent
                      rechercher des voitures disponibles dans leur région, réserver en ligne et payer via notre
                      plateforme sécurisée. Après validation par le propriétaire, ils peuvent récupérer le véhicule à la
                      date convenue.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left">Quels sont les avantages de CarShare ?</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          Pour les locataires : des prix plus avantageux que les agences traditionnelles, une grande
                          variété de véhicules, et un processus de réservation simple.
                        </li>
                        <li>
                          Pour les propriétaires : un moyen de rentabiliser leur voiture lorsqu'ils ne l'utilisent pas,
                          avec une assurance complète pendant la durée de la location.
                        </li>
                        <li>
                          Pour tous : une solution plus écologique qui favorise le partage plutôt que la possession.
                        </li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-left">Comment s'inscrire sur CarShare ?</AccordionTrigger>
                    <AccordionContent>
                      L'inscription sur CarShare est gratuite et rapide. Cliquez sur le bouton "Inscription" en haut à
                      droite de la page d'accueil, renseignez vos informations personnelles, téléchargez une photo de
                      votre pièce d'identité et de votre permis de conduire pour vérification. Une fois votre compte
                      validé, vous pourrez louer une voiture ou proposer la vôtre à la location.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-left">Comment contacter le service client ?</AccordionTrigger>
                    <AccordionContent>
                      Notre équipe de support est disponible 7j/7 de 8h à 22h. Vous pouvez nous contacter par email à
                      support@carshare.com, par téléphone au 01 23 45 67 89, ou via le formulaire de contact disponible
                      sur notre site. Nous nous efforçons de répondre à toutes les demandes dans un délai de 24h.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="renting">
            <Card>
              <CardHeader>
                <CardTitle>Questions sur la location</CardTitle>
                <CardDescription>Tout ce que vous devez savoir pour louer un véhicule</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left">Comment réserver une voiture ?</AccordionTrigger>
                    <AccordionContent>
                      Pour réserver une voiture, utilisez notre moteur de recherche pour trouver un véhicule qui
                      correspond à vos besoins. Filtrez par localisation, dates, type de véhicule et prix. Une fois que
                      vous avez trouvé la voiture idéale, cliquez sur "Réserver", sélectionnez les dates souhaitées et
                      procédez au paiement. Le propriétaire recevra votre demande et pourra l'accepter ou la refuser
                      dans un délai de 24h.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left">
                      Quels documents sont nécessaires pour louer ?
                    </AccordionTrigger>
                    <AccordionContent>
                      Pour louer un véhicule sur CarShare, vous devez avoir au moins 21 ans et posséder un permis de
                      conduire valide depuis au moins 2 ans. Lors de votre inscription, vous devrez télécharger une
                      copie de votre pièce d'identité et de votre permis de conduire. Ces documents seront vérifiés par
                      notre équipe avant que vous puissiez effectuer votre première réservation.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left">Comment fonctionne le paiement ?</AccordionTrigger>
                    <AccordionContent>
                      Le paiement s'effectue en ligne au moment de la réservation. Nous acceptons les cartes de
                      crédit/débit (Visa, Mastercard, American Express) et PayPal. Le montant est débité immédiatement
                      mais n'est transféré au propriétaire qu'après le début de la location, ce qui vous permet d'être
                      remboursé intégralement en cas d'annulation avant cette date.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-left">Quelle est la politique d'annulation ?</AccordionTrigger>
                    <AccordionContent>
                      Notre politique d'annulation standard est la suivante :
                      <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>Annulation plus de 72h avant le début de la location : remboursement à 100%</li>
                        <li>Entre 72h et 24h : remboursement à 50%</li>
                        <li>Moins de 24h : aucun remboursement</li>
                      </ul>
                      Certains propriétaires peuvent proposer des conditions plus flexibles, qui seront indiquées sur
                      l'annonce du véhicule.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-left">Suis-je assuré pendant la location ?</AccordionTrigger>
                    <AccordionContent>
                      Oui, toutes les locations effectuées via CarShare incluent une assurance tous risques avec
                      assistance 24/7. Cette assurance couvre les dommages matériels et corporels en cas d'accident. Une
                      franchise de 800€ s'applique en cas de sinistre responsable, mais vous pouvez la réduire à 150€ en
                      souscrivant à notre option de réduction de franchise pour 8€/jour.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="owners">
            <Card>
              <CardHeader>
                <CardTitle>Questions pour les propriétaires</CardTitle>
                <CardDescription>
                  Informations pour ceux qui souhaitent mettre leur véhicule en location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left">Comment mettre ma voiture en location ?</AccordionTrigger>
                    <AccordionContent>
                      Pour mettre votre voiture en location, créez un compte propriétaire sur CarShare, puis cliquez sur
                      "Ajouter une voiture". Renseignez les caractéristiques de votre véhicule, ajoutez des photos de
                      qualité, définissez votre prix et vos disponibilités. Notre équipe vérifiera votre annonce avant
                      de la publier, généralement sous 24 à 48 heures.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left">
                      Combien puis-je gagner en louant ma voiture ?
                    </AccordionTrigger>
                    <AccordionContent>
                      Les revenus varient selon le modèle de votre véhicule, sa localisation et sa disponibilité. En
                      moyenne, nos propriétaires gagnent entre 300€ et 600€ par mois en louant leur voiture 10 jours par
                      mois. Vous fixez vous-même votre tarif, mais notre outil de tarification intelligente peut vous
                      suggérer un prix optimal basé sur les données du marché.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left">
                      Ma voiture est-elle assurée pendant la location ?
                    </AccordionTrigger>
                    <AccordionContent>
                      Oui, votre voiture est couverte par notre assurance tous risques pendant toute la durée de la
                      location. Cette assurance remplace votre assurance personnelle pendant cette période et couvre les
                      dommages matériels, le vol, l'incendie et la responsabilité civile. En cas de sinistre, notre
                      équipe dédiée s'occupe de toutes les démarches administratives.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-left">
                      Comment sont sélectionnés les locataires ?
                    </AccordionTrigger>
                    <AccordionContent>
                      Tous les locataires sont vérifiés avant de pouvoir réserver un véhicule. Nous vérifions leur
                      identité, leur permis de conduire et leur historique de conduite. Vous recevez également leur
                      profil complet avec les avis des autres propriétaires avant d'accepter une réservation. Vous
                      gardez toujours le contrôle et pouvez refuser une demande si vous avez des doutes.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-left">
                      Quels sont les frais prélevés par CarShare ?
                    </AccordionTrigger>
                    <AccordionContent>
                      CarShare prélève une commission de 25% sur le montant de chaque location. Cette commission couvre
                      l'assurance tous risques, l'assistance 24/7, la vérification des locataires, le service client et
                      les frais de transaction bancaire. Vous recevez 75% du montant de la location, versé sur votre
                      compte bancaire dans les 5 jours ouvrés suivant la fin de la location.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12">
          <h2 className="text-xl font-semibold mb-4">Vous n'avez pas trouvé de réponse à votre question ?</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Notre équipe de support est là pour vous aider avec toutes vos questions.
          </p>
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/contact">
              Contactez-nous <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
