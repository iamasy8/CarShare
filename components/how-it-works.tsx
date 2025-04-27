import { Car, Search, MessageSquare, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  {
    icon: Search,
    title: "Recherchez",
    description: "Parcourez notre sélection de voitures et utilisez les filtres pour trouver le véhicule idéal.",
  },
  {
    icon: MessageSquare,
    title: "Contactez",
    description: "Échangez directement avec le propriétaire pour poser vos questions et organiser la location.",
  },
  {
    icon: Calendar,
    title: "Réservez",
    description: "Confirmez les dates de location et organisez la remise des clés avec le propriétaire.",
  },
  {
    icon: Car,
    title: "Profitez",
    description: "Récupérez le véhicule et profitez de votre location en toute tranquillité.",
  },
]

export default function HowItWorks() {
  return (
    <section className="py-12 bg-muted">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Comment ça marche</h2>
            <p className="text-muted-foreground md:text-xl mx-auto max-w-[700px]">
              Louer une voiture n'a jamais été aussi simple
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div
                    className={cn("flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400")}
                  >
                    <step.icon className="h-8 w-8" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-border -translate-y-1/2" />
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
