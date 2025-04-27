"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Upload, Info, CheckCircle, Lock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { SubscriptionLimitsAlert } from "@/components/owner/subscription-limits-alert"
import { VerificationStatus } from "@/components/owner/verification-status"
import { FileUpload } from "@/components/ui/file-upload"
import { useCreateCar } from "@/hooks/useCars"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Car features options
const carFeatures = [
  { id: "climatisation", label: "Climatisation" },
  { id: "bluetooth", label: "Bluetooth" },
  { id: "gps", label: "GPS" },
  { id: "regulator", label: "Régulateur de vitesse" },
  { id: "camera", label: "Caméra de recul" },
  { id: "heated_seats", label: "Sièges chauffants" },
  { id: "leather", label: "Sièges en cuir" },
  { id: "sunroof", label: "Toit ouvrant" },
  { id: "electric_windows", label: "Vitres électriques" },
  { id: "usb", label: "Ports USB" },
]

// Car makes for dropdown
const carMakes = [
  "Audi",
  "BMW",
  "Citroën",
  "Dacia",
  "Fiat",
  "Ford",
  "Honda",
  "Hyundai",
  "Kia",
  "Mercedes",
  "Nissan",
  "Opel",
  "Peugeot",
  "Renault",
  "Seat",
  "Skoda",
  "Toyota",
  "Volkswagen",
  "Volvo",
]

// Car types for dropdown
const carTypes = [
  { value: "citadine", label: "Citadine" },
  { value: "berline", label: "Berline" },
  { value: "suv", label: "SUV" },
  { value: "break", label: "Break" },
  { value: "monospace", label: "Monospace" },
  { value: "cabriolet", label: "Cabriolet" },
  { value: "coupe", label: "Coupé" },
  { value: "utilitaire", label: "Utilitaire" },
]

// Fuel types for dropdown
const fuelTypes = [
  { value: "essence", label: "Essence" },
  { value: "diesel", label: "Diesel" },
  { value: "hybrid", label: "Hybride" },
  { value: "electric", label: "Électrique" },
  { value: "gpl", label: "GPL" },
]

// Transmission types for dropdown
const transmissionTypes = [
  { value: "manual", label: "Manuelle" },
  { value: "automatic", label: "Automatique" },
]

