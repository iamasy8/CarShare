import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Award, Clock, Globe, Shield, ThumbsUp, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "À propos - CarShare",
  description: "Découvrez l'histoire et la mission de CarShare",
}

export default function AboutPage() {
  return (
    <div className="container py-10">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">À propos de CarShare</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
          Nous révolutionnons la mobilité urbaine en permettant à chacun de louer une voiture facilement, ou de
          rentabiliser son véhicule lorsqu'il ne l'utilise pas.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-3xl font-bold mb-4">Notre mission</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Chez CarShare, nous croyons qu'il est temps de repenser notre rapport à l'automobile. Les voitures
            particulières restent inutilisées 95% du temps, alors que de nombreuses personnes ont besoin d'un véhicule
            ponctuellement.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Notre mission est de créer une communauté de partage qui optimise l'utilisation des ressources existantes,
            réduit l'empreinte carbone et crée du lien social, tout en offrant une solution économique pour tous.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-red-600 mr-2" />
              <span>Réduction de l'empreinte carbone</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-red-600 mr-2" />
              <span>Création de communauté</span>
            </div>
            <div className="flex items-center">
              <ThumbsUp className="h-5 w-5 text-red-600 mr-2" />
              <span>Économie collaborative</span>
            </div>
          </div>
        </div>
        <div className="relative h-80 rounded-lg overflow-hidden">
          <Image src="/placeholder.svg?height=600&width=800" alt="Notre mission" fill className="object-cover" />
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Nos valeurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-red-100 dark:border-red-900/30">
            <CardContent className="pt-6">
              <Shield className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Confiance</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nous bâtissons une plateforme où la confiance est au cœur de chaque interaction. Vérification des
                profils, assurance complète et système d'évaluation transparent.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-100 dark:border-red-900/30">
            <CardContent className="pt-6">
              <Clock className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Simplicité</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nous simplifions l'accès à la mobilité avec une interface intuitive et un processus de réservation
                fluide, pour que louer une voiture soit aussi simple que commander un repas.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-100 dark:border-red-900/30">
            <CardContent className="pt-6">
              <Award className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Qualité</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nous nous engageons à offrir une expérience de qualité supérieure, avec un support client réactif et des
                véhicules soigneusement vérifiés pour votre sécurité et votre confort.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-4">Notre équipe</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 max-w-3xl mx-auto mb-12">
          Une équipe passionnée qui travaille chaque jour pour améliorer votre expérience de mobilité.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { name: "Sophie Martin", role: "CEO & Co-fondatrice" },
            { name: "Thomas Dubois", role: "CTO & Co-fondateur" },
            { name: "Julie Lefèvre", role: "Directrice Marketing" },
            { name: "Alexandre Chen", role: "Responsable Produit" },
          ].map((member, index) => (
            <div key={index} className="text-center">
              <div className="w-40 h-40 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
                <Image
                  src={`/placeholder.svg?height=160&width=160&text=${member.name.charAt(0)}`}
                  alt={member.name}
                  width={160}
                  height={160}
                  className="object-cover"
                />
              </div>
              <h3 className="font-bold text-lg">{member.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-8 mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">CarShare en chiffres</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-red-600 mb-2">15,000+</p>
            <p className="text-gray-600 dark:text-gray-300">Utilisateurs actifs</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-red-600 mb-2">5,000+</p>
            <p className="text-gray-600 dark:text-gray-300">Véhicules disponibles</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-red-600 mb-2">50+</p>
            <p className="text-gray-600 dark:text-gray-300">Villes couvertes</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-red-600 mb-2">98%</p>
            <p className="text-gray-600 dark:text-gray-300">Clients satisfaits</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Prêt à nous rejoindre ?</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          Que vous souhaitiez louer une voiture ou proposer la vôtre, rejoignez notre communauté dès aujourd'hui.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/register">
              S'inscrire maintenant <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
          >
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
