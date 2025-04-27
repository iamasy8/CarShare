import Link from "next/link"
import { Car, Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400">
      <div className="container px-4 md:px-6 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 text-white mb-4">
              <Car className="h-6 w-6 text-red-500" />
              <span className="text-xl font-bold">CarShare</span>
            </Link>
            <p className="text-sm">
              CarShare est une plateforme innovante permettant aux propriétaires de voitures de publier des annonces
              pour louer leurs véhicules, et aux clients de consulter ces offres.
            </p>
            <div className="flex mt-4 space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search" className="text-sm hover:text-white">
                  Rechercher une voiture
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm hover:text-white">
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-white">
                  À propos de nous
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Propriétaires</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/register?type=owner" className="text-sm hover:text-white">
                  Devenir propriétaire
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm hover:text-white">
                  Tarifs et abonnements
                </Link>
              </li>
              <li>
                <Link href="/owner-guide" className="text-sm hover:text-white">
                  Guide du propriétaire
                </Link>
              </li>
              <li>
                <Link href="/faq-owners" className="text-sm hover:text-white">
                  FAQ propriétaires
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Légal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm hover:text-white">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm hover:text-white">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm hover:text-white">
                  Politique de cookies
                </Link>
              </li>
              <li>
                <Link href="/legal" className="text-sm hover:text-white">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} CarShare. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
