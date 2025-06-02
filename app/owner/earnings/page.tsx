"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock earnings data
const mockEarnings = {
  monthly: 1245,
  yearly: 15420,
  pending: 485,
  history: [
    { month: "Jan", amount: 1100 },
    { month: "Feb", amount: 1200 },
    { month: "Mar", amount: 900 },
    { month: "Apr", amount: 1500 },
    { month: "May", amount: 1300 },
    { month: "Jun", amount: 1245 },
  ]
};

// Mock payments data
const mockPayments = [
  {
    id: "PMT-001",
    date: new Date(2023, 5, 15),
    car: "Renault Clio",
    client: "Jean Dupont",
    amount: 225,
    status: "completed"
  },
  {
    id: "PMT-002",
    date: new Date(2023, 5, 22),
    car: "BMW Series 3",
    client: "Marie Martin",
    amount: 260,
    status: "completed"
  },
  {
    id: "PMT-003",
    date: new Date(2023, 6, 5),
    car: "Tesla Model 3",
    client: "Philippe Leclerc",
    amount: 225,
    status: "pending"
  },
  {
    id: "PMT-004",
    date: new Date(2023, 6, 12),
    car: "Peugeot 3008",
    client: "Sophie Dubois",
    amount: 180,
    status: "pending"
  }
];

export default function EarningsPage() {
  const { user } = useAuth()
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly")
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Earnings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{mockEarnings.monthly}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Yearly Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{mockEarnings.yearly}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{mockEarnings.pending}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="history">Billing History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Earnings History</CardTitle>
              <CardDescription>Your earnings over time</CardDescription>
              <div className="flex space-x-2 mt-2">
                <Button 
                  variant={period === "monthly" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setPeriod("monthly")}
                >
                  Monthly
                </Button>
                <Button 
                  variant={period === "yearly" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setPeriod("yearly")}
                >
                  Yearly
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={mockEarnings.history}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`€${value}`, 'Amount']} />
                    <Area type="monotone" dataKey="amount" stroke="#f43f5e" fill="#fecdd3" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Payments received for your car rentals</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Car</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.date.toLocaleDateString()}</TableCell>
                      <TableCell>{payment.car}</TableCell>
                      <TableCell>{payment.client}</TableCell>
                      <TableCell>€{payment.amount}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.status === "completed" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {payment.status === "completed" ? "Paid" : "Pending"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Your subscription billing history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button variant="outline" size="sm" asChild>
                  <a href="/owner/billing-history">View Complete Billing History</a>
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>01/06/2023</TableCell>
                    <TableCell>Abonnement Standard (Mensuel)</TableCell>
                    <TableCell>€19.99</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Payé
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>01/05/2023</TableCell>
                    <TableCell>Abonnement Standard (Mensuel)</TableCell>
                    <TableCell>€19.99</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Payé
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 