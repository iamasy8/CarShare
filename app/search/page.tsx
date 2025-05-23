"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Heart, Search, Filter, Loader2, Bookmark, History } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { carService } from "@/lib/api"
import { carHelpers, handleApiError } from "@/lib/api-helpers"
import { useSearchParams, useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Local Car interface that matches the API response
interface Car {
  id: number
  make: string
  model: string
  year: number
  price_per_day: number
  location: string
  description: string
  type: string
  is_available: boolean
  features: string[]
  images: string[]
  rating?: number
  reviews_count?: number
  transmission?: string
  fuel?: string
}

// Type definitions
interface FilterState {
  priceRange: [number, number];
  types: string[];
  makes: string[];
  features: string[];
  availableOnly: boolean;
  sortBy: string;
  searchTerm: string;
  page: number;
  transmission: string[];
  fuelType: string[];
  minRating: number;
  startDate?: Date;
  endDate?: Date;
}

interface SavedSearch {
  id: string;
  name: string;
  filters: FilterState;
  createdAt: Date;
}

interface SearchHistory {
  id: string;
  searchTerm: string;
  filters: FilterState;
  timestamp: Date;
}

// Available car types
const carTypes = ["Citadine", "Berline", "SUV", "Compacte", "Utilitaire", "Sport"];

// Available car makes - expanded to match the home page selection
const carMakes = [
  "Alfa Romeo", "Audi", "BMW", "Citroën", "Dacia", "Ferrari", "Fiat", "Ford",
  "Honda", "Hyundai", "Jaguar", "Kia", "Lamborghini", "Land Rover", "Lexus",
  "Maserati", "Mazda", "Mercedes", "Mini", "Mitsubishi", "Nissan", "Opel",
  "Peugeot", "Porsche", "Renault", "Seat", "Škoda", "Smart", "Subaru", 
  "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo"
];

// Available features
const carFeatures = ["Climatisation", "GPS", "Bluetooth", "Caméra de recul", "Sièges cuir"];

// Add new filter options
const transmissionTypes = ["Automatique", "Manuelle"];
const fuelTypes = ["Essence", "Diesel", "Électrique", "Hybride"];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [itemsPerPage] = useState(10);

  // Helper function to properly process URL parameters
  const processUrlParam = (param: string | null): string[] => {
    if (!param) return [];
    
    // Handle single values (don't split if there's no comma)
    const values = param.includes(',') ? param.split(',') : [param];
    
    // Process each value
    return values.map(value => {
      // Convert kebab-case to display format (e.g., "alfa-romeo" to "Alfa Romeo")
      if (value.includes('-')) {
        return value.split('-')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
      }
      
      // Ensure proper capitalization for car types and makes
      if (carTypes.map(t => t.toLowerCase()).includes(value.toLowerCase()) ||
          carMakes.map(m => m.toLowerCase()).includes(value.toLowerCase())) {
        // Find the correctly capitalized version
        const matchingType = carTypes.find(t => t.toLowerCase() === value.toLowerCase());
        if (matchingType) return matchingType;
        
        const matchingMake = carMakes.find(m => m.toLowerCase() === value.toLowerCase());
        if (matchingMake) return matchingMake;
      }
      
      return value;
    });
  };
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [
      parseInt(searchParams.get("minPrice") || "0"),
      parseInt(searchParams.get("maxPrice") || "1000") // Higher default maximum price to show more cars
    ],
    types: processUrlParam(searchParams.get("types")),
    makes: processUrlParam(searchParams.get("makes")),
    features: processUrlParam(searchParams.get("features")),
    availableOnly: searchParams.get("availableOnly") === "true",
    sortBy: searchParams.get("sortBy") || "newest", // Default to newest cars
    searchTerm: searchParams.get("q") || "",
    page: parseInt(searchParams.get("page") || "1"),
    transmission: processUrlParam(searchParams.get("transmission")),
    fuelType: processUrlParam(searchParams.get("fuelType")),
    minRating: parseInt(searchParams.get("minRating") || "0"),
    startDate: undefined,
    endDate: undefined
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
        if (filters.transmission.length > 0) queryParams.transmission = filters.transmission.join(",");
        if (filters.fuelType.length > 0) queryParams.fuelType = filters.fuelType.join(",");
        if (filters.minRating > 0) queryParams.minRating = filters.minRating;
        if (filters.availableOnly) queryParams.availableOnly = 'true';
        if (filters.searchTerm) queryParams.search = filters.searchTerm;
        
        // Add date filters if both dates are set
        if (filters.startDate && filters.endDate) {
          queryParams.startDate = filters.startDate.toISOString().split('T')[0];
          queryParams.endDate = filters.endDate.toISOString().split('T')[0];
        }

        // Fetch cars from API using the carService
        const response = await carService.getCars(queryParams);
        
        // Process response data
        if (response && response.length > 0) {
          // Type conversion to match our local Car interface
          const formattedCars = response.map(car => ({
            id: car.id,
            make: car.make,
            model: car.model,
            year: car.year,
            price_per_day: car.price_per_day,
            location: car.location,
            description: car.description,
            type: car.type || '',
            is_available: typeof car.is_available === 'boolean' ? car.is_available : true,
            features: Array.isArray(car.features) ? car.features : [],
            images: Array.isArray(car.images) ? car.images : [],
            rating: car.rating,
            reviews_count: car.reviews_count,
            transmission: car.transmission,
            fuel: car.fuel
          }));
          
          setCars(formattedCars);
          setCount(formattedCars.length);
          console.log('Found', formattedCars.length, 'cars');
        } else {
          // Handle empty response
          setCars([]);
          setCount(0);
          console.log('No cars found with current filters');
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
    if (filters.transmission.length > 0) params.set("transmission", filters.transmission.join(","));
    if (filters.fuelType.length > 0) params.set("fuelType", filters.fuelType.join(","));
    if (filters.minRating > 0) params.set("minRating", filters.minRating.toString());
    if (filters.availableOnly) params.set("availableOnly", "true");
    if (filters.sortBy) params.set("sort", filters.sortBy); // Change to 'sort' to match backend
    if (filters.searchTerm) params.set("q", filters.searchTerm);
    if (filters.page > 1) params.set("page", filters.page.toString());
    
    // Add date filters if both are set
    if (filters.startDate) params.set("startDate", filters.startDate.toISOString().split('T')[0]);
    if (filters.endDate) params.set("endDate", filters.endDate.toISOString().split('T')[0]);
    
    // Update URL without reloading the page
    const url = `/search?${params.toString()}`;
    router.push(url, { scroll: false });
  }, [filters, router]);

  // Helper function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    // Scroll to top when filter changes
    scrollToTop();
  };

  // Handle price range changes
  const handlePriceChange = (values: number[]) => {
    setFilters(prev => ({ ...prev, priceRange: [values[0], values[1]], page: 1 }));
    // Scroll to top when price range changes
    scrollToTop();
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
    // Scroll to top when price input changes
    scrollToTop();
  };

  // Handle availability toggle
  const handleAvailabilityToggle = (checked: boolean) => {
    setFilters(prev => ({ ...prev, availableOnly: checked, page: 1 }));
    // Scroll to top when availability changes
    scrollToTop();
  };

  // Handle search term changes
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const searchInput = form.elements.namedItem('searchTerm') as HTMLInputElement;
    setFilters(prev => ({ ...prev, searchTerm: searchInput.value, page: 1 }));
    // Scroll to top when search changes
    scrollToTop();
  };

  // Handle sort change
  const handleSortChange = (value: string | React.ChangeEvent<HTMLSelectElement>) => {
    // If value is an event, extract the value from the target
    const sortValue = typeof value === 'string' ? value : value.target.value;
    setFilters(prev => ({ ...prev, sortBy: sortValue, page: 1 }));
    // Scroll to top when sort changes
    scrollToTop();
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      types: [],
      makes: [],
      features: [],
      availableOnly: false,
      sortBy: "price-asc",
      searchTerm: "",
      page: 1,
      transmission: [],
      fuelType: [],
      minRating: 0,
      startDate: undefined,
      endDate: undefined
    });
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add function to save current search
  const saveCurrentSearch = () => {
    const newSavedSearch: SavedSearch = {
      id: Date.now().toString(),
      name: `Recherche ${savedSearches.length + 1}`,
      filters: { ...filters },
      createdAt: new Date()
    };
    setSavedSearches([...savedSearches, newSavedSearch]);
  };

  // Add function to load saved search
  const loadSavedSearch = (savedSearch: SavedSearch) => {
    setFilters(savedSearch.filters);
    setShowSavedSearches(false);
  };

  // Add function to add to search history
  const addToSearchHistory = () => {
    const newHistoryItem: SearchHistory = {
      id: Date.now().toString(),
      searchTerm: filters.searchTerm,
      filters: { ...filters },
      timestamp: new Date()
    };
    setSearchHistory([newHistoryItem, ...searchHistory.slice(0, 9)]);
  };

  // Update useEffect to handle search history
  useEffect(() => {
    if (filters.searchTerm) {
      addToSearchHistory();
    }
  }, [filters.searchTerm]);

  // Add pagination component
  const Pagination = () => {
    const totalPages = Math.ceil(count / itemsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="flex justify-center items-center space-x-2 mt-6">
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

        {pages.map((page) => (
          <Button
            key={page}
            variant={filters.page === page ? "default" : "outline"}
            size="icon"
            className="w-8 h-8"
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8"
          disabled={filters.page === totalPages}
          onClick={() => handlePageChange(filters.page + 1)}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="sr-only">Next</span>
        </Button>
      </div>
    );
  };

  // Add saved searches dropdown
  const SavedSearchesDropdown = () => (
    <div className="absolute top-full left-0 w-64 bg-white border rounded-lg shadow-lg mt-1 z-10">
      <div className="p-2">
        <h3 className="text-sm font-medium mb-2">Recherches sauvegardées</h3>
        {savedSearches.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune recherche sauvegardée</p>
        ) : (
          <div className="space-y-1">
            {savedSearches.map((search) => (
              <button
                key={search.id}
                className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                onClick={() => loadSavedSearch(search)}
              >
                {search.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Add search history dropdown
  const SearchHistoryDropdown = () => (
    <div className="absolute top-full left-0 w-64 bg-white border rounded-lg shadow-lg mt-1 z-10">
      <div className="p-2">
        <h3 className="text-sm font-medium mb-2">Historique des recherches</h3>
        {searchHistory.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun historique</p>
        ) : (
          <div className="space-y-1">
            {searchHistory.map((item) => (
              <button
                key={item.id}
                className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded"
                onClick={() => setFilters(item.filters)}
              >
                {item.searchTerm}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

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

                {/* Transmission type */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Transmission</h3>
                  <div className="space-y-2">
                    {transmissionTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`transmission-${type}`}
                          checked={filters.transmission.includes(type)}
                          onCheckedChange={(checked) => checked !== undefined &&
                            handleCheckboxChange('transmission', type)
                          }
                        />
                        <Label htmlFor={`transmission-${type}`} className="text-sm font-normal">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Fuel type */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Carburant</h3>
                  <div className="space-y-2">
                    {fuelTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`fuel-${type}`}
                          checked={filters.fuelType.includes(type)}
                          onCheckedChange={(checked) => checked !== undefined &&
                            handleCheckboxChange('fuelType', type)
                          }
                        />
                        <Label htmlFor={`fuel-${type}`} className="text-sm font-normal">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Rating filter */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Note minimum</h3>
                  <div className="space-y-2">
                    <Slider
                      value={[filters.minRating]}
                      min={0}
                      max={5}
                      step={0.5}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, minRating: value[0] }))}
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>0</span>
                      <span>5</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Date range picker */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Dates de disponibilité</h3>
                  <div className="space-y-2">
                    <Input
                      type="date"
                      value={filters.startDate?.toISOString().split('T')[0] || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                    />
                    <Input
                      type="date"
                      value={filters.endDate?.toISOString().split('T')[0] || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                    />
                  </div>
                </div>

                <Button className="w-full bg-red-600 hover:bg-red-700 mt-4" onClick={saveCurrentSearch}>
                  Sauvegarder cette recherche
                </Button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* Search bar with saved searches and history */}
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
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSavedSearches(!showSavedSearches)}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSearchHistory(!showSearchHistory)}
                    >
                      <History className="h-4 w-4" />
                    </Button>
                  </div>
                  {showSavedSearches && <SavedSearchesDropdown />}
                  {showSearchHistory && <SearchHistoryDropdown />}
                </div>
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  <Search className="mr-2 h-4 w-4" />
                  Rechercher
                </Button>
              </form>
            </div>

            {/* Results header with count and pagination info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold">Résultats de recherche</h1>
                <p className="text-gray-500">
                  {count} voitures trouvées • Page {filters.page} sur {Math.ceil(count / itemsPerPage)}
                </p>
              </div>
              <div className="mb-4 flex items-center justify-between bg-gray-50 p-3 rounded-md border">
                <div className="flex items-center gap-2">
                  <Label htmlFor="sort-by" className="text-sm font-medium">Trier par:</Label>
                  <select
                    id="sort-by"
                    className="border rounded-md p-2 text-sm font-medium bg-white"
                    value={filters.sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    <option value="newest">Plus récent</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="rating">Meilleures notes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error state with retry option */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>
                  {error}
                  <Button
                    variant="link"
                    className="ml-2"
                    onClick={() => window.location.reload()}
                  >
                    Réessayer
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Loading state with progress indicator */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                <span className="ml-2 text-gray-500">Chargement des voitures...</span>
              </div>
            ) : cars.length === 0 ? (
              <div className="bg-white rounded-lg border p-8 text-center">
                <h2 className="text-xl font-semibold mb-2">Aucune voiture trouvée</h2>
                <p className="text-gray-500 mb-4">
                  Essayez de modifier vos filtres ou de réinitialiser la recherche.
                </p>
                <div className="space-x-4">
                  <Button variant="outline" onClick={resetFilters}>
                    Réinitialiser les filtres
                  </Button>
                  <Button variant="outline" onClick={() => setShowSavedSearches(true)}>
                    Voir les recherches sauvegardées
                  </Button>
                </div>
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
                        src={car.images?.[0] || "/placeholder.svg"}
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-48 md:h-full object-cover"
                      />
                      <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-500">
                        <Heart className="h-5 w-5" />
                      </button>
                      {!car.is_available && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge className="bg-red-600 text-white px-3 py-1.5 text-sm font-medium">Non disponible</Badge>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-4 md:p-6 flex flex-col">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-bold">{car.make} {car.model}</h2>
                          <p className="text-gray-500">
                            {car.year} • {car.transmission}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-red-600">
                            {car.price_per_day}€<span className="text-sm font-normal text-gray-500">/jour</span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {car.features && car.features.length > 0 ? (
                          <>
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
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">Caractéristiques non spécifiées</span>
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
                <Pagination />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
