import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Award, Clock, Globe, Shield, ThumbsUp, Users } from "lucide-react"

/**
 * NOTE: Team Images Implementation
 * 
 * The team section uses images that should be placed in /public/team/:
 * - maryam.jpg: Woman with hijab holding laptop (first image from conversation)
 * - thomas.jpg: Man in suit with glasses (second image)
 * - julie.jpg: Woman in brown blazer (third image)
 * - alexandre.jpg: Man in casual outfit with glasses (fourth image)
 * 
 * Currently using placeholder images. Replace with actual images from conversation.
 * See /public/team/README.md for more details.
 */

export const metadata: Metadata = {
  title: "À propos - CarShare",
  description: "Découvrez l'histoire et la mission de CarShare",
}

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Hero Section */}
      <div className="text-center mb-20 md:mb-24">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">À propos de CarShare</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Nous révolutionnons la mobilité urbaine en permettant à chacun de louer une voiture facilement, ou de
          rentabiliser son véhicule lorsqu'il ne l'utilise pas.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center mb-24">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold mb-6">Notre mission</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            Chez CarShare, nous croyons qu'il est temps de repenser notre rapport à l'automobile. Les voitures
            particulières restent inutilisées 95% du temps, alors que de nombreuses personnes ont besoin d'un véhicule
            ponctuellement.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            Notre mission est de créer une communauté de partage qui optimise l'utilisation des ressources existantes,
            réduit l'empreinte carbone et crée du lien social, tout en offrant une solution économique pour tous.
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
            <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
              <Globe className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
              <span>Réduction de l'empreinte carbone</span>
            </div>
            <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
              <Users className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
              <span>Création de communauté</span>
            </div>
            <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
              <ThumbsUp className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
              <span>Économie collaborative</span>
            </div>
          </div>
        </div>
        <div className="relative h-80 md:h-96 rounded-xl overflow-hidden shadow-lg">
          <Image 
            src="/images/car-sharing-concept.jpg" 
            alt="Concept de partage de voitures CarShare"
            fill 
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Nos valeurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          <Card className="border-red-100 dark:border-red-900/30 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-8">
              <Shield className="h-12 w-12 text-red-600 mb-6" />
              <h3 className="text-xl font-bold mb-4">Confiance</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Nous bâtissons une plateforme où la confiance est au cœur de chaque interaction. Vérification des
                profils, assurance complète et système d'évaluation transparent.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-100 dark:border-red-900/30 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-8">
              <Clock className="h-12 w-12 text-red-600 mb-6" />
              <h3 className="text-xl font-bold mb-4">Simplicité</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Nous simplifions l'accès à la mobilité avec une interface intuitive et un processus de réservation
                fluide, pour que louer une voiture soit aussi simple que commander un repas.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-100 dark:border-red-900/30 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-8">
              <Award className="h-12 w-12 text-red-600 mb-6" />
              <h3 className="text-xl font-bold mb-4">Qualité</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Nous nous engageons à offrir une expérience de qualité supérieure, avec un support client réactif et des
                véhicules soigneusement vérifiés pour votre sécurité et votre confort.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-4">Notre équipe</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
          Une équipe passionnée qui travaille chaque jour pour améliorer votre expérience de mobilité.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {[
            { name: "Maryam Mennani", role: "CEO & Co-fondatrice", image: "/team/maryam.jpg" },
            { name: "Thomas Dubois", role: "CTO & Co-fondateur", image: "/team/thomas.jpg" },
            { name: "Julie Lefèvre", role: "Directrice Marketing", image: "/team/julie.jpg" },
            { name: "Alexandre Chen", role: "Responsable Produit", image: "/team/alexandre.jpg" },
          ].map((member, index) => (
            <div key={index} className="text-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-40 h-40 mx-auto rounded-full mb-6 overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={160}
                  height={160}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="font-bold text-lg mb-2">{member.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-10 md:p-12 mb-24 shadow-sm">
        <h2 className="text-3xl font-bold text-center mb-12">CarShare en chiffres</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 text-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <p className="text-4xl font-bold text-red-600 mb-3">15,000+</p>
            <p className="text-gray-600 dark:text-gray-300">Utilisateurs actifs</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <p className="text-4xl font-bold text-red-600 mb-3">5,000+</p>
            <p className="text-gray-600 dark:text-gray-300">Véhicules disponibles</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <p className="text-4xl font-bold text-red-600 mb-3">50+</p>
            <p className="text-gray-600 dark:text-gray-300">Villes couvertes</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <p className="text-4xl font-bold text-red-600 mb-3">98%</p>
            <p className="text-gray-600 dark:text-gray-300">Clients satisfaits</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center mb-10 bg-white dark:bg-gray-800 rounded-xl p-10 md:p-16 shadow-sm">
        <h2 className="text-3xl font-bold mb-6">Prêt à nous rejoindre ?</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Que vous souhaitiez louer une voiture ou proposer la vôtre, rejoignez notre communauté dès aujourd'hui.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-lg">
            <Link href="/register">
              S'inscrire maintenant <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950 text-lg"
          >
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