// Form schema using Zod
const formSchema = z.object({
  make: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  year: z.string().regex(/^\d{4}$/, "L'année doit être au format YYYY"),
  type: z.string().min(1, "Le type de véhicule est requis"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Le prix doit être un nombre valide"),
  location: z.string().min(1, "La localisation est requise"),
  seats: z.string().regex(/^\d+$/, "Le nombre de places doit être un nombre"),
  doors: z.string().regex(/^\d+$/, "Le nombre de portes doit être un nombre"),
  fuel: z.string().min(1, "Le type de carburant est requis"),
  transmission: z.string().min(1, "Le type de transmission est requis"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  features: z.array(z.string()).optional(),
  availableFrom: z.date().optional(),
  availableTo: z.date().optional(),
})

export default function AddCarPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [carCount, setCarCount] = useState(0)
  const [carImages, setCarImages] = useState<File[]>([])
  const createCarMutation = useCreateCar()
  
  // Get owner cars count
  useEffect(() => {
    const getCarCount = async () => {
      // In real implementation, use the subscription service to get limits
      setCarCount(Math.min(user?.subscription?.tier === "basic" ? 0 : 2, 3))
    }
    
    if (user?.role === "owner") {
      getCarCount()
    }
  }, [user])
  
  const canAddCar = user?.isVerified && (
    (user?.subscription?.tier === "premium") || 
    (user?.subscription?.tier === "standard" && carCount < 3) || 
    (user?.subscription?.tier === "basic" && carCount < 1)
  )

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear().toString(),
      type: "",
      price: "",
      location: "",
      seats: "5",
      doors: "5",
      fuel: "",
      transmission: "",
      description: "",
      features: [],
    },
  })

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!canAddCar) {
      return
    }
    
    if (carImages.length === 0) {
      toast.error("Veuillez ajouter au moins une image de votre véhicule")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Prepare form data for API submission
      const formData = new FormData()
      
      // Add all form values
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'availableFrom' || key === 'availableTo') {
          // Handle dates
          if (value) {
            formData.append(key, (value as Date).toISOString())
          }
        } else if (key === 'features') {
          // Handle array of features
          if (value && Array.isArray(value)) {
            value.forEach((feature) => {
              formData.append('features[]', feature)
            })
          }
        } else {
          // Handle other fields
          formData.append(key, String(value))
        }
      })
      
      // Add title (make + model)
      formData.append('title', `${values.make} ${values.model}`)
      
      // Add images
      carImages.forEach((image) => {
        formData.append('images', image)
      })
      
      // Submit using our mutation
      await createCarMutation.mutateAsync(formData)
      
      setSubmitSuccess(true)
      
      // Redirect to listings after short delay
      setTimeout(() => {
        router.push('/owner/listings')
      }, 2000)
    } catch (error) {
      console.error('Failed to add car:', error)
      toast.error("Une erreur s'est produite lors de l'ajout de votre véhicule")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle file upload
  const handleImagesChange = (files: File[]) => {
    setCarImages(files)
  }

  if (submitSuccess) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Voiture ajoutée avec succès</h2>
              <p className="text-gray-500 mb-6">
                Votre véhicule a été ajouté et sera disponible après validation par notre équipe.
              </p>
              <div className="flex gap-4">
                <Button asChild variant="outline">
                  <Link href="/owner/listings">Voir mes annonces</Link>
                </Button>
                <Button asChild>
                  <Link href="/owner/dashboard">Retour au tableau de bord</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Ajouter un véhicule</h1>
        <p className="text-gray-500">
          Remplissez le formulaire ci-dessous pour ajouter votre véhicule à la plateforme.
        </p>
      </div>

      {!user?.isVerified && (
        <VerificationStatus className="mb-6" />
      )}

      <SubscriptionLimitsAlert
        carCount={carCount}
        tier={user?.subscription?.tier || "basic"}
        className="mb-6"
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>Informations de base sur votre véhicule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marque</FormLabel>
                      <Select
                        disabled={isSubmitting || !canAddCar}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une marque" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {carMakes.map((make) => (
                            <SelectItem key={make} value={make}>
                              {make}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modèle</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Exemple: Clio, 3008"
                          {...field}
                          disabled={isSubmitting || !canAddCar}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Année</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="2021"
                          {...field}
                          disabled={isSubmitting || !canAddCar}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de véhicule</FormLabel>
                      <Select
                        disabled={isSubmitting || !canAddCar}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {carTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localisation</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ville où se trouve le véhicule"
                        {...field}
                        disabled={isSubmitting || !canAddCar}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Caractéristiques</CardTitle>
              <CardDescription>Caractéristiques techniques et prix de votre véhicule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix journalier (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50"
                        {...field}
                        disabled={isSubmitting || !canAddCar}
                      />
                    </FormControl>
                    <FormDescription>
                      Prix que les locataires paieront par jour (hors assurance et frais de service)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="seats"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de places</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="5"
                          {...field}
                          disabled={isSubmitting || !canAddCar}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="doors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de portes</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="5"
                          {...field}
                          disabled={isSubmitting || !canAddCar}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fuel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carburant</FormLabel>
                      <Select
                        disabled={isSubmitting || !canAddCar}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Type de carburant" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fuelTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="transmission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transmission</FormLabel>
                      <Select
                        disabled={isSubmitting || !canAddCar}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Type de transmission" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {transmissionTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Équipements</CardTitle>
              <CardDescription>Sélectionnez les équipements disponibles dans votre véhicule</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="features"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 gap-3">
                      {carFeatures.map((feature) => (
                        <FormField
                          key={feature.id}
                          control={form.control}
                          name="features"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={feature.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(feature.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value || [], feature.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== feature.id
                                            )
                                          )
                                    }}
                                    disabled={isSubmitting || !canAddCar}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {feature.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
              <CardDescription>Décrivez votre véhicule en détail pour attirer des locataires</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez votre véhicule, son état, ses avantages, etc."
                        className="min-h-32"
                        {...field}
                        disabled={isSubmitting || !canAddCar}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disponibilité</CardTitle>
              <CardDescription>Définissez la période pendant laquelle votre véhicule sera disponible</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="availableFrom"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date de début</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={isSubmitting || !canAddCar}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: fr })
                              ) : (
                                <span>Choisir une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date()
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="availableTo"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date de fin</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={isSubmitting || !canAddCar}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: fr })
                              ) : (
                                <span>Choisir une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || (form.getValues().availableFrom && date < form.getValues().availableFrom)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <CardDescription>Ajoutez des photos de votre véhicule (minimum 1, maximum 10)</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                onChange={handleImagesChange}
                value={carImages}
                multiple
                maxFiles={10}
                accept="image/*"
                disabled={isSubmitting || !canAddCar}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              asChild
            >
              <Link href="/owner/dashboard">Annuler</Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !canAddCar || createCarMutation.isPending}
            >
              {isSubmitting || createCarMutation.isPending ? (
                <>Ajout en cours...</>
              ) : (
                <>Ajouter le véhicule</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
