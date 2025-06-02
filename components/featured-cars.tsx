"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Car } from "@/lib/api"
import { carService } from "@/lib/api/cars/carService"
import { useRealApi, sanitizeImageUrl } from "@/lib/utils"
import FavoriteButton from "@/components/favorite-button"

export default function FeaturedCars() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      setLoading(true)
      try {
        if (useRealApi()) {
          // Use the real API
          const featuredCars = await carService.getFeaturedCars(4)
          setCars(featuredCars)
        } else {
          // Use mock data (fallback)
          setCars([
            {
              id: 1,
              title: "Renault Clio",
              make: "Renault",
              model: "Clio",
              year: 2022,
              type: "Citadine",
              price: 35,
              location: "Casablanca, Morocco",
              seats: 5,
              doors: 5,
              fuel: "essence",
              transmission: "manual",
              description: "Voiture idéale pour la ville",
              features: [],
              images: ["/placeholder.svg?height=200&width=300"],
              ownerId: 1,
              status: "approved",
              createdAt: new Date(),
              updatedAt: new Date()
            },
            // Add more mock cars if needed
          ])
        }
      } catch (err) {
        console.error("Error fetching featured cars:", err)
        setError("Failed to load featured cars")
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedCars()
  }, [])

  if (loading) {
    return (
      <section className="py-12 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tighter">Voitures à la une</h2>
                <p className="text-muted-foreground">Découvrez nos meilleures sélections</p>
              </div>
            </div>
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-red-600" />
              <span className="ml-2 text-gray-500">Chargement des voitures...</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tighter">Voitures à la une</h2>
              <p className="text-muted-foreground">Découvrez nos meilleures sélections</p>
            </div>
            <Button asChild variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10">
              <Link href="/search">Voir toutes les voitures</Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cars.map((car) => (
              <Link
                key={car.id}
                href={`/cars/${car.id}`}
                className="group relative flex flex-col overflow-hidden rounded-lg border hover:shadow-md transition-shadow bg-card"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={car.images && car.images.length > 0 ? sanitizeImageUrl(car.images[0]) : "/placeholder.svg"}
                    alt={car.title}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    onError={(e) => {
                      console.error(`Failed to load image: ${car.images?.[0]}`);
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                  <FavoriteButton carId={car.id} />
                </div>
                <div className="flex flex-col p-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{car.title}</h3>
                      <p className="text-sm text-muted-foreground">{car.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {car.price}€<span className="text-sm font-normal text-muted-foreground">/jour</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {car.location}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
