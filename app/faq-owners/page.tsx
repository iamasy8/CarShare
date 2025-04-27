import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function FAQOwnersPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">FAQ propriétaires</h1>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[700px] mx-auto">
              Trouvez des réponses à vos questions concernant la location de votre véhicule sur CarShare
            </p>
          </div>
        </div>

        <div className="mt-8 max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input placeholder="Rechercher une question..." className="pl-10" />
          </div>
        </div>

        <Tabs defaultValue="general" className="mt-12">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4 h-auto mb-8">
            <TabsTrigger value="general" className="py-3">
              Général
            </TabsTrigger>
            <TabsTrigger value="annonces" className="py-3">
              Annonces
            </TabsTrigger>
            <TabsTrigger value="locations" className="py-3">
              Locations
            </TabsTrigger>
            <TabsTrigger value="paiements" className="py-3">
              Paiements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="bg-white rounded-lg border">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="px-4 py-4 hover:bg-gray-50">
                    Comment fonctionne CarShare pour les propriétaires ?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-gray-600">
                      CarShare est une plateforme qui met en relation les propriétaires de véhicules avec des locataires
                      potentiels. En tant que propriétaire, vous pouvez publier des annonces pour vos véhicules, définir
                      vos tarifs et disponibilités, et communiquer avec les locataires intéressés. Vous gardez le
                      contrôle total sur qui peut louer votre voiture.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="px-4 py-4 hover:bg-gray-50">
                    Quels sont les avantages de louer ma voiture sur CarShare ?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-gray-600">
                      Louer votre voiture sur CarShare vous permet de générer des revenus complémentaires avec un
                      véhicule qui reste souvent inutilisé. Notre plateforme vous offre une grande visibilité, un
                      système de messagerie sécurisé, et une communauté de locataires vérifiés. Vous définissez vos
                      propres conditions et gardez le contrôle complet sur la location.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="px-4 py-4 hover:bg-gray-50">
                    Quels types de véhicules puis-je proposer sur CarShare ?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-gray-600">
                      Vous pouvez proposer tout type de véhicule sur CarShare : voitures particulières, SUV,
                      utilitaires, camionnettes, et même des véhicules de luxe ou de collection. Le véhicule doit être
                      en bon état, assuré, et avec un contrôle technique à jour.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="px-4 py-4 hover:bg-gray-50">
                    Combien coûte l'inscription en tant que propriétaire ?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-gray-600">
                      L'inscription en tant que propriétaire nécessite un abonnement mensuel ou annuel. Nous proposons
                      différentes formules selon vos besoins, à partir de 19,99€ par mois. Consultez notre page "Tarifs
                      et abonnements" pour plus de détails sur les différentes options.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="px-4 py-4 hover:bg-gray-50">
                    Quels documents dois-je fournir pour m'inscrire ?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-gray-600">
                      Pour vous inscrire, vous devez fournir :
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Une pièce d'identité valide (carte d'identité ou passeport)</li>
                        <li>Un justificatif de domicile de moins de 3 mois</li>
                        <li>
                          Pour chaque véhicule : la carte grise, l'attestation d'assurance et le dernier contrôle
                          technique
                        </li>
                        <li>Un RIB pour recevoir vos paiements</li>
                      </ul>
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>

          <TabsContent value="annonces">
            <div className="bg-white rounded-lg border">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="px-4 py-4 hover:bg-gray-50">
                    Comment créer une annonce attractive ?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-gray-600">
                      Pour créer une annonce attractive :
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Prenez des photos de qualité sous différents angles (extérieur et intérieur)</li>
                        <li>Rédigez une description détaillée et honnête de votre véhicule</li>
                        <li>Mentionnez toutes les caractéristiques et options importantes</li>
                        <li>Soyez clair sur vos conditions de location</li>
                        <li>Fixez un prix compétitif en comparant avec des véhicules similaires</li>
                      </ul>
                      Consultez notre "Guide du propriétaire" pour des conseils plus détaillés.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="px-4 py-4 hover:bg-gray-50">
                    Combien de véhicules puis-je proposer ?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-gray-600">
                      Le nombre de véhicules que vous pouvez proposer dépend de votre formule d'abonnement :
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Formule Standard : jusqu'à 3 véhicules</li>
                        <li>Formule Premium : jusqu'à 10 véhicules</li>
                        <li>Formule Professionnel : nombre illimité de véhicules</li>
                      </ul>
                      Vous pouvez changer de formule à tout moment si vous souhaitez ajouter plus de véhicules.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="px-4 py-4 hover:bg-gray-50">
                    Comment définir le prix de location ?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-gray-600">
                      Pour définir un prix compétitif, nous vous recommandons de :
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Consulter les tarifs de véhicules similaires sur la plateforme</li>
                        <li>Prendre en compte l'âge, l'état et les options de votre véhicule</li>
                        <li>
                          Considérer votre localisation (les zones urbaines permettent généralement des tarifs plus
                          élevés)
                        </li>
                        <li>Ajuster vos tarifs selon les saisons (été, périodes de vacances)</li>
                      </ul>
                      Vous pouvez également proposer des tarifs dégressifs pour les locations de longue durée.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="px-4 py-4 hover:bg-gray-50">
                    Combien de temps faut-il pour que mon annonce soit approuvée ?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-gray-600">
                      Après soumission, votre annonce est examinée par notre équipe pour s'assurer qu'elle respecte nos
                      conditions. Ce processus prend généralement entre 24 et 48 heures ouvrées. Vous recevrez une
                      notification dès que votre annonce sera approuvée ou si des modifications sont nécessaires.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="px-4 py-4 hover:bg-gray-50">
                    Puis-je modifier mon annonce après publication ?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-gray-600">
                      Oui, vous pouvez modifier votre annonce à tout moment depuis votre espace propriétaire. Vous
                      pouvez changer les photos, la description, les tarifs et les disponibilités. Si vous apportez des
                      modifications importantes, l'annonce pourra être soumise à une nouvelle validation.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>

          <TabsContent value="locations">
            <div className="bg-white rounded-lg border">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="px-4 py-4 hover:bg-gray-50">
                    Comment se déroule la remise des clés ?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-gray-600">
                      La remise des clés se fait en personne, à un lieu et une heure convenus entre vous et le
                      locataire. C'est le moment de :
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Vérifier l'identité du locataire et son permis de conduire</li>
                        <li>Faire le tour du véhicule ensemble et noter tout dommage existant</li>
                        <li>Remplir et signer l'état des lieux de départ</li>
                        <li>Vérifier le niveau de carburant</li>
                        <li>Expliquer les particularités du véhicule</li>
                      </ul>
                      Nous recommandons de prendre des photos pour documenter l'état du véhicule.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="px-4 py-4 hover:bg-gray-50">
                    Que faire en cas de retard ou d'annulation ?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-gray-600">
                      En cas de retard du locataire, contactez-le pour connaître sa situation. Si le retard est
                      significatif, vous pouvez appliquer des frais de retard selon vos conditions.
                      <br />
                      <br />
                      Pour les annulations, notre politique s'applique automatiquement :
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Annulation plus de 48h avant : remboursement intégral au locataire</li>
                        <li>Annulation entre 24h et 48h : 50% du montant vous est versé</li>
                        <li>Annulation moins de 24h : 100% du montant vous est versé</li>
                      </ul>
                      Vous pouvez toutefois faire preuve de flexibilité si vous le souhaitez.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="px-4 py-4 hover:bg-gray-50">
                    Que faire en cas d'accident ou de dommage ?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-gray-600">
                      En cas d'accident ou de dommage :
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Demandez au locataire de vous informer immédiatement</li>
                        <li>Assurez-vous qu'un constat amiable a été rempli si nécessaire</li>
                        <li>Documentez les dommages avec des photos lors du retour du véhicule</li>
                        <li>Informez notre service d'assistance</li>
                        <li>Selon la gravité, contactez votre assureur</li>
                      </ul>
                      Les dommages mineurs peuvent être couverts par le dépôt de garantie, tandis que les dommages plus
                      importants relèvent généralement de l'assurance.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="px-4 py-4 hover:bg-gray-50">
                    Comment gérer un litige avec un locataire ?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-gray-600">
                      En cas de litige :
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Essayez d'abord de résoudre le problème à l'amiable par la discussion</li>
                        <li>Documentez tous les éléments relatifs au litige (photos, messages, etc.)</li>
                        <li>
                          Si aucun accord n'est trouvé, contactez notre service client via votre espace propriétaire
                        </li>
                        <li>
                          Notre équipe de médiation interviendra pour analyser la situation et proposer une solution
                          équitable
                        </li>
                      </ul>
                      La plupart des litiges peuvent être résolus grâce à une communication claire et à notre médiation.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="px-4 py-4 hover:bg-gray-50">
                    Puis-je refuser une demande de location ?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-gray-600">
                      Oui, vous êtes libre d'accepter ou de refuser toute demande de location. Vous pouvez évaluer le
                      profil du locataire, ses évaluations précédentes, et échanger avec lui avant de prendre votre
                      décision. Nous vous encourageons toutefois à justifier votre refus de manière courtoise, et à ne
                      pas discriminer les locataires potentiels sur des critères non pertinents.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>

          <TabsContent value="paiements">
            <div className="bg-white rounded-lg border">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="px-4 py-4 hover:bg-gray-50">
                    Comment suis-je payé pour mes locations ?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-gray-600">
                      Les paiements sont traités automatiquement après chaque location. Une fois la location terminée et
                      en l'absence de litige, le montant vous est versé par virement bancaire sur le compte que vous
                      avez indiqué lors de votre inscription. Le virement est généralement effectué dans les 3 à 5 jours
                      ouvrés suivant la fin de la location.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="px-4 py-4 hover:bg-gray-50">
                    Quels sont les frais prélevés par CarShare ?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-gray-600">
                      En tant que propriétaire, vous avez déjà souscrit à un abonnement mensuel ou annuel. Aucun frais
                      supplémentaire n'est prélevé sur vos locations. 100% du montant payé par le locataire (hors frais
                      de service facturés au locataire) vous est reversé.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="px-4 py-4 hover:bg-gray-50">
                    Comment fonctionne la caution/dépôt de garantie ?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-gray-600">
                      Le dépôt de garantie est une somme bloquée sur la carte bancaire du locataire au moment de la
                      réservation. Ce montant n'est pas débité sauf en cas de dommage constaté. Vous pouvez définir le
                      montant du dépôt de garantie lors de la création de votre annonce. En cas de dommage, vous pouvez
                      demander à débiter tout ou partie de ce dépôt via votre espace propriétaire, avec justificatifs à
                      l'appui.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="px-4 py-4 hover:bg-gray-50">
                    Comment facturer des frais supplémentaires ?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-gray-600">
                      Vous pouvez facturer des frais supplémentaires dans les cas suivants :
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Retour du véhicule avec moins de carburant qu'au départ</li>
                        <li>Kilométrage excédentaire par rapport à ce qui était convenu</li>
                        <li>Retard significatif pour le retour du véhicule</li>
                        <li>Nettoyage nécessaire (si le véhicule est rendu très sale)</li>
                      </ul>
                      Ces frais supplémentaires doivent être documentés et justifiés. Vous pouvez les déduire du dépôt
                      de garantie ou demander un paiement supplémentaire via notre plateforme. Il est recommandé de
                      préciser ces conditions dans votre annonce.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="px-4 py-4 hover:bg-gray-50">
                    Quelles sont mes obligations fiscales ?
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="text-gray-600">
                      Les revenus générés par la location de votre véhicule sont imposables. Vous devez les déclarer à
                      l'administration fiscale. CarShare vous fournit un récapitulatif annuel de vos revenus pour
                      faciliter votre déclaration. Nous vous recommandons de consulter un expert-comptable ou
                      l'administration fiscale pour connaître précisément vos obligations, car celles-ci peuvent varier
                      selon votre situation personnelle et le volume de vos locations.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Vous n'avez pas trouvé de réponse à votre question ?</p>
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <a href="/contact">Contactez notre support</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
