"use client"

import Link from "next/link"
import { Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Mock data for featured cars
const featuredCars = [
  {
    id: 1,
    title: "Renault Clio",
    type: "Citadine",
    price: 35,
    location: "Casablanca, Morocco",
    rating: 4.8,
    reviews: 24,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
  },
  {
    id: 2,
    title: "Peugeot 3008",
    type: "SUV",
    price: 65,
    location: "Rabat, Morocco",
    rating: 4.6,
    reviews: 18,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
  },
  {
    id: 3,
    title: "BMW Série 3",
    type: "Berline",
    price: 85,
    location: "Marrakech, Morocco",
    rating: 4.9,
    reviews: 32,
    image: "/placeholder.svg?height=200&width=300",
    available: false,
  },
  {
    id: 4,
    title: "Volkswagen Golf",
    type: "Citadine",
    price: 45,
    location: "Tangier, Morocco",
    rating: 4.7,
    reviews: 15,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
  },
]

export default function FeaturedCars() {
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
            {featuredCars.map((car) => (
              <Link
                key={car.id}
                href={`/cars/${car.id}`}
                className="group relative flex flex-col overflow-hidden rounded-lg border hover:shadow-md transition-shadow bg-card"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={car.image || "/placeholder.svg"}
                    alt={car.title}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  />
                  <button
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 text-foreground"
                    onClick={(e) => {
                      e.preventDefault()
                      // Add to favorites logic here
                    }}
                  >
                    <Heart className="h-5 w-5" />
                  </button>
                  {!car.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge className="bg-red-600 text-white px-3 py-1.5 text-sm font-medium">Non disponible</Badge>
                    </div>
                  )}
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
                  <div className="mt-auto pt-4 flex items-center">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 text-sm font-medium">{car.rating}</span>
                    </div>
                    <span className="mx-1.5 text-muted-foreground text-sm">•</span>
                    <span className="text-sm text-muted-foreground">{car.reviews} avis</span>
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
