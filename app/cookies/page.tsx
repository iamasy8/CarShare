import { Separator } from "@/components/ui/separator"

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Politique de cookies</h1>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[700px] mx-auto">
              Dernière mise à jour : 10 avril 2023
            </p>
          </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-lg border max-w-4xl mx-auto">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p>
              Cette politique de cookies explique comment CarShare utilise les cookies et les technologies similaires
              sur notre site web, nos applications mobiles et nos services (collectivement, le "Service"). Elle explique
              ce que sont ces technologies, pourquoi nous les utilisons, et vos droits pour contrôler notre utilisation
              de celles-ci.
            </p>
            <p>
              En utilisant notre Service, vous consentez à notre utilisation des cookies conformément à cette politique
              de cookies. Si vous n'acceptez pas notre utilisation des cookies, veuillez paramétrer votre navigateur en
              conséquence ou ne pas utiliser notre Service.
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">2. Qu'est-ce qu'un cookie ?</h2>
            <p>
              Les cookies sont de petits fichiers texte qui sont stockés sur votre ordinateur ou appareil mobile lorsque
              vous visitez un site web. Ils sont largement utilisés pour faire fonctionner les sites web ou les rendre
              plus efficaces, ainsi que pour fournir des informations aux propriétaires du site.
            </p>
            <p>
              Les cookies nous permettent de vous reconnaître, de mémoriser vos préférences, et de vous offrir une
              expérience personnalisée basée sur vos interactions antérieures avec notre Service. Ils peuvent également
              nous aider à comprendre comment les visiteurs interagissent avec notre Service, ce qui nous permet de
              l'améliorer continuellement.
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">3. Types de cookies que nous utilisons</h2>
            <h3 className="text-xl font-semibold mt-4 mb-2">3.1 Cookies nécessaires</h3>
            <p>
              Ces cookies sont essentiels au fonctionnement de notre Service. Ils vous permettent de naviguer et
              d'utiliser les fonctionnalités de base, comme l'accès aux zones sécurisées. Sans ces cookies, notre
              Service ne peut pas fonctionner correctement.
            </p>
            <p>Exemples :</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Cookies qui vous permettent de rester connecté à votre compte</li>
              <li>Cookies qui se souviennent des informations que vous avez entrées dans un formulaire</li>
              <li>Cookies qui permettent le fonctionnement du panier d'achat</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-2">3.2 Cookies de préférences</h3>
            <p>
              Ces cookies nous permettent de mémoriser vos préférences et vos paramètres, comme la langue, la région ou
              les préférences d'affichage, afin de vous offrir une expérience plus personnalisée.
            </p>
            <p>Exemples :</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Cookies qui mémorisent votre langue préférée</li>
              <li>Cookies qui mémorisent la taille de police ou d'autres préférences d'affichage</li>
              <li>Cookies qui mémorisent si vous avez déjà répondu à un sondage</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-2">3.3 Cookies statistiques</h3>
            <p>
              Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre Service en collectant
              et en rapportant des informations de manière anonyme. Ils nous permettent de savoir quelles pages sont les
              plus populaires, quels liens sont cliqués, et d'identifier d'éventuels problèmes techniques. Cela nous
              aide à améliorer constamment notre Service.
            </p>
            <p>Exemples :</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Cookies de Google Analytics pour suivre les statistiques de trafic</li>
              <li>Cookies qui mesurent le temps passé sur chaque page</li>
              <li>
                Cookies qui enregistrent des informations sur la manière dont vous avez accédé à notre Service (via un
                moteur de recherche, un lien direct, etc.)
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-2">3.4 Cookies marketing</h3>
            <p>
              Ces cookies sont utilisés pour suivre les visiteurs sur les sites web. Leur objectif est d'afficher des
              publicités qui sont pertinentes et engageantes pour l'utilisateur individuel, et donc plus précieuses pour
              les éditeurs et les annonceurs tiers.
            </p>
            <p>Exemples :</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Cookies utilisés par les réseaux publicitaires comme Google AdSense</li>
              <li>Cookies qui permettent de mesurer l'efficacité des campagnes publicitaires</li>
              <li>Cookies qui limitent le nombre de fois que vous voyez une publicité</li>
            </ul>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">4. Cookies tiers</h2>
            <p>
              Certains cookies sont placés par des tiers sur notre Service. Ces tiers peuvent inclure des fournisseurs
              d'analyses, des réseaux publicitaires, des plateformes de médias sociaux, et d'autres partenaires de
              services.
            </p>
            <p>
              Ces tiers peuvent utiliser des cookies, des balises web, et d'autres technologies de suivi pour collecter
              des informations sur votre utilisation de notre Service et d'autres sites web. Ces informations peuvent
              être utilisées pour, entre autres, analyser et suivre les données, déterminer la popularité de certains
              contenus, et mieux comprendre votre activité en ligne.
            </p>
            <p>
              Nous n'avons pas accès ni contrôle sur les cookies ou autres technologies de suivi que ces tiers peuvent
              utiliser. Nous vous suggérons de consulter les politiques de confidentialité et de cookies de ces tiers
              directement pour plus d'informations sur leurs pratiques et sur la manière de refuser leurs cookies.
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">5. Comment gérer les cookies</h2>
            <p>
              La plupart des navigateurs vous permettent de contrôler les cookies via leurs paramètres. Ces paramètres
              se trouvent généralement dans le menu "options" ou "préférences" de votre navigateur. Vous pouvez
              également consulter l'aide de votre navigateur pour plus d'informations.
            </p>
            <p>
              Voici quelques liens vers les instructions pour gérer les cookies dans les navigateurs les plus courants :
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline"
                >
                  Safari
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline"
                >
                  Microsoft Edge
                </a>
              </li>
            </ul>
            <p className="mt-4">
              Veuillez noter que si vous choisissez de bloquer les cookies, vous pourriez ne pas être en mesure
              d'accéder à certaines fonctionnalités de notre Service, et certaines fonctionnalités pourraient ne pas
              fonctionner correctement.
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">6. Modifications de cette politique</h2>
            <p>
              Nous pouvons mettre à jour cette politique de cookies de temps à autre pour refléter, par exemple, des
              changements dans les cookies que nous utilisons ou pour d'autres raisons opérationnelles, légales ou
              réglementaires. Nous vous encourageons donc à consulter régulièrement cette politique pour rester informé
              de notre utilisation des cookies et des technologies connexes.
            </p>
            <p>La date en haut de cette politique indique quand elle a été mise à jour pour la dernière fois.</p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">7. Contact</h2>
            <p>
              Si vous avez des questions concernant notre utilisation des cookies ou d'autres technologies, veuillez
              nous contacter à l'adresse suivante :
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
