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
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, Save } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import AdminSidebar from "@/components/admin/admin-sidebar"

// General settings schema
const generalSettingsSchema = z.object({
  siteName: z.string().min(1, "Le nom du site est requis"),
  siteDescription: z.string().min(1, "La description du site est requise"),
  contactEmail: z.string().email("Email invalide"),
  supportPhone: z.string().min(10, "Numéro de téléphone invalide"),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
})

// Email settings schema
const emailSettingsSchema = z.object({
  smtpHost: z.string().min(1, "L'hôte SMTP est requis"),
  smtpPort: z.string().min(1, "Le port SMTP est requis"),
  smtpUser: z.string().min(1, "L'utilisateur SMTP est requis"),
  smtpPassword: z.string().min(1, "Le mot de passe SMTP est requis"),
  senderEmail: z.string().email("Email invalide"),
  senderName: z.string().min(1, "Le nom de l'expéditeur est requis"),
})

// Payment settings schema
const paymentSettingsSchema = z.object({
  stripePublicKey: z.string().min(1, "La clé publique Stripe est requise"),
  stripeSecretKey: z.string().min(1, "La clé secrète Stripe est requise"),
  currency: z.string().min(1, "La devise est requise"),
  commissionRate: z.string().min(1, "Le taux de commission est requis"),
})

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [registrationEnabled, setRegistrationEnabled] = useState(true)
  const [ownerRegistrationEnabled, setOwnerRegistrationEnabled] = useState(true)
  const [autoApproveOwners, setAutoApproveOwners] = useState(false)
  const [autoApproveCars, setAutoApproveCars] = useState(false)

  // General settings form
  const generalForm = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      siteName: "CarShare",
      siteDescription: "Plateforme de location de voitures entre particuliers",
      contactEmail: "contact@carshare.ma",
      supportPhone: "+212 522 123 456",
      address: "123 Boulevard Mohammed V",
      city: "Casablanca",
      postalCode: "20000",
      country: "Morocco",
    },
  })

  // Email settings form
  const emailForm = useForm<z.infer<typeof emailSettingsSchema>>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtpHost: "smtp.example.com",
      smtpPort: "587",
      smtpUser: "smtp_user",
      smtpPassword: "••••••••••••",
      senderEmail: "noreply@carshare.com",
      senderName: "CarShare",
    },
  })

  // Payment settings form
  const paymentForm = useForm<z.infer<typeof paymentSettingsSchema>>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: {
      stripePublicKey: "pk_test_••••••••••••••••••••••••",
      stripeSecretKey: "sk_test_••••••••••••••••••••••••",
      currency: "EUR",
      commissionRate: "25",
    },
  })

  // Handle general settings form submission
  function onGeneralSubmit(values: z.infer<typeof generalSettingsSchema>) {
    console.log(values)

    toast({
      title: "Paramètres généraux mis à jour",
      description: "Les paramètres généraux ont été enregistrés avec succès.",
      variant: "success",
    })
  }

  // Handle email settings form submission
  function onEmailSubmit(values: z.infer<typeof emailSettingsSchema>) {
    console.log(values)

    toast({
      title: "Paramètres email mis à jour",
      description: "Les paramètres email ont été enregistrés avec succès.",
      variant: "success",
    })
  }

  // Handle payment settings form submission
  function onPaymentSubmit(values: z.infer<typeof paymentSettingsSchema>) {
    console.log(values)

    toast({
      title: "Paramètres de paiement mis à jour",
      description: "Les paramètres de paiement ont été enregistrés avec succès.",
      variant: "success",
    })
  }

  return (
    <div className="md:pl-64">
      <AdminSidebar />

      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Paramètres du système</h1>
          <p className="text-gray-500 dark:text-gray-400">Configurez les paramètres généraux de la plateforme</p>
        </div>

        <Tabs defaultValue="general" className="mb-8">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="payment">Paiement</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres généraux</CardTitle>
                  <CardDescription>Configurez les informations de base de la plateforme</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...generalForm}>
                    <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={generalForm.control}
                          name="siteName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom du site</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={generalForm.control}
                          name="contactEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email de contact</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={generalForm.control}
                        name="siteDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description du site</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={generalForm.control}
                        name="supportPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone de support</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div>
                        <h3 className="text-lg font-medium mb-4">Adresse</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={generalForm.control}
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
                            control={generalForm.control}
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
                            control={generalForm.control}
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
                            control={generalForm.control}
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
                        <Button type="submit" className="bg-red-600 hover:bg-red-700">
                          <Save className="mr-2 h-4 w-4" />
                          Enregistrer les paramètres
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Paramètres du système</CardTitle>
                  <CardDescription>Configurez les paramètres de fonctionnement de la plateforme</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Mode maintenance</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Activer le mode maintenance</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Lorsque le mode maintenance est activé, seuls les administrateurs peuvent accéder au site
                          </p>
                        </div>
                        <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                      </div>

                      {maintenanceMode && (
                        <Alert className="mt-4 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/30">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <AlertTitle>Mode maintenance activé</AlertTitle>
                          <AlertDescription>
                            Le site est actuellement en mode maintenance. Seuls les administrateurs peuvent y accéder.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-4">Inscription</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Autoriser les inscriptions</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Permettre aux nouveaux utilisateurs de s'inscrire sur la plateforme
                            </p>
                          </div>
                          <Switch checked={registrationEnabled} onCheckedChange={setRegistrationEnabled} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Autoriser les inscriptions propriétaires</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Permettre aux utilisateurs de s'inscrire en tant que propriétaires
                            </p>
                          </div>
                          <Switch
                            checked={ownerRegistrationEnabled}
                            onCheckedChange={setOwnerRegistrationEnabled}
                            disabled={!registrationEnabled}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-4">Approbation automatique</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Approuver automatiquement les propriétaires</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Approuver automatiquement les nouveaux comptes propriétaires sans vérification manuelle
                            </p>
                          </div>
                          <Switch checked={autoApproveOwners} onCheckedChange={setAutoApproveOwners} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Approuver automatiquement les annonces</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Approuver automatiquement les nouvelles annonces de véhicules sans vérification manuelle
                            </p>
                          </div>
                          <Switch checked={autoApproveCars} onCheckedChange={setAutoApproveCars} />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button className="bg-red-600 hover:bg-red-700">
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer les paramètres
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres email</CardTitle>
                <CardDescription>Configurez les paramètres d'envoi d'emails</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Configuration SMTP</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={emailForm.control}
                          name="smtpHost"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hôte SMTP</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={emailForm.control}
                          name="smtpPort"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Port SMTP</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={emailForm.control}
                          name="smtpUser"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Utilisateur SMTP</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={emailForm.control}
                          name="smtpPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mot de passe SMTP</FormLabel>
                              <FormControl>
                                <Input {...field} type="password" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-4">Expéditeur</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={emailForm.control}
                          name="senderEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email de l'expéditeur</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={emailForm.control}
                          name="senderName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom de l'expéditeur</FormLabel>
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
                      <Button type="submit" className="bg-red-600 hover:bg-red-700">
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer les paramètres
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de paiement</CardTitle>
                <CardDescription>Configurez les paramètres de paiement et de commission</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...paymentForm}>
                  <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Configuration Stripe</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={paymentForm.control}
                          name="stripePublicKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Clé publique Stripe</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={paymentForm.control}
                          name="stripeSecretKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Clé secrète Stripe</FormLabel>
                              <FormControl>
                                <Input {...field} type="password" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-4">Paramètres de commission</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={paymentForm.control}
                          name="currency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Devise</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez une devise" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="EUR">Euro (€)</SelectItem>
                                  <SelectItem value="USD">Dollar US ($)</SelectItem>
                                  <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                                  <SelectItem value="CHF">Franc Suisse (CHF)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={paymentForm.control}
                          name="commissionRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Taux de commission (%)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" min="0" max="100" />
                              </FormControl>
                              <FormDescription>Pourcentage prélevé sur chaque transaction</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" className="bg-red-600 hover:bg-red-700">
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer les paramètres
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
