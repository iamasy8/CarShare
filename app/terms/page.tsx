import { Separator } from "@/components/ui/separator"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Conditions d'utilisation</h1>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[700px] mx-auto">
              Dernière mise à jour : 10 avril 2023
            </p>
          </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-lg border max-w-4xl mx-auto">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p>
              Bienvenue sur CarShare, la plateforme de mise en relation entre propriétaires de véhicules et locataires
              potentiels. Les présentes Conditions d'utilisation régissent votre accès et votre utilisation du site web
              CarShare, des applications mobiles et des services proposés (collectivement, le "Service").
            </p>
            <p>
              En accédant à notre Service ou en l'utilisant, vous acceptez d'être lié par ces Conditions. Si vous
              n'acceptez pas ces Conditions, vous ne devez pas accéder à notre Service ni l'utiliser.
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">2. Définitions</h2>
            <p>Dans les présentes Conditions, les termes suivants ont la signification indiquée ci-dessous :</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>"Nous", "notre" ou "nos"</strong> fait référence à CarShare.
              </li>
              <li>
                <strong>"Vous", "votre" ou "vos"</strong> fait référence à la personne physique ou morale qui accède à
                notre Service ou l'utilise.
              </li>
              <li>
                <strong>"Propriétaire"</strong> désigne un utilisateur qui propose un véhicule à la location sur notre
                Service.
              </li>
              <li>
                <strong>"Locataire"</strong> désigne un utilisateur qui loue ou souhaite louer un véhicule via notre
                Service.
              </li>
              <li>
                <strong>"Contenu"</strong> désigne toutes les informations, textes, images, vidéos, graphiques ou autres
                matériels que vous téléchargez, publiez, soumettez, transmettez ou affichez sur notre Service.
              </li>
            </ul>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">3. Conditions d'inscription et d'utilisation du Service</h2>
            <h3 className="text-xl font-semibold mt-4 mb-2">3.1 Inscription</h3>
            <p>
              Pour utiliser certaines fonctionnalités de notre Service, vous devez créer un compte. Lors de
              l'inscription, vous acceptez de fournir des informations exactes, à jour et complètes. Vous êtes
              responsable du maintien de la confidentialité de votre compte et de votre mot de passe, et acceptez
              d'assumer la responsabilité de toutes les activités qui se produisent sous votre compte.
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">3.2 Conditions d'âge</h3>
            <p>
              Vous devez être âgé d'au moins 18 ans pour créer un compte et utiliser notre Service. Si vous avez moins
              de 18 ans, vous ne pouvez pas utiliser notre Service.
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">3.3 Utilisation du Service</h3>
            <p>
              Vous acceptez d'utiliser notre Service uniquement à des fins légales et conformément aux présentes
              Conditions. Vous acceptez de ne pas utiliser notre Service :
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>D'une manière qui viole toute loi ou réglementation applicable.</li>
              <li>
                Pour exploiter, nuire ou tenter d'exploiter ou de nuire à des mineurs de quelque façon que ce soit.
              </li>
              <li>Pour transmettre tout matériel publicitaire non sollicité ou non autorisé.</li>
              <li>Pour usurper l'identité de toute personne ou entité.</li>
              <li>
                Pour interférer avec ou perturber notre Service ou les serveurs ou réseaux connectés à notre Service.
              </li>
              <li>Pour collecter ou stocker les données personnelles d'autres utilisateurs.</li>
            </ul>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">4. Conditions spécifiques aux Propriétaires</h2>
            <h3 className="text-xl font-semibold mt-4 mb-2">4.1 Création d'annonces</h3>
            <p>
              En tant que Propriétaire, vous pouvez créer des annonces pour vos véhicules sur notre Service. Vous
              acceptez que :
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Vous êtes légalement autorisé à proposer le véhicule à la location.</li>
              <li>Toutes les informations que vous fournissez sur votre véhicule sont exactes et complètes.</li>
              <li>
                Votre véhicule est en bon état de fonctionnement, sûr et conforme à toutes les exigences légales
                (assurance, contrôle technique, etc.).
              </li>
              <li>
                Vous maintiendrez votre véhicule en bon état pendant toute la durée de disponibilité sur notre Service.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-2">4.2 Tarification et disponibilité</h3>
            <p>
              Vous êtes libre de définir vos propres tarifs et disponibilités pour la location de votre véhicule. Vous
              acceptez de respecter les tarifs et disponibilités que vous avez définis, sauf accord contraire avec le
              Locataire.
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">4.3 Obligations envers les Locataires</h3>
            <p>En tant que Propriétaire, vous acceptez de :</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Fournir le véhicule dans l'état décrit dans l'annonce.</li>
              <li>Respecter les horaires convenus pour la remise et la restitution du véhicule.</li>
              <li>Effectuer un état des lieux du véhicule avec le Locataire au début et à la fin de la location.</li>
              <li>
                Informer le Locataire de toute particularité ou condition spécifique liée à l'utilisation du véhicule.
              </li>
              <li>Traiter les Locataires avec respect et professionnalisme.</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-2">4.4 Abonnements</h3>
            <p>
              Pour proposer des véhicules à la location, vous devez souscrire à l'un de nos abonnements. Les détails et
              tarifs des abonnements sont disponibles sur notre page "Tarifs et abonnements". Vous acceptez de payer les
              frais d'abonnement conformément aux conditions de paiement.
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">5. Conditions spécifiques aux Locataires</h2>
            <h3 className="text-xl font-semibold mt-4 mb-2">5.1 Réservation de véhicules</h3>
            <p>En tant que Locataire, vous pouvez réserver des véhicules via notre Service. Vous acceptez que :</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                Vous possédez un permis de conduire valide et êtes légalement autorisé à conduire le véhicule que vous
                souhaitez louer.
              </li>
              <li>Vous utiliserez le véhicule conformément à toutes les lois et réglementations applicables.</li>
              <li>
                Vous respecterez les conditions spécifiques définies par le Propriétaire (kilométrage, utilisation,
                etc.).
              </li>
              <li>Vous restituerez le véhicule dans l'état où vous l'avez reçu, à l'heure et au lieu convenus.</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-2">5.2 Dépôt de garantie et frais supplémentaires</h3>
            <p>
              Lors de la réservation, un dépôt de garantie peut être demandé. Ce dépôt peut être utilisé pour couvrir
              les dommages éventuels au véhicule, le carburant manquant, le dépassement de kilométrage ou d'autres frais
              supplémentaires convenus avec le Propriétaire.
            </p>

            <h3 className="text-xl font-semibold mt-4 mb-2">5.3 Responsabilité en cas de dommage ou d'accident</h3>
            <p>
              En tant que Locataire, vous êtes responsable du véhicule pendant toute la durée de la location. En cas de
              dommage ou d'accident, vous acceptez de :
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Informer immédiatement le Propriétaire et, si nécessaire, les autorités compétentes.</li>
              <li>Remplir un constat amiable en cas d'accident.</li>
              <li>Coopérer pleinement avec le Propriétaire, CarShare et les compagnies d'assurance concernées.</li>
              <li>
                Assumer la responsabilité financière des dommages conformément aux conditions convenues et aux polices
                d'assurance applicables.
              </li>
            </ul>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">6. Contenu</h2>
            <p>
              Vous êtes responsable de tout Contenu que vous soumettez, publiez ou affichez sur notre Service. Vous
              accordez à CarShare une licence mondiale, non exclusive, libre de redevance pour utiliser, copier,
              modifier, distribuer, publier et traiter le Contenu que vous fournissez via notre Service.
            </p>
            <p>Vous déclarez et garantissez que :</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                Vous possédez ou avez le droit d'utiliser et de nous autoriser à utiliser tout le Contenu que vous
                soumettez.
              </li>
              <li>
                Le Contenu ne viole pas et ne violera pas les droits de tiers, y compris les droits de propriété
                intellectuelle et les droits à la vie privée.
              </li>
            </ul>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">7. Limitation de responsabilité</h2>
            <p>
              CarShare agit uniquement en tant que plateforme de mise en relation entre Propriétaires et Locataires.
              Nous ne sommes pas partie aux accords conclus entre les utilisateurs et ne sommes pas responsables des
              actions ou omissions des utilisateurs.
            </p>
            <p>
              Dans toute la mesure permise par la loi applicable, CarShare, ses dirigeants, administrateurs, employés,
              agents et partenaires ne seront pas responsables des dommages indirects, accessoires, spéciaux,
              consécutifs ou punitifs, y compris, mais sans s'y limiter, la perte de profits, de données, d'utilisation,
              de clientèle ou autres pertes intangibles.
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">8. Indemnisation</h2>
            <p>
              Vous acceptez de défendre, d'indemniser et de tenir CarShare, ses dirigeants, administrateurs, employés et
              agents, indemnes de toute réclamation, responsabilité, dommage, perte et dépense, y compris, sans
              limitation, les frais juridiques raisonnables, découlant de ou liés à :
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Votre violation de ces Conditions.</li>
              <li>Votre Contenu.</li>
              <li>Votre utilisation de notre Service.</li>
              <li>Votre interaction avec d'autres utilisateurs.</li>
            </ul>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">9. Modification des Conditions</h2>
            <p>
              Nous nous réservons le droit de modifier ces Conditions à tout moment. Toute modification sera effective
              dès sa publication sur notre Service. Il est de votre responsabilité de consulter régulièrement ces
              Conditions. Votre utilisation continue de notre Service après la publication des modifications constitue
              votre acceptation de ces modifications.
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">10. Résiliation</h2>
            <p>
              Nous nous réservons le droit de suspendre ou de résilier votre accès à notre Service à tout moment, pour
              quelque raison que ce soit, sans préavis ni responsabilité.
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">11. Droit applicable et juridiction compétente</h2>
            <p>
              Ces Conditions sont régies et interprétées conformément aux lois françaises. Tout litige découlant de ces
              Conditions sera soumis à la compétence exclusive des tribunaux français.
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">12. Contact</h2>
            <p>
              Si vous avez des questions concernant ces Conditions, veuillez nous contacter à l'adresse suivante :
              contact@carshare.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
