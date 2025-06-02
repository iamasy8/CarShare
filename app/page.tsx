import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Car, MessageSquare, Shield, Star } from "lucide-react"
import FeaturedCars from "@/components/featured-cars"
import HowItWorks from "@/components/how-it-works"
import { Testimonials } from "@/components/testimonials"
import { cn } from "@/lib/utils"
import HeroCarousel from "@/components/hero-carousel"
import AnimatedText from "@/components/animated-text"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-red-600 to-red-800 text-white overflow-hidden">
        {/* Background gradient overlay for the image */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/90 to-red-800/70 z-0"></div>
        
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <AnimatedText delay={100}>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Louez une voiture directement auprès des propriétaires
                  </h1>
                </AnimatedText>
                <AnimatedText delay={250}>
                  <p className="max-w-[600px] text-white/80 md:text-xl">
                    CarShare vous connecte avec des propriétaires de voitures près de chez vous. Trouvez le véhicule idéal
                    pour vos besoins sans intermédiaire.
                  </p>
                </AnimatedText>
              </div>
              <AnimatedText delay={400}>
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
              </AnimatedText>
            </div>
            <div className="relative lg:block">
              <HeroCarousel />
            </div>
          </div>
        </div>
        
        {/* Add a decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-r from-red-900/30 to-red-800/20 backdrop-blur-sm z-0"></div>
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
              <form 
                action="/search" 
                method="get"
                className="grid gap-4 sm:grid-cols-3"
              >
                <div className="relative">
                  <select
                    name="makes"
                    id="makes"
                    className="w-full h-12 pl-3 pr-10 text-base placeholder-muted-foreground border border-input bg-background rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    defaultValue=""
                  >
                    <option value="">Toutes les marques</option>
                    <option value="BMW">BMW</option>
                    <option value="Audi">Audi</option>
                    <option value="Mercedes">Mercedes</option>
                    <option value="Tesla">Tesla</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Honda">Honda</option>
                    <option value="Ford">Ford</option>
                    <option value="Chevrolet">Chevrolet</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className="relative">
                  <select
                    name="types"
                    id="types"
                    className="w-full h-12 pl-3 pr-10 text-base placeholder-muted-foreground border border-input bg-background rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    defaultValue=""
                  >
                    <option value="">Tous les types</option>
                    <option value="SUV">SUV</option>
                    <option value="Berline">Berline</option>
                    <option value="Coupe">Coupé</option>
                    <option value="Compacte">Compacte</option>
                    <option value="Cabriolet">Cabriolet</option>
                    <option value="Break">Break</option>
                    <option value="Monospace">Monospace</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <Button type="submit" className="h-12 bg-red-600 hover:bg-red-700">
                  <Search className="mr-2 h-4 w-4" />
                  Rechercher
                </Button>
              </form>
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
      <Testimonials />
    </div>
  )
}
