import { Separator } from "@/components/ui/separator"

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Mentions légales</h1>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[700px] mx-auto">
              Dernière mise à jour : 10 avril 2023
            </p>
          </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-lg border max-w-4xl mx-auto">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold mb-4">1. Informations légales</h2>
            <p>Le site web CarShare et les services associés sont édités par :</p>
            <p className="mt-2">
              <strong>Raison sociale :</strong> CarShare Maroc, Société Anonyme (S.A.) au capital de 500 000 dirhams
              <br />
              <strong>Siège social :</strong> 123 Boulevard Mohammed V, 20250 Casablanca, Morocco
              <br />
              <strong>RCS :</strong> Casablanca 123456
              <br />
              <strong>SIRET :</strong> 123 456 789 00012
              <br />
              <strong>TVA intracommunautaire :</strong> MA12345678901
              <br />
              <strong>Directeur de la publication :</strong> Mohammed El Alami
              <br />
              <strong>Téléphone :</strong> +212 522 12 34 56
              <br />
              <strong>Email :</strong> contact@carshare.ma
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">Directeur de la publication</h3>
            <p>
              <strong>Nom :</strong> Mohammed El Alami
              <br />
              <strong>Fonction :</strong> Président de CarShare Maroc
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">2. Hébergement</h2>
            <p>Le site web CarShare est hébergé par :</p>
            <p className="mt-2">
              <strong>Raison sociale :</strong> Amazon Web Services EMEA SARL
              <br />
              <strong>Siège social :</strong> 38 Avenue John F. Kennedy, L-1855 Luxembourg
              <br />
              <strong>Téléphone :</strong> +352 2789 0057
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">3. Propriété intellectuelle</h2>
            <p>
              L'ensemble des éléments constituant le site CarShare (textes, graphismes, logiciels, photographies,
              images, vidéos, sons, plans, logos, marques, etc.) ainsi que le site lui-même, sont la propriété exclusive
              de CarShare Maroc ou de tiers ayant autorisé CarShare Maroc à les utiliser.
            </p>
            <p className="mt-2">
              Ces éléments sont protégés par les lois marocaines et internationales relatives à la propriété
              intellectuelle. Toute reproduction, représentation, utilisation ou adaptation, sous quelque forme que ce
              soit, de tout ou partie de ces éléments, sans l'accord préalable et écrit de CarShare Maroc, est strictement
              interdite et constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la
              propriété intellectuelle.
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">4. Loi applicable et juridiction compétente</h2>
            <p>
              Les présentes mentions légales sont régies par le droit marocain. En cas de litige, les tribunaux marocains
              seront seuls compétents.
            </p>
            <p className="mt-2">
              Pour toute question relative à ces mentions légales ou si vous souhaitez nous faire part d'une violation
              de droits, veuillez nous contacter à l'adresse : legal@carshare.ma
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">5. Protection des données personnelles</h2>
            <p>
              Conformément à la loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés,
              modifiée par le Règlement européen n°2016/679 du 27 avril 2016 relatif à la protection des données
              personnelles (RGPD), vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation du
              traitement, de portabilité des données et d'opposition au traitement de vos données personnelles.
            </p>
            <p className="mt-2">
              Pour exercer ces droits ou pour toute question sur le traitement de vos données, vous pouvez nous
              contacter :
            </p>
            <p className="mt-2">
              <strong>Par email :</strong> privacy@carshare.ma
              <br />
              <strong>Par courrier :</strong> CarShare Maroc, Service Protection des Données, 123 Boulevard Mohammed V,
              20250 Casablanca, Morocco
            </p>
            <p className="mt-2">
              Pour plus d'informations sur la manière dont nous traitons vos données personnelles, veuillez consulter
              notre{" "}
              <a href="/privacy" className="text-red-600 hover:underline">
                Politique de confidentialité
              </a>
              .
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">6. Cookies</h2>
            <p>
              Notre site utilise des cookies pour améliorer votre expérience utilisateur et collecter des statistiques
              de visite.
            </p>
            <p className="mt-2">
              Pour plus d'informations sur l'utilisation des cookies, veuillez consulter notre{" "}
              <a href="/cookies" className="text-red-600 hover:underline">
                Politique de cookies
              </a>
              .
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">7. Conditions générales d'utilisation</h2>
            <p>
              L'utilisation de notre site et de nos services est soumise à l'acceptation et au respect de nos{" "}
              <a href="/terms" className="text-red-600 hover:underline">
                Conditions d'utilisation
              </a>
              .
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">8. Médiation de la consommation</h2>
            <p>
              Conformément aux articles L.611-1 à L.616-3 et R.612-1 à R.616-2 du Code de la consommation, notre société
              a mis en place un dispositif de médiation de la consommation. L'entité de médiation retenue est : CNPM -
              MÉDIATION DE LA CONSOMMATION.
            </p>
            <p className="mt-2">
              En cas de litige, vous pouvez déposer votre réclamation sur son site :
              <a
                href="https://cnpm-mediation-consommation.eu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:underline"
              >
                https://cnpm-mediation-consommation.eu
              </a>
              ou par voie postale en écrivant à CNPM - MÉDIATION - CONSOMMATION - 27 avenue de la Libération - 42400
              Saint-Chamond.
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">9. Accessibilité</h2>
            <p>
              Nous nous efforçons de rendre notre site web accessible à tous, y compris aux personnes en situation de
              handicap. Si vous rencontrez des difficultés d'accès ou d'utilisation, n'hésitez pas à nous contacter à
              l'adresse : accessibility@carshare.ma
            </p>

            <Separator className="my-6" />

            <h2 className="text-2xl font-bold mb-4">10. Contact</h2>
            <p className="mb-4">
              Pour toute question relative aux présentes mentions légales, vous pouvez nous écrire à :
            </p>
            <p>
              CarShare Maroc<br />
              Service Juridique<br />
              123 Boulevard Mohammed V<br />
              20250 Casablanca, Morocco
            </p>
            <p className="mt-4">
              Ou par email : legal@carshare.ma
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
