import { Separator } from "@/components/ui/separator"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Politique de confidentialité
            </h1>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[700px] mx-auto">
              Dernière mise à jour : 10 avril 2023
            </p>
          </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-lg border max-w-4xl mx-auto">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p>
              Chez CarShare, nous accordons une grande importance à la protection de vos données personnelles. Cette
              politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos
              informations personnelles lorsque vous utilisez notre site web, nos applications mobiles et nos services
              (collectivement, le "Service").
            </p>
            <p>
              Veuillez lire attentivement cette politique de confidentialité. En utilisant notre Service, vous acceptez
              les pratiques décrites dans ce document.
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">2. Informations que nous collectons</h2>
            <h3 className="text-xl font-semibold mt-4 mb-2">2.1 Informations que vous nous fournissez</h3>
            <p>
              Nous collectons les informations que vous nous fournissez directement lorsque vous utilisez notre Service,
              notamment :
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>Informations d'inscription :</strong> Lorsque vous créez un compte, nous collectons votre nom,
                adresse e-mail, mot de passe, numéro de téléphone et d'autres informations requises pour l'inscription.
              </li>
              <li>
                <strong>Informations de profil :</strong> Vous pouvez également choisir de nous fournir des informations
                supplémentaires pour votre profil, telles qu'une photo de profil, une adresse, une date de naissance,
                etc.
              </li>
              <li>
                <strong>Informations de vérification :</strong> Pour assurer la sécurité de notre communauté, nous
                pouvons vous demander de vérifier votre identité en fournissant des documents officiels tels qu'une
                carte d'identité, un permis de conduire, etc.
              </li>
              <li>
                <strong>Informations sur le véhicule :</strong> Si vous êtes un Propriétaire, nous collectons des
                informations sur votre véhicule, telles que la marque, le modèle, l'année, la plaque d'immatriculation,
                les photos, etc.
              </li>
              <li>
                <strong>Informations de paiement :</strong> Lorsque vous effectuez ou recevez un paiement via notre
                Service, nous collectons des informations de paiement, telles que les numéros de carte de crédit ou les
                coordonnées bancaires.
              </li>
              <li>
                <strong>Communications :</strong> Lorsque vous communiquez avec nous ou avec d'autres utilisateurs via
                notre Service, nous collectons le contenu de ces communications.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-2">2.2 Informations collectées automatiquement</h3>
            <p>
              Lorsque vous utilisez notre Service, nous collectons automatiquement certaines informations, notamment :
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>Informations sur l'appareil :</strong> Nous collectons des informations sur l'appareil que vous
                utilisez pour accéder à notre Service, telles que le type d'appareil, le système d'exploitation,
                l'identifiant unique de l'appareil, l'adresse IP, etc.
              </li>
              <li>
                <strong>Informations de navigation :</strong> Nous collectons des informations sur votre activité sur
                notre Service, telles que les pages visitées, l'heure et la date de votre visite, les liens sur lesquels
                vous cliquez, etc.
              </li>
              <li>
                <strong>Informations de localisation :</strong> Avec votre consentement, nous pouvons collecter des
                informations précises sur votre localisation via GPS, Bluetooth ou WiFi.
              </li>
              <li>
                <strong>Cookies et technologies similaires :</strong> Nous utilisons des cookies et d'autres
                technologies de suivi pour collecter des informations sur votre utilisation de notre Service. Pour plus
                d'informations, veuillez consulter notre "Politique de cookies".
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-2">2.3 Informations provenant d'autres sources</h3>
            <p>
              Nous pouvons également obtenir des informations vous concernant à partir d'autres sources, notamment :
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Des partenaires commerciaux, tels que des services de vérification d'identité ou de solvabilité.</li>
              <li>
                Des plateformes de médias sociaux, si vous choisissez de vous connecter à notre Service via ces
                plateformes.
              </li>
              <li>Des sources publiques, telles que des registres publics ou des sites web accessibles au public.</li>
            </ul>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">3. Comment nous utilisons vos informations</h2>
            <p>Nous utilisons les informations que nous collectons pour :</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>Fournir, maintenir et améliorer notre Service :</strong> Nous utilisons vos informations pour
                traiter vos demandes, faciliter les transactions entre les utilisateurs, et améliorer continuellement
                notre Service.
              </li>
              <li>
                <strong>Personnaliser votre expérience :</strong> Nous utilisons vos informations pour personnaliser
                votre expérience sur notre Service, notamment en vous montrant des contenus et des offres adaptés à vos
                intérêts.
              </li>
              <li>
                <strong>Communiquer avec vous :</strong> Nous utilisons vos informations pour vous envoyer des
                communications relatives au Service, telles que des confirmations, des factures, des rappels, des
                informations techniques, des mises à jour, des alertes de sécurité, des messages de support et des
                messages administratifs.
              </li>
              <li>
                <strong>Assurer la sécurité et la conformité :</strong> Nous utilisons vos informations pour vérifier
                votre identité, prévenir et détecter les fraudes, résoudre les litiges, et faire respecter nos
                conditions d'utilisation.
              </li>
              <li>
                <strong>Marketing et publicité :</strong> Avec votre consentement, nous pouvons utiliser vos
                informations pour vous envoyer des messages marketing et vous montrer des publicités pertinentes.
              </li>
              <li>
                <strong>Analyse et recherche :</strong> Nous utilisons vos informations pour comprendre comment les
                utilisateurs interagissent avec notre Service, afin de l'améliorer et de développer de nouvelles
                fonctionnalités.
              </li>
            </ul>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">4. Comment nous partageons vos informations</h2>
            <p>Nous pouvons partager vos informations dans les situations suivantes :</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>Avec d'autres utilisateurs :</strong> Lorsque vous utilisez notre Service, certaines de vos
                informations sont visibles par d'autres utilisateurs, notamment votre nom, votre photo de profil, votre
                évaluation, et les informations sur votre véhicule (pour les Propriétaires).
              </li>
              <li>
                <strong>Avec des prestataires de services :</strong> Nous partageons vos informations avec des
                prestataires de services tiers qui nous aident à fournir et à améliorer notre Service, tels que des
                services d'hébergement, de paiement, de vérification d'identité, de support client, etc.
              </li>
              <li>
                <strong>Avec des partenaires commerciaux :</strong> Nous pouvons partager vos informations avec des
                partenaires commerciaux pour vous offrir certains services, promotions ou offres.
              </li>
              <li>
                <strong>Pour des raisons légales :</strong> Nous pouvons partager vos informations si nous pensons de
                bonne foi que cela est nécessaire pour se conformer à une obligation légale, protéger nos droits ou ceux
                d'autrui, prévenir la fraude, ou assurer la sécurité de notre Service.
              </li>
              <li>
                <strong>Dans le cadre d'une transaction d'entreprise :</strong> Si nous sommes impliqués dans une
                fusion, acquisition, vente d'actifs ou restructuration, vos informations peuvent être transférées dans
                le cadre de cette transaction.
              </li>
              <li>
                <strong>Avec votre consentement :</strong> Nous pouvons partager vos informations dans d'autres
                situations avec votre consentement.
              </li>
            </ul>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">5. Conservation des données</h2>
            <p>
              Nous conservons vos informations aussi longtemps que nécessaire pour fournir notre Service et atteindre
              les objectifs décrits dans cette politique de confidentialité, sauf si une période de conservation plus
              longue est requise ou permise par la loi.
            </p>
            <p>
              Lorsque nous n'avons plus besoin d'utiliser vos informations et qu'il n'est pas nécessaire de les
              conserver pour se conformer à nos obligations légales ou réglementaires, nous les supprimons de nos
              systèmes ou les anonymisons.
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">6. Sécurité des données</h2>
            <p>
              Nous prenons des mesures raisonnables pour protéger vos informations contre la perte, le vol,
              l'utilisation abusive et l'accès non autorisé, la divulgation, l'altération et la destruction. Ces mesures
              comprennent le chiffrement des données, les contrôles d'accès, les pare-feu, et d'autres mesures de
              sécurité techniques et organisationnelles.
            </p>
            <p>
              Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est totalement sûre.
              Par conséquent, bien que nous nous efforcions de protéger vos informations personnelles, nous ne pouvons
              garantir leur sécurité absolue.
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">7. Transferts internationaux de données</h2>
            <p>
              Nous pouvons transférer, stocker et traiter vos informations dans des pays autres que votre pays de
              résidence. Les lois sur la protection des données dans ces pays peuvent différer de celles de votre pays.
            </p>
            <p>
              Si nous transférons vos informations en dehors de l'Espace économique européen (EEE), nous nous assurerons
              que ces transferts sont effectués conformément aux lois applicables sur la protection des données,
              notamment en mettant en place des garanties appropriées, telles que des clauses contractuelles types
              approuvées par la Commission européenne.
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">8. Vos droits</h2>
            <p>
              Selon votre lieu de résidence, vous pouvez avoir certains droits concernant vos informations personnelles,
              notamment :
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>Droit d'accès :</strong> Vous pouvez demander une copie des informations personnelles que nous
                détenons à votre sujet.
              </li>
              <li>
                <strong>Droit de rectification :</strong> Vous pouvez nous demander de corriger des informations
                inexactes ou incomplètes vous concernant.
              </li>
              <li>
                <strong>Droit à l'effacement :</strong> Dans certaines circonstances, vous pouvez nous demander de
                supprimer vos informations personnelles.
              </li>
              <li>
                <strong>Droit à la limitation du traitement :</strong> Dans certaines circonstances, vous pouvez nous
                demander de limiter le traitement de vos informations personnelles.
              </li>
              <li>
                <strong>Droit à la portabilité des données :</strong> Dans certaines circonstances, vous pouvez nous
                demander de transférer vos informations personnelles à un autre fournisseur de services.
              </li>
              <li>
                <strong>Droit d'opposition :</strong> Vous pouvez vous opposer au traitement de vos informations
                personnelles dans certaines circonstances, notamment à des fins de marketing direct.
              </li>
              <li>
                <strong>Droit de retirer votre consentement :</strong> Si nous traitons vos informations personnelles
                sur la base de votre consentement, vous pouvez retirer ce consentement à tout moment.
              </li>
            </ul>
            <p>
              Pour exercer ces droits, veuillez nous contacter en utilisant les coordonnées fournies ci-dessous. Nous
              répondrons à votre demande conformément aux lois applicables.
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">9. Comment nous contacter</h2>
            <p className="mb-4">
              Si vous avez des questions concernant cette politique de confidentialité ou souhaitez exercer vos droits,
              contactez notre Délégué à la Protection des Données :
            </p>
            <p>
              <strong>Email :</strong> dpo@carshare.ma
              <br />
              <strong>Téléphone :</strong> +212 522 12 34 56
              <br />
              <strong>Adresse :</strong> CarShare Maroc, 123 Boulevard Mohammed V, 20250 Casablanca, Morocco
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">10. Modifications de cette politique</h2>
            <p>
              Nous pouvons modifier cette politique de confidentialité de temps à autre. Si nous apportons des
              modifications importantes, nous vous en informerons par e-mail ou par un avis sur notre Service avant que
              les modifications ne prennent effet. Nous vous encourageons à consulter régulièrement cette politique pour
              rester informé de nos pratiques en matière de confidentialité.
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">11. Contact</h2>
            <p>
              Si vous avez des questions ou des préoccupations concernant cette politique de confidentialité ou nos
              pratiques en matière de confidentialité, veuillez nous contacter à l'adresse suivante :
            </p>
            <p className="mt-2">
              <strong>Email :</strong> privacy@carshare.com
              <br />
              <strong>Adresse :</strong> CarShare SAS, 123 Avenue de la République, 75011 Paris, France
              <br />
              <strong>Téléphone :</strong> +33 1 23 45 67 89
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
