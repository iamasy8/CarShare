"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Heart, Search, Filter, Loader2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Car, carService } from "@/lib/api"
import { carHelpers, handleApiError } from "@/lib/api-helpers"
import { useSearchParams, useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Type for filter state
interface FilterState {
  priceRange: [number, number];
  types: string[];
  makes: string[];
  features: string[];
  availableOnly: boolean;
  sortBy: string;
  searchTerm: string;
  page: number;
}

// Available car types
const carTypes = ["Citadine", "Berline", "SUV", "Compacte", "Utilitaire", "Sport"];

// Available car makes
const carMakes = ["Renault", "Peugeot", "Citroën", "BMW", "Audi", "Mercedes", "Volkswagen", "Toyota", "Ford"];

// Available features
const carFeatures = ["Climatisation", "GPS", "Bluetooth", "Caméra de recul", "Sièges cuir"];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [
      parseInt(searchParams.get("minPrice") || "0"),
      parseInt(searchParams.get("maxPrice") || "200")
    ],
    types: searchParams.get("types")?.split(",") || [],
    makes: searchParams.get("makes")?.split(",") || [],
    features: searchParams.get("features")?.split(",") || [],
    availableOnly: searchParams.get("availableOnly") === "true",
    sortBy: searchParams.get("sortBy") || "price-asc",
    searchTerm: searchParams.get("q") || "",
    page: parseInt(searchParams.get("page") || "1")
  });

  // Load cars with filters
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      setError("");

      try {
        // Convert filters to API query params
        const queryParams: Record<string, any> = {
          minPrice: filters.priceRange[0],
          maxPrice: filters.priceRange[1],
          page: filters.page,
          sort: filters.sortBy
        };

        // Add other filters only if they have values
        if (filters.types.length > 0) queryParams.types = filters.types.join(",");
        if (filters.makes.length > 0) queryParams.makes = filters.makes.join(",");
        if (filters.features.length > 0) queryParams.features = filters.features.join(",");
        if (filters.availableOnly) queryParams.available = true;
        if (filters.searchTerm) queryParams.search = filters.searchTerm;

        // In development mode, we'll use mock data
        if (process.env.NODE_ENV === "development") {
          // Mock filtering logic for development
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
          
          // Mock cars data - in production this would come from the API
          const mockCars = [
  {
    id: 1,
    title: "Renault Clio",
    type: "Citadine",
              make: "Renault",
              model: "Clio",
    price: 35,
              location: "Casablanca, Morocco",
    features: ["Climatisation", "5 portes", "Bluetooth", "GPS"],
    year: 2020,
              status: "approved" as const,
              seats: 5,
              doors: 5,
              fuel: "gasoline",
              transmission: "automatic",
              description: "Petite citadine idéale pour la ville",
              images: ["/placeholder.svg?height=200&width=300"],
              ownerId: 1,
              createdAt: new Date(),
              updatedAt: new Date()
  },
  {
    id: 2,
    title: "Peugeot 3008",
    type: "SUV",
              make: "Peugeot",
              model: "3008",
    price: 65,
              location: "Rabat, Morocco",
    features: ["Climatisation", "5 portes", "Caméra de recul", "GPS"],
    year: 2021,
              status: "approved" as const,
              seats: 5,
              doors: 5,
              fuel: "diesel",
              transmission: "automatic",
              description: "SUV familial spacieux et confortable",
              images: ["/placeholder.svg?height=200&width=300"],
              ownerId: 2,
              createdAt: new Date(),
              updatedAt: new Date()
  },
  {
    id: 3,
    title: "BMW Série 3",
    type: "Berline",
              make: "BMW",
              model: "Série 3",
    price: 85,
              location: "Marrakech, Morocco",
    features: ["Climatisation", "4 portes", "Sièges cuir", "GPS"],
    year: 2019,
              status: "approved" as const,
              seats: 5,
              doors: 4,
              fuel: "gasoline",
              transmission: "automatic",
              description: "Berline sportive et élégante",
              images: ["/placeholder.svg?height=200&width=300"],
              ownerId: 3,
              createdAt: new Date(),
              updatedAt: new Date()
            },
          ];
          
          // Apply filters to mock data
          let filteredCars = [...mockCars];
          
          // Filter by price
          filteredCars = filteredCars.filter(car => 
            car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1]
          );
          
          // Filter by type
          if (filters.types.length > 0) {
            filteredCars = filteredCars.filter(car => filters.types.includes(car.type));
          }
          
          // Filter by make
          if (filters.makes.length > 0) {
            filteredCars = filteredCars.filter(car => filters.makes.includes(car.make));
          }
          
          // Filter by features
          if (filters.features.length > 0) {
            filteredCars = filteredCars.filter(car => 
              filters.features.some(feature => car.features.includes(feature))
            );
          }
          
          // Filter by search term
          if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filteredCars = filteredCars.filter(car => 
              car.title.toLowerCase().includes(searchLower) ||
              car.make.toLowerCase().includes(searchLower) ||
              car.model.toLowerCase().includes(searchLower) ||
              car.location.toLowerCase().includes(searchLower)
            );
          }
          
          // Sort
          switch (filters.sortBy) {
            case "price-asc":
              filteredCars.sort((a, b) => a.price - b.price);
              break;
            case "price-desc":
              filteredCars.sort((a, b) => b.price - a.price);
              break;
            case "newest":
              filteredCars.sort((a, b) => b.year - a.year);
              break;
            default:
              break;
          }
          
          setCars(filteredCars);
          setCount(filteredCars.length);
        } else {
          // In production, call the actual API
          const response = await carService.getCars(queryParams);
          setCars(response);
          // In a real API response, we might also get a total count
          setCount(response.length);
        }
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError(handleApiError(err, "Failed to load cars. Please try again."));
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [filters]);

  // Update URL query params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    params.set("minPrice", filters.priceRange[0].toString());
    params.set("maxPrice", filters.priceRange[1].toString());
    
    if (filters.types.length > 0) params.set("types", filters.types.join(","));
    if (filters.makes.length > 0) params.set("makes", filters.makes.join(","));
    if (filters.features.length > 0) params.set("features", filters.features.join(","));
    if (filters.availableOnly) params.set("availableOnly", "true");
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.searchTerm) params.set("q", filters.searchTerm);
    if (filters.page > 1) params.set("page", filters.page.toString());
    
    // Update URL without reloading the page
    const url = `/search?${params.toString()}`;
    router.push(url, { scroll: false });
  }, [filters, router]);

  // Handle checkbox changes
  const handleCheckboxChange = (category: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentValues = [...prev[category] as string[]];
      const index = currentValues.indexOf(value);
      
      if (index === -1) {
        return { ...prev, [category]: [...currentValues, value], page: 1 };
      } else {
        currentValues.splice(index, 1);
        return { ...prev, [category]: currentValues, page: 1 };
      }
    });
  };

  // Handle price range changes
  const handlePriceChange = (values: number[]) => {
    setFilters(prev => ({ ...prev, priceRange: [values[0], values[1]], page: 1 }));
  };

  // Handle direct min/max price input
  const handlePriceInput = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    setFilters(prev => {
      if (type === 'min') {
        return { ...prev, priceRange: [numValue, prev.priceRange[1]], page: 1 };
      } else {
        return { ...prev, priceRange: [prev.priceRange[0], numValue], page: 1 };
      }
    });
  };

  // Handle availability toggle
  const handleAvailabilityToggle = (checked: boolean) => {
    setFilters(prev => ({ ...prev, availableOnly: checked, page: 1 }));
  };

  // Handle search term changes
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const searchInput = form.elements.namedItem('searchTerm') as HTMLInputElement;
    setFilters(prev => ({ ...prev, searchTerm: searchInput.value, page: 1 }));
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, sortBy: e.target.value }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      priceRange: [0, 200],
      types: [],
      makes: [],
      features: [],
      availableOnly: false,
      sortBy: "price-asc",
      searchTerm: "",
      page: 1
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 md:px-6 py-8 mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white p-4 rounded-lg border sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filtres</h2>
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={resetFilters}>
                  Réinitialiser
                </Button>
              </div>

              <div className="space-y-6">
                {/* Price range */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Prix par jour</h3>
                  <div className="space-y-4">
                    <Slider 
                      value={[filters.priceRange[0], filters.priceRange[1]]} 
                      min={0}
                      max={200} 
                      step={5} 
                      onValueChange={handlePriceChange}
                    />
                    <div className="flex items-center justify-between">
                      <Input 
                        type="number" 
                        placeholder="Min" 
                        className="w-20 h-8" 
                        value={filters.priceRange[0]} 
                        onChange={(e) => handlePriceInput('min', e.target.value)} 
                      />
                      <span className="text-gray-500">-</span>
                      <Input 
                        type="number" 
                        placeholder="Max" 
                        className="w-20 h-8" 
                        value={filters.priceRange[1]} 
                        onChange={(e) => handlePriceInput('max', e.target.value)} 
                      />
                      <span className="text-gray-500">€</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Car type */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Type de véhicule</h3>
                  <div className="space-y-2">
                    {carTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`type-${type}`} 
                          checked={filters.types.includes(type)}
                          onCheckedChange={(checked) => checked !== undefined && 
                            handleCheckboxChange('types', type)
                          }
                        />
                        <Label htmlFor={`type-${type}`} className="text-sm font-normal">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Brand */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Marque</h3>
                  <div className="space-y-2">
                    {carMakes.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`brand-${brand}`} 
                          checked={filters.makes.includes(brand)}
                          onCheckedChange={(checked) => checked !== undefined && 
                            handleCheckboxChange('makes', brand)
                          }
                        />
                        <Label htmlFor={`brand-${brand}`} className="text-sm font-normal">
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Features */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Caractéristiques</h3>
                  <div className="space-y-2">
                    {carFeatures.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`feature-${feature}`} 
                          checked={filters.features.includes(feature)}
                          onCheckedChange={(checked) => checked !== undefined && 
                            handleCheckboxChange('features', feature)
                          }
                        />
                        <Label htmlFor={`feature-${feature}`} className="text-sm font-normal">
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Availability */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Disponibilité</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="available-now" 
                        checked={filters.availableOnly}
                        onCheckedChange={(checked) => handleAvailabilityToggle(!!checked)}
                      />
                      <Label htmlFor="available-now" className="text-sm font-normal">
                        Disponible maintenant
                      </Label>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <Filter className="mr-2 h-4 w-4" />
                  Appliquer les filtres
                </Button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* Search bar */}
            <div className="bg-white p-4 rounded-lg border mb-6">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    name="searchTerm" 
                    placeholder="Rechercher par ville, marque, modèle..." 
                    className="pl-9" 
                    defaultValue={filters.searchTerm}
                  />
                </div>
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  <Search className="mr-2 h-4 w-4" />
                  Rechercher
                </Button>
              </form>
            </div>

            {/* Results header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold">Résultats de recherche</h1>
                <p className="text-gray-500">{count} voitures trouvées</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Trier par:</span>
                <select 
                  className="text-sm border rounded-md px-2 py-1"
                  value={filters.sortBy}
                  onChange={handleSortChange}
                >
                  <option value="price-asc">Prix: croissant</option>
                  <option value="price-desc">Prix: décroissant</option>
                  <option value="newest">Plus récent</option>
                </select>
              </div>
            </div>

            {/* Error state */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Loading state */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                <span className="ml-2 text-gray-500">Chargement des voitures...</span>
              </div>
            ) : cars.length === 0 ? (
              <div className="bg-white rounded-lg border p-8 text-center">
                <h2 className="text-xl font-semibold mb-2">Aucune voiture trouvée</h2>
                <p className="text-gray-500 mb-4">Essayez de modifier vos filtres pour voir plus de résultats.</p>
                <Button variant="outline" onClick={resetFilters}>Réinitialiser les filtres</Button>
              </div>
            ) : (
              <>
            {/* Results grid */}
            <div className="grid gap-6">
              {cars.map((car) => (
                <div
                  key={car.id}
                  className="bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-1/3">
                      <img
                            src={car.images[0] || "/placeholder.svg"}
                        alt={car.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                      <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-500">
                        <Heart className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex-1 p-4 md:p-6 flex flex-col">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-bold">{car.title}</h2>
                          <p className="text-gray-500">
                            {car.type} • {car.year}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-red-600">
                            {car.price}€<span className="text-sm font-normal text-gray-500">/jour</span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                            {car.features.slice(0, 4).map((feature, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50">
                            {feature}
                          </Badge>
                        ))}
                            {car.features.length > 4 && (
                              <Badge variant="outline" className="bg-gray-50">
                                +{car.features.length - 4}
                              </Badge>
                            )}
                      </div>

                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-gray-400"
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

                          <div className="mt-auto pt-4 flex justify-end">
                        <Button asChild className="bg-red-600 hover:bg-red-700">
                          <Link href={`/cars/${car.id}`}>Voir les détails</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center gap-1">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="w-8 h-8" 
                      disabled={filters.page === 1}
                      onClick={() => handlePageChange(filters.page - 1)}
                    >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="sr-only">Previous</span>
                </Button>
                    
                    {/* Show 5 page buttons at most */}
                    {Array.from({ length: Math.min(5, Math.ceil(count / 10)) }, (_, i) => {
                      const page = Math.min(Math.max(1, filters.page - 2), Math.ceil(count / 10) - 4) + i;
                      return (
                        <Button 
                          key={page}
                          variant="outline" 
                          size="sm" 
                          className={`w-8 h-8 ${
                            page === filters.page ? "bg-red-600 text-white border-red-600" : ""
                          }`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                </Button>
                      );
                    })}
                    
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="w-8 h-8"
                      disabled={filters.page === Math.ceil(count / 10) || count === 0}
                      onClick={() => handlePageChange(filters.page + 1)}
                    >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="sr-only">Next</span>
                </Button>
              </nav>
            </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
