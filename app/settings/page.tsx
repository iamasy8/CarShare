"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, CreditCard, Shield, Smartphone } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Password schema
const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    newPassword: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

// Email schema
const emailFormSchema = z.object({
  email: z.string().email("Email invalide"),
})

// Phone schema
const phoneFormSchema = z.object({
  phone: z.string().min(10, "Numéro de téléphone invalide"),
})

// Payment schema
const paymentFormSchema = z.object({
  cardNumber: z.string().min(16, "Numéro de carte invalide"),
  cardName: z.string().min(2, "Nom sur la carte requis"),
  expiryDate: z.string().min(5, "Date d'expiration invalide"),
  cvv: z.string().min(3, "CVV invalide"),
})

export default function SettingsPage() {
  const { toast } = useToast()
  const [deleteAccount, setDeleteAccount] = useState(false)

  // Password form
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Email form
  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "user@example.com",
    },
  })

  // Phone form
  const phoneForm = useForm<z.infer<typeof phoneFormSchema>>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phone: "0612345678",
    },
  })

  // Payment form
  const paymentForm = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    },
  })

  // Handle password form submission
  function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    console.log(values)

    toast({
      title: "Mot de passe mis à jour",
      description: "Votre mot de passe a été modifié avec succès.",
      variant: "success",
    })

    passwordForm.reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  // Handle email form submission
  function onEmailSubmit(values: z.infer<typeof emailFormSchema>) {
    console.log(values)

    toast({
      title: "Email mis à jour",
      description: "Votre adresse email a été modifiée avec succès.",
      variant: "success",
    })
  }

  // Handle phone form submission
  function onPhoneSubmit(values: z.infer<typeof phoneFormSchema>) {
    console.log(values)

    toast({
      title: "Téléphone mis à jour",
      description: "Votre numéro de téléphone a été modifié avec succès.",
      variant: "success",
    })
  }

  // Handle payment form submission
  function onPaymentSubmit(values: z.infer<typeof paymentFormSchema>) {
    console.log(values)

    toast({
      title: "Méthode de paiement ajoutée",
      description: "Votre carte a été ajoutée avec succès.",
      variant: "success",
    })

    paymentForm.reset({
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    })
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Gérez vos paramètres de compte et vos préférences</p>

        <Tabs defaultValue="account" className="mb-8">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="account">Compte</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="payment">Paiement</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email</CardTitle>
                  <CardDescription>Modifiez votre adresse email</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...emailForm}>
                    <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                      <FormField
                        control={emailForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Adresse email</FormLabel>
                            <FormControl>
                              <div className="flex">
                                <Input {...field} className="rounded-r-none" />
                                <Button type="submit" className="rounded-l-none bg-red-600 hover:bg-red-700">
                                  Mettre à jour
                                </Button>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Nous vous enverrons un email de confirmation à cette adresse.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Téléphone</CardTitle>
                  <CardDescription>Modifiez votre numéro de téléphone</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...phoneForm}>
                    <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-6">
                      <FormField
                        control={phoneForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numéro de téléphone</FormLabel>
                            <FormControl>
                              <div className="flex">
                                <Input {...field} className="rounded-r-none" />
                                <Button type="submit" className="rounded-l-none bg-red-600 hover:bg-red-700">
                                  Mettre à jour
                                </Button>
                              </div>
                            </FormControl>
                            <FormDescription>Nous vous enverrons un SMS de confirmation à ce numéro.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Langue et région</CardTitle>
                  <CardDescription>Définissez vos préférences de langue et de région</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <FormLabel>Langue</FormLabel>
                      <Select defaultValue="fr">
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une langue" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <FormLabel>Devise</FormLabel>
                      <Select defaultValue="eur">
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une devise" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eur">Euro (€)</SelectItem>
                          <SelectItem value="usd">Dollar US ($)</SelectItem>
                          <SelectItem value="gbp">Livre Sterling (£)</SelectItem>
                          <SelectItem value="chf">Franc Suisse (CHF)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button className="bg-red-600 hover:bg-red-700">Enregistrer les préférences</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Supprimer le compte</CardTitle>
                  <CardDescription>Supprimez définitivement votre compte et toutes vos données</CardDescription>
                </CardHeader>
                <CardContent>
                  {deleteAccount ? (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Êtes-vous sûr de vouloir supprimer votre compte ?</AlertTitle>
                      <AlertDescription>
                        Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                      </AlertDescription>
                      <div className="flex justify-end gap-4 mt-4">
                        <Button variant="outline" onClick={() => setDeleteAccount(false)}>
                          Annuler
                        </Button>
                        <Button variant="destructive">Confirmer la suppression</Button>
                      </div>
                    </Alert>
                  ) : (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        La suppression de votre compte est définitive et irréversible. Toutes vos données personnelles,
                        réservations et annonces seront supprimées.
                      </p>
                      <Button variant="destructive" onClick={() => setDeleteAccount(true)}>
                        Supprimer mon compte
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mot de passe</CardTitle>
                  <CardDescription>Modifiez votre mot de passe</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe actuel</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nouveau mot de passe</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormDescription>Votre mot de passe doit contenir au moins 8 caractères.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmer le mot de passe</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end">
                        <Button type="submit" className="bg-red-600 hover:bg-red-700">
                          Mettre à jour le mot de passe
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Authentification à deux facteurs</CardTitle>
                  <CardDescription>
                    Renforcez la sécurité de votre compte avec l'authentification à deux facteurs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Shield className="h-8 w-8 text-red-600" />
                      <div>
                        <p className="font-medium">Authentification par SMS</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Recevez un code de vérification par SMS lors de la connexion
                        </p>
                      </div>
                    </div>
                    <Switch />
                  </div>

                  <Separator className="my-6" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Smartphone className="h-8 w-8 text-red-600" />
                      <div>
                        <p className="font-medium">Application d'authentification</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Utilisez une application comme Google Authenticator ou Authy
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                    >
                      Configurer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sessions actives</CardTitle>
                  <CardDescription>Gérez vos sessions actives sur différents appareils</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Chrome sur Windows</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Paris, France · Actif maintenant</p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                      >
                        Déconnecter
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Safari sur iPhone</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Lyon, France · Dernière activité il y a 2 heures
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                      >
                        Déconnecter
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Firefox sur MacBook</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Marseille, France · Dernière activité il y a 5 jours
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                      >
                        Déconnecter
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button variant="destructive">Déconnecter toutes les sessions</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
                <CardDescription>Choisissez comment et quand vous souhaitez être notifié</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Email</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Réservations</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Notifications pour les nouvelles réservations, modifications et annulations
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Messages</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Notifications pour les nouveaux messages
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Rappels</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Rappels pour les réservations à venir
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Offres promotionnelles et actualités
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">SMS</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Réservations</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Notifications pour les nouvelles réservations et annulations
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Messages</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Notifications pour les nouveaux messages
                          </p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Rappels</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Rappels pour les réservations à venir
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

          <TabsContent value="payment">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Méthodes de paiement</CardTitle>
                  <CardDescription>Gérez vos cartes de crédit et autres méthodes de paiement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <CreditCard className="h-8 w-8 text-red-600 mr-4" />
                        <div>
                          <p className="font-medium">Visa se terminant par 4242</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Expire le 12/2025</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>Par défaut</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                        >
                          Modifier
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Ajouter une nouvelle carte</h3>
                    <Form {...paymentForm}>
                      <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-6">
                        <FormField
                          control={paymentForm.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Numéro de carte</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="1234 5678 9012 3456" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={paymentForm.control}
                          name="cardName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom sur la carte</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="John Doe" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-6">
                          <FormField
                            control={paymentForm.control}
                            name="expiryDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date d'expiration</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="MM/YY" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={paymentForm.control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="123" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex justify-end">
                          <Button type="submit" className="bg-red-600 hover:bg-red-700">
                            Ajouter la carte
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Historique de facturation</CardTitle>
                  <CardDescription>Consultez vos factures et reçus</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Réservation #12345</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">15 juin 2023 · 135,00 €</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                      >
                        Télécharger
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Réservation #12344</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">10 mai 2023 · 250,00 €</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                      >
                        Télécharger
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Réservation #12343</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">5 avril 2023 · 120,00 €</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                      >
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
