import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Car, MessageSquare, Shield, Star } from "lucide-react"
import FeaturedCars from "@/components/featured-cars"
import HowItWorks from "@/components/how-it-works"
import { cn } from "@/lib/utils"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-red-600 to-red-800 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Louez une voiture directement auprès des propriétaires
                </h1>
                <p className="max-w-[600px] text-white/80 md:text-xl">
                  CarShare vous connecte avec des propriétaires de voitures près de chez vous. Trouvez le véhicule idéal
                  pour vos besoins sans intermédiaire.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                  <Link href="/search">
                    Trouver une voiture
                    <Search className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-red-600 hover:bg-white/20 hover:text-white">
                  <Link href="/register?type=owner">
                    Publier ma voiture
                    <Car className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative lg:block">
              <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-black/20 z-10 rounded-lg" />
                <img
                  src="/placeholder.svg?height=500&width=800"
                  alt="Une voiture moderne garée dans un environnement urbain"
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-background dark:bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Trouvez la voiture parfaite</h2>
              <p className="text-muted-foreground md:text-xl">Des milliers de voitures disponibles près de chez vous</p>
            </div>
            <div className="mx-auto w-full max-w-3xl">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="relative">
                  <select
                    className="w-full h-12 pl-3 pr-10 text-base placeholder-muted-foreground border border-input bg-background rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Marque
                    </option>
                    <option value="audi">Audi</option>
                    <option value="bmw">BMW</option>
                    <option value="mercedes">Mercedes</option>
                    <option value="renault">Renault</option>
                    <option value="peugeot">Peugeot</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="relative">
                  <select
                    className="w-full h-12 pl-3 pr-10 text-base placeholder-muted-foreground border border-input bg-background rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Type
                    </option>
                    <option value="citadine">Citadine</option>
                    <option value="suv">SUV</option>
                    <option value="berline">Berline</option>
                    <option value="sport">Sport</option>
                    <option value="utilitaire">Utilitaire</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <Button className="h-12 bg-red-600 hover:bg-red-700">
                  <Search className="mr-2 h-4 w-4" />
                  Rechercher
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <FeaturedCars />

      {/* How It Works */}
      <HowItWorks />

      {/* Benefits Section */}
      <section className="py-12 bg-muted dark:bg-muted">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Pourquoi choisir CarShare ?</h2>
              <p className="text-muted-foreground md:text-xl mx-auto max-w-[700px]">
                Notre plateforme offre de nombreux avantages pour les propriétaires et les locataires
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center gap-2 p-6 bg-card dark:bg-card rounded-lg shadow-sm">
                <div className={cn("p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400")}>
                  <Car className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Large choix de véhicules</h3>
                <p className="text-muted-foreground text-center">
                  Des milliers de voitures disponibles, du modèle économique au véhicule de luxe.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 p-6 bg-card dark:bg-card rounded-lg shadow-sm">
                <div className={cn("p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400")}>
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Communication directe</h3>
                <p className="text-muted-foreground text-center">
                  Échangez directement avec les propriétaires pour organiser votre location.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 p-6 bg-card dark:bg-card rounded-lg shadow-sm">
                <div className={cn("p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400")}>
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Sécurité et confiance</h3>
                <p className="text-muted-foreground text-center">
                  Toutes les annonces sont vérifiées par notre équipe pour garantir leur authenticité.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-red-600 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Vous avez une voiture à louer ?</h2>
              <p className="text-white/80 md:text-xl">
                Rejoignez notre communauté de propriétaires et commencez à générer des revenus avec votre véhicule.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                <Link href="/register?type=owner">Devenir propriétaire</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-background dark:bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ce que disent nos utilisateurs</h2>
              <p className="text-muted-foreground md:text-xl mx-auto max-w-[700px]">
                Découvrez les expériences de notre communauté
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col gap-4 p-6 bg-card dark:bg-card rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-muted-foreground italic">
                  "J'ai pu louer une voiture rapidement pour un week-end. Le propriétaire était très sympathique et le
                  processus était simple."
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="rounded-full bg-muted w-10 h-10 overflow-hidden">
                    <img
                      src="/placeholder.svg?height=40&width=40"
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Sophie D.</p>
                    <p className="text-sm text-muted-foreground">Locataire</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-6 bg-card dark:bg-card rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-muted-foreground italic">
                  "En tant que propriétaire, je peux facilement gérer mes annonces et communiquer avec les locataires.
                  Un excellent moyen de rentabiliser ma voiture."
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="rounded-full bg-muted w-10 h-10 overflow-hidden">
                    <img
                      src="/placeholder.svg?height=40&width=40"
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Thomas L.</p>
                    <p className="text-sm text-muted-foreground">Propriétaire</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-6 bg-card dark:bg-card rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <Star className="h-5 w-5 text-muted dark:text-muted" />
                </div>
                <p className="text-muted-foreground italic">
                  "J'utilise régulièrement CarShare pour mes déplacements professionnels. C'est plus économique et plus
                  flexible qu'une agence traditionnelle."
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="rounded-full bg-muted w-10 h-10 overflow-hidden">
                    <img
                      src="/placeholder.svg?height=40&width=40"
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Marc B.</p>
                    <p className="text-sm text-muted-foreground">Locataire</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
