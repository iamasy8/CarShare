import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, MessageSquare, HelpCircle, Car, AlertTriangle } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Contactez-nous</h1>
            <p className="text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed max-w-[700px] mx-auto">
              Notre équipe est à votre disposition pour répondre à toutes vos questions
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-red-600" />
                Support général
              </CardTitle>
              <CardDescription>Pour toute question sur nos services</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Notre équipe de support est disponible 7j/7 de 9h à 19h pour répondre à toutes vos questions.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>contact@carshare.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>+33 1 23 45 67 89</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-red-600" />
                Support propriétaires
              </CardTitle>
              <CardDescription>Pour les propriétaires de véhicules</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Une équipe dédiée aux propriétaires pour vous aider à gérer vos annonces et réservations.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>proprietaires@carshare.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>+33 1 23 45 67 90</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Assistance d'urgence
              </CardTitle>
              <CardDescription>Pour les situations urgentes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                En cas d'accident, de panne ou de problème urgent pendant une location.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>+33 1 23 45 67 91</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Disponible 24h/24 et 7j/7</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-medium">Siège social - Casablanca</h3>
            <address className="mt-3 text-sm not-italic text-muted-foreground">
              CarShare Maroc<br />
              123 Boulevard Mohammed V<br />
              20250 Casablanca, Morocco
            </address>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-medium">Bureau régional - Rabat</h3>
            <address className="mt-3 text-sm not-italic text-muted-foreground">
              CarShare Maroc<br />
              45 Avenue Fal Ould Oumeir<br />
              10000 Rabat, Morocco
            </address>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-medium">Bureau régional - Marrakech</h3>
            <address className="mt-3 text-sm not-italic text-muted-foreground">
              CarShare Maroc<br />
              78 Avenue Mohammed V<br />
              40000 Marrakech, Morocco
            </address>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-8 mt-12">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Horaires d'ouverture</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Lundi - Vendredi</span>
                  <span>9h - 19h</span>
                </div>
                <div className="flex justify-between">
                  <span>Samedi</span>
                  <span>10h - 18h</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimanche</span>
                  <span>Fermé</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="h-5 w-5 text-red-600" />
                <h3 className="font-medium">Besoin d'aide rapidement ?</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Consultez notre{" "}
                <a href="/faq" className="text-red-600 hover:underline">
                  FAQ
                </a>{" "}
                pour trouver des réponses aux questions les plus fréquentes ou contactez notre support par téléphone
                pour une assistance immédiate.
              </p>
            </div>
          </div>

          <div className="md:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nom
                  </label>
                  <Input id="name" placeholder="Votre nom" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="votre@email.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Sujet
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un sujet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Question générale</SelectItem>
                    <SelectItem value="reservation">Réservation</SelectItem>
                    <SelectItem value="technical">Problème technique</SelectItem>
                    <SelectItem value="billing">Facturation</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea id="message" placeholder="Votre message" rows={5} />
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                Envoyer le message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
