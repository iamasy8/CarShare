"use client"

import Link from "next/link"
import { Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import axios from "axios"

// Interface for car data structure
interface Car {
  id: number
  make: string
  model: string
  year: number
  price_per_day: number
  location: string
  description: string
  is_available: boolean
  images: string[]
  rating?: number
  reviews_count?: number
}

export default function FeaturedCars() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    
    // Add a delay before the initial fetch to ensure the backend is ready
    setTimeout(() => {
      const fetchCars = async () => {
        try {
          if (!mounted) return;
          setLoading(true);
          
          // Use axios instead of fetch for better cross-browser support
          const response = await axios.get('http://127.0.0.1:8000/api/cars', {
            // Add specific headers to help with CORS issues
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            signal: controller.signal
          });
          
          console.log('Featured cars API response:', response.data);
          
          // Handle the response data
          if (mounted) {
            if (response.data && response.data.success && Array.isArray(response.data.data)) {
              // Handle the new API response format
              setCars(response.data.data.slice(0, 4));
              setError(null);
            } else if (Array.isArray(response.data)) {
              // Handle legacy format
              setCars(response.data.slice(0, 4));
              setError(null);
            } else {
              setError("Unexpected data format received from API");
            }
            setLoading(false);
          }
        } catch (err) {
          console.error('Error fetching cars:', err);
          if (mounted) {
            setError("Failed to load cars. Please try again later.");
            setLoading(false);
          }
        }
      };
      
      fetchCars();
    }, 500); // Small delay before first fetch
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

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

          {error && (
            <div className="col-span-full p-8 text-center">
              <p className="text-red-600">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          )}

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="flex flex-col overflow-hidden rounded-lg border bg-card">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {cars.map((car) => (
                <Link
                  key={car.id}
                  href={`/cars/${car.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-lg border hover:shadow-md transition-shadow bg-card"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={car.images?.[0] || "/placeholder.svg"}
                      alt={`${car.make} ${car.model}`}
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
                    {!car.is_available && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge className="bg-red-600 text-white px-3 py-1.5 text-sm font-medium">Non disponible</Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col p-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{car.make} {car.model}</h3>
                        <p className="text-sm text-muted-foreground">{car.year}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {car.price_per_day}€<span className="text-sm font-normal text-muted-foreground">/jour</span>
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
                    {car.rating && (
                      <div className="mt-auto pt-4 flex items-center">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="ml-1 text-sm font-medium">{car.rating}</span>
                        </div>
                        {car.reviews_count && (
                          <>
                            <span className="mx-1.5 text-muted-foreground text-sm">•</span>
                            <span className="text-sm text-muted-foreground">{car.reviews_count} avis</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
              
              {cars.length === 0 && !loading && !error && (
                <div className="col-span-full p-8 text-center">
                  <p className="text-muted-foreground">Aucune voiture disponible actuellement.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
