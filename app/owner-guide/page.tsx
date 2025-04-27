import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, Camera, MessageSquare, CalendarCheck, Shield, BadgeCheck, Clock, FileText } from "lucide-react"

export default function OwnerGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Guide du propriétaire</h1>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[700px] mx-auto">
              Tout ce que vous devez savoir pour louer votre voiture avec succès sur CarShare
            </p>
          </div>
        </div>

        <Tabs defaultValue="debuter" className="mt-12">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4 h-auto mb-8">
            <TabsTrigger value="debuter" className="py-3">
              Débuter
            </TabsTrigger>
            <TabsTrigger value="annonces" className="py-3">
              Créer des annonces
            </TabsTrigger>
            <TabsTrigger value="gestion" className="py-3">
              Gestion des locations
            </TabsTrigger>
            <TabsTrigger value="optimiser" className="py-3">
              Optimiser vos revenus
            </TabsTrigger>
          </TabsList>

          <TabsContent value="debuter" className="space-y-8">
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold mb-4">Bienvenue sur CarShare</h2>
              <p className="text-gray-700 mb-6">
                Vous êtes sur le point de commencer votre aventure en tant que propriétaire de véhicule sur notre
                plateforme. Ce guide vous aidera à comprendre les bases pour bien démarrer.
              </p>

              <h3 className="text-xl font-medium mb-3">Étapes pour commencer</h3>
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-full text-red-600 mt-1">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Créez votre compte propriétaire</h4>
                    <p className="text-gray-600">
                      Si ce n'est pas déjà fait, inscrivez-vous en tant que propriétaire et choisissez votre abonnement.
                      Vous aurez besoin de fournir vos informations personnelles et votre RIB pour recevoir vos
                      paiements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-full text-red-600 mt-1">
                    <Car className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Ajoutez votre premier véhicule</h4>
                    <p className="text-gray-600">
                      Renseignez toutes les informations relatives à votre véhicule : marque, modèle, année,
                      caractéristiques, disponibilités et tarifs. Plus votre annonce est détaillée, plus elle attire de
                      locataires potentiels.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-full text-red-600 mt-1">
                    <Camera className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Prenez de belles photos</h4>
                    <p className="text-gray-600">
                      Les photos sont cruciales pour attirer les locataires. Prenez des photos claires de l'extérieur et
                      de l'intérieur de votre véhicule. Assurez-vous que votre voiture est propre et dans un cadre
                      attractif.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-full text-red-600 mt-1">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Définissez vos disponibilités</h4>
                    <p className="text-gray-600">
                      Indiquez clairement les périodes pendant lesquelles votre véhicule est disponible à la location.
                      Vous pouvez bloquer certaines dates si vous avez besoin de votre voiture.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-xl font-medium mb-4">Documents nécessaires</h3>
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded-full text-gray-600 mt-1">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Carte grise du véhicule</h4>
                    <p className="text-gray-600">
                      Vous devrez fournir une copie de la carte grise pour vérifier que vous êtes bien le propriétaire.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded-full text-gray-600 mt-1">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Attestation d'assurance</h4>
                    <p className="text-gray-600">
                      Une copie de votre attestation d'assurance en cours de validité est requise.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded-full text-gray-600 mt-1">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Pièce d'identité</h4>
                    <p className="text-gray-600">Carte d'identité ou passeport pour vérifier votre identité.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded-full text-gray-600 mt-1">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">RIB</h4>
                    <p className="text-gray-600">Pour recevoir vos paiements directement sur votre compte bancaire.</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="annonces" className="space-y-8">
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold mb-4">Créer des annonces efficaces</h2>
              <p className="text-gray-700 mb-6">
                Une annonce bien rédigée et complète augmente considérablement vos chances de louer votre véhicule.
                Voici nos conseils pour optimiser vos annonces.
              </p>

              <h3 className="text-xl font-medium mb-3">Titre et description</h3>
              <div className="space-y-4 mb-6">
                <p className="text-gray-600">
                  <span className="font-medium">Le titre :</span> Soyez précis et attractif. Mentionnez la marque, le
                  modèle et une caractéristique clé (ex: "BMW Série 3 Cabriolet - Parfaite pour l'été").
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">La description :</span> Décrivez en détail votre véhicule, son état, ses
                  points forts, et pourquoi les locataires devraient le choisir. Mentionnez également les conditions
                  particulières de location si vous en avez.
                </p>
              </div>

              <h3 className="text-xl font-medium mb-3">Photos de qualité</h3>
              <div className="space-y-4 mb-6">
                <p className="text-gray-600">
                  Les photos sont essentielles pour attirer l'attention des locataires potentiels.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Nettoyez soigneusement votre voiture avant de prendre les photos</li>
                  <li>Prenez des photos en extérieur avec une bonne luminosité naturelle</li>
                  <li>Multipliez les angles : avant, arrière, côtés, intérieur (sièges, tableau de bord, coffre)</li>
                  <li>Mettez en valeur les équipements spécifiques (GPS, siège bébé, etc.)</li>
                  <li>Évitez les fonds encombrés ou peu flatteurs</li>
                </ul>
              </div>

              <h3 className="text-xl font-medium mb-3">Tarification</h3>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Définir le bon prix est crucial pour attirer des locataires tout en vous assurant un revenu
                  satisfaisant.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Consultez les prix des véhicules similaires sur la plateforme</li>
                  <li>Tenez compte de l'âge, de l'état et des options de votre véhicule</li>
                  <li>Pensez à ajuster vos tarifs en fonction des saisons et de la demande</li>
                  <li>Proposez des réductions pour les locations longue durée</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Annonces approuvées</CardTitle>
                  <CardDescription>Nos conseillers vérifient chaque annonce</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Toutes les annonces sont validées par notre équipe pour garantir leur conformité et leur
                    authenticité. Ce processus peut prendre jusqu'à 24h.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Mise à jour facile</CardTitle>
                  <CardDescription>Modifiez vos annonces à tout moment</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Vous pouvez facilement mettre à jour vos disponibilités, tarifs et informations sur votre véhicule
                    depuis votre tableau de bord propriétaire.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Annonces multiples</CardTitle>
                  <CardDescription>Gérez plusieurs véhicules</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Selon votre abonnement, vous pouvez ajouter plusieurs véhicules à votre compte et gérer toutes vos
                    annonces depuis une seule interface.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gestion" className="space-y-8">
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold mb-4">Gérer vos locations efficacement</h2>
              <p className="text-gray-700 mb-6">
                Une bonne gestion de vos locations est essentielle pour garantir une expérience positive tant pour vous
                que pour vos locataires.
              </p>

              <h3 className="text-xl font-medium mb-3">Répondre aux demandes</h3>
              <div className="space-y-4 mb-6">
                <p className="text-gray-600">
                  La réactivité est un facteur clé de réussite. Essayez de répondre aux demandes dans les 24 heures.
                </p>
                <div className="flex items-start gap-3 mt-4">
                  <div className="bg-red-100 p-2 rounded-full text-red-600 mt-1">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Communication efficace</h4>
                    <p className="text-gray-600">
                      Soyez clair, courtois et précis dans vos échanges avec les locataires potentiels. N'hésitez pas à
                      poser des questions sur leur projet de location pour vous assurer que votre véhicule correspond à
                      leurs besoins.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-medium mb-3">Avant la location</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-full text-red-600 mt-1">
                    <CalendarCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Organiser la remise des clés</h4>
                    <p className="text-gray-600">
                      Convenez d'un lieu et d'un horaire qui conviennent aux deux parties. Prévoyez suffisamment de
                      temps pour effectuer l'état des lieux du véhicule et expliquer les particularités de votre voiture
                      au locataire.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-full text-red-600 mt-1">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">État des lieux</h4>
                    <p className="text-gray-600">
                      Effectuez un état des lieux détaillé du véhicule, en notant tout dommage existant et en vérifiant
                      le niveau de carburant. Prenez des photos et faites signer le document par le locataire.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-medium mb-3">Après la location</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-full text-red-600 mt-1">
                    <Car className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Vérification du véhicule</h4>
                    <p className="text-gray-600">
                      Au retour, vérifiez que votre véhicule est dans le même état qu'au départ. Contrôlez le
                      kilométrage et le niveau de carburant et comparez-les avec l'état des lieux initial.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-full text-red-600 mt-1">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Évaluez votre locataire</h4>
                    <p className="text-gray-600">
                      N'oubliez pas de laisser une évaluation à votre locataire. Cela aide à construire une communauté
                      de confiance et permet aux autres propriétaires de faire des choix éclairés.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-xl font-medium mb-4">Gérer les imprévus</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="text-lg font-medium mb-2">Retards</h4>
                  <p className="text-gray-600">
                    Si le locataire est en retard pour le retour du véhicule, contactez-le pour connaître la situation.
                    Si nécessaire, appliquez les frais de retard conformément à vos conditions.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-2">Annulations</h4>
                  <p className="text-gray-600">
                    En cas d'annulation, nos politiques s'appliquent automatiquement selon le délai d'annulation. Vous
                    pouvez également faire preuve de flexibilité si vous le souhaitez.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-2">Accidents</h4>
                  <p className="text-gray-600">
                    En cas d'accident, demandez au locataire de remplir un constat amiable et de vous contacter
                    immédiatement. Informez également notre service d'assistance.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-2">Litiges</h4>
                  <p className="text-gray-600">
                    En cas de désaccord avec le locataire, essayez d'abord de résoudre le problème à l'amiable. Si
                    nécessaire, contactez notre service client qui pourra servir de médiateur.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="optimiser" className="space-y-8">
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold mb-4">Optimiser vos revenus</h2>
              <p className="text-gray-700 mb-6">
                Maximisez vos revenus grâce à nos conseils d'optimisation et augmentez le taux de réservation de votre
                véhicule.
              </p>

              <h3 className="text-xl font-medium mb-3">Tarification dynamique</h3>
              <div className="space-y-4 mb-6">
                <p className="text-gray-600">Adaptez vos tarifs en fonction de la demande et de la saison :</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Augmentez vos prix pendant les périodes de forte demande (été, vacances scolaires)</li>
                  <li>Proposez des tarifs plus attractifs pendant les périodes creuses</li>
                  <li>Offrez des réductions pour les locations de longue durée</li>
                  <li>Créez des forfaits week-end ou semaine avec des tarifs préférentiels</li>
                </ul>
              </div>

              <h3 className="text-xl font-medium mb-3">Augmentez votre visibilité</h3>
              <div className="space-y-4 mb-6">
                <p className="text-gray-600">
                  Plus votre annonce est visible, plus vous avez de chances de recevoir des demandes de location :
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Mettez régulièrement à jour votre annonce pour qu'elle reste en tête des résultats</li>
                  <li>Répondez rapidement aux demandes (cela améliore votre classement)</li>
                  <li>Souscrivez à notre option "Annonce en vedette" pour une visibilité accrue</li>
                  <li>Complétez intégralement votre profil propriétaire</li>
                </ul>
              </div>

              <h3 className="text-xl font-medium mb-3">Fidélisez vos locataires</h3>
              <div className="space-y-4">
                <p className="text-gray-600">Un locataire satisfait reviendra et vous recommandera :</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Offrez un service irréprochable (ponctualité, véhicule propre)</li>
                  <li>Soyez flexible quand c'est possible (horaires, lieux de rendez-vous)</li>
                  <li>Proposez des extras appréciés (siège bébé, GPS, etc.)</li>
                  <li>Envoyez un message de remerciement après la location</li>
                  <li>Proposez des réductions aux locataires réguliers</li>
                </ul>
              </div>
            </div>

            <div className="bg-red-50 p-6 rounded-lg border border-red-100">
              <h3 className="text-xl font-medium text-red-700 mb-4">Les clés du succès</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex justify-center mb-3">
                    <div className="bg-red-100 p-2 rounded-full text-red-600">
                      <Camera className="h-6 w-6" />
                    </div>
                  </div>
                  <h4 className="text-center font-medium mb-2">Photos de qualité</h4>
                  <p className="text-gray-600 text-sm text-center">
                    Les annonces avec des photos professionnelles reçoivent jusqu'à 40% de demandes en plus.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex justify-center mb-3">
                    <div className="bg-red-100 p-2 rounded-full text-red-600">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                  </div>
                  <h4 className="text-center font-medium mb-2">Réactivité</h4>
                  <p className="text-gray-600 text-sm text-center">
                    Répondre dans l'heure aux demandes augmente vos chances de confirmation de 80%.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex justify-center mb-3">
                    <div className="bg-red-100 p-2 rounded-full text-red-600">
                      <BadgeCheck className="h-6 w-6" />
                    </div>
                  </div>
                  <h4 className="text-center font-medium mb-2">Évaluations positives</h4>
                  <p className="text-gray-600 text-sm text-center">
                    Les propriétaires avec 5 étoiles louent leur véhicule 3 fois plus souvent.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
