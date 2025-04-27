"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { subscriptionPlans } from "@/lib/subscription-plans"

// Mock billing history data
const mockBillingHistory = [
  {
    id: "INV-001",
    date: new Date(2023, 5, 1),
    amount: 19.99,
    status: "paid",
    description: "Abonnement Standard (Mensuel)",
  },
  {
    id: "INV-002",
    date: new Date(2023, 6, 1),
    amount: 19.99,
    status: "paid",
    description: "Abonnement Standard (Mensuel)",
  },
  {
    id: "INV-003",
    date: new Date(2023, 7, 1),
    amount: 19.99,
    status: "paid",
    description: "Abonnement Standard (Mensuel)",
  },
]

export default function BillingHistoryPage() {
  const { user } = useAuth()
  const currentPlan = user?.subscription ? subscriptionPlans.find((plan) => plan.id === user.subscription.tier) : null

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Historique de facturation</h1>

      {user?.subscription && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Informations de facturation</CardTitle>
            <CardDescription>Détails de votre abonnement et prochaine facturation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Plan actuel</p>
                <p className="text-lg">{currentPlan?.name || "Standard"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Montant</p>
                <p className="text-lg">
                  {user.subscription.billingPeriod === "monthly"
                    ? `${currentPlan?.monthlyPrice.toFixed(2)}€ / mois`
                    : `${currentPlan?.yearlyPrice.toFixed(2)}€ / an`}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Prochaine facturation</p>
                <p className="text-lg">{user.subscription.nextBillingDate.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Méthode de paiement</p>
                <p className="text-lg">Carte de crédit (•••• 4242)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
          <CardDescription>Vos factures et paiements précédents</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Facture</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBillingHistory.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date.toLocaleDateString()}</TableCell>
                  <TableCell>{invoice.description}</TableCell>
                  <TableCell>{invoice.amount.toFixed(2)}€</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Payé
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
