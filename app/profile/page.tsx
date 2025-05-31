"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Camera, Check, Star, Upload } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { RouteProtection } from "@/components/route-protection"
import { formatDate } from "@/lib/utils"

// Form schema
const profileFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  bio: z.string().max(500, "La bio ne peut pas dépasser 500 caractères").optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
})

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with user data
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
      address: user?.address || "",
      city: user?.city || "",
      postalCode: user?.postalCode || "",
      country: user?.country || "France",
    },
  })

  // Handle form submission
  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    try {
      setIsSubmitting(true)
      
      // Call the updateProfile API method
      await updateProfile(values)
      
      // Show success toast
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
        variant: "success",
      })
      
      // Exit edit mode
      setIsEditing(false)
    } catch (error) {
      console.error("Profile update error:", error)
      
      // Show error toast
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de votre profil.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <RouteProtection>
      <div className="container py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Profile sidebar */}
            <div className="w-full md:w-1/3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                        <AvatarFallback className="text-2xl">{user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full bg-red-600 hover:bg-red-700 h-8 w-8"
                      >
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Change avatar</span>
                      </Button>
                    </div>
                    <h2 className="text-xl font-bold">{user?.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-2">{user?.email}</p>
                    <Badge className="bg-red-600 hover:bg-red-700 mb-4">
                      {user?.role === "owner" ? "Propriétaire" : "Client"}
                    </Badge>

                    <div className="w-full">
                      <Separator className="my-4" />

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Check className="h-4 w-4 text-red-600 mr-2" />
                          <span className="text-sm">Email vérifié</span>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-green-500 text-green-600 dark:border-green-400 dark:text-green-400"
                        >
                          Vérifié
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Check className="h-4 w-4 text-red-600 mr-2" />
                          <span className="text-sm">Téléphone vérifié</span>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-green-500 text-green-600 dark:border-green-400 dark:text-green-400"
                        >
                          Vérifié
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Check className="h-4 w-4 text-red-600 mr-2" />
                          <span className="text-sm">Identité vérifiée</span>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-green-500 text-green-600 dark:border-green-400 dark:text-green-400"
                        >
                          Vérifié
                        </Badge>
                      </div>

                      <Separator className="my-4" />

                      <div className="flex items-center mb-2">
                        <Star className="h-4 w-4 text-red-600 mr-2" />
                        <span className="text-sm font-medium">Note moyenne: {user?.rating || 4.8}/5</span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Basée sur 12 évaluations</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile content */}
            <div className="w-full md:w-2/3">
              <Tabs defaultValue="profile">
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="profile">Profil</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="preferences">Préférences</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Informations personnelles</CardTitle>
                          <CardDescription>Gérez vos informations personnelles et vos coordonnées</CardDescription>
                        </div>
                        <Button
                          variant={isEditing ? "outline" : "default"}
                          className={
                            isEditing
                              ? "border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                              : "bg-red-600 hover:bg-red-700"
                          }
                          onClick={() => setIsEditing(!isEditing)}
                          disabled={isSubmitting}
                        >
                          {isEditing ? "Annuler" : "Modifier"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nom complet</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input {...field} type="email" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Téléphone</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="bio"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Bio</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      {...field}
                                      placeholder="Parlez-nous un peu de vous..."
                                      className="min-h-[100px]"
                                    />
                                  </FormControl>
                                  <FormDescription>Cette bio sera visible par les autres utilisateurs.</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="space-y-4">
                              <h3 className="text-lg font-medium">Adresse</h3>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                  control={form.control}
                                  name="address"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Adresse</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="city"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Ville</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="postalCode"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Code postal</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="country"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Pays</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <Button 
                                type="submit" 
                                className="bg-red-600 hover:bg-red-700"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      ) : (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Nom complet</h3>
                              <p className="mt-1">{user?.name}</p>
                            </div>

                            <div>
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                              <p className="mt-1">{user?.email}</p>
                            </div>

                            <div>
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Téléphone</h3>
                              <p className="mt-1">{user?.phone || "Non renseigné"}</p>
                            </div>

                            <div>
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Membre depuis</h3>
                              <p className="mt-1">{user?.joined_date ? formatDate(user.joined_date) : "Janvier 2023"}</p>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Bio</h3>
                            <p className="mt-1">{user?.bio || "Aucune bio renseignée."}</p>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="text-lg font-medium mb-4">Adresse</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Adresse</h3>
                                <p className="mt-1">{user?.address || "Non renseignée"}</p>
                              </div>

                              <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ville</h3>
                                <p className="mt-1">{user?.city || "Non renseignée"}</p>
                              </div>

                              <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Code postal</h3>
                                <p className="mt-1">{user?.postalCode || "Non renseigné"}</p>
                              </div>

                              <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pays</h3>
                                <p className="mt-1">{user?.country || "France"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents">
                  <Card>
                    <CardHeader>
                      <CardTitle>Documents d'identité</CardTitle>
                      <CardDescription>Gérez vos documents d'identité et votre permis de conduire</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Pièce d'identité</h3>
                          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Carte d'identité</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Téléchargée le 15/01/2023</p>
                              </div>
                              <Badge className="bg-green-600">Vérifiée</Badge>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-4">Permis de conduire</h3>
                          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Permis B</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Téléchargé le 15/01/2023</p>
                              </div>
                              <Badge className="bg-green-600">Vérifié</Badge>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-4">Ajouter un nouveau document</h3>
                          <div className="border-2 border-dashed rounded-lg p-6 text-center">
                            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">Déposez votre document ici</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                              Formats acceptés: JPG, PNG, PDF. Taille maximale: 5MB.
                            </p>
                            <Button className="bg-red-600 hover:bg-red-700">Parcourir les fichiers</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preferences">
                  <Card>
                    <CardHeader>
                      <CardTitle>Préférences</CardTitle>
                      <CardDescription>Gérez vos préférences de notification et de confidentialité</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Notifications</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Notifications par email</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Recevoir des emails pour les réservations, messages et mises à jour
                                </p>
                              </div>
                              <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Notifications SMS</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Recevoir des SMS pour les alertes importantes
                                </p>
                              </div>
                              <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Notifications marketing</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Recevoir des offres promotionnelles et des actualités
                                </p>
                              </div>
                              <Switch />
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-lg font-medium mb-4">Confidentialité</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Profil public</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Rendre votre profil visible pour les autres utilisateurs
                                </p>
                              </div>
                              <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Partage de données</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Autoriser le partage de données anonymisées pour améliorer le service
                                </p>
                              </div>
                              <Switch defaultChecked />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button className="bg-red-600 hover:bg-red-700">Enregistrer les préférences</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </RouteProtection>
  )
}
