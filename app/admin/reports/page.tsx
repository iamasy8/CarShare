"use client"

import React from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShieldAlert, Filter, RefreshCw } from "lucide-react"

export default function AdminReportsPage() {
  const { user } = useAuth()
  
  // Mock reports data - in a real app, this would come from an API
  const reports = [
    { id: 1, type: "Utilisateur", reportedBy: "client@example.com", subject: "Comportement inapproprié", status: "En attente", date: "2025-05-20" },
    { id: 2, type: "Véhicule", reportedBy: "client2@example.com", subject: "Véhicule endommagé", status: "En attente", date: "2025-05-21" },
    { id: 3, type: "Réservation", reportedBy: "owner@example.com", subject: "Annulation tardive", status: "Résolu", date: "2025-05-19" }
  ]
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Signalements</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Signalements Récents</CardTitle>
          <CardDescription>
            Gérez les signalements effectués par les utilisateurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Liste des signalements récents</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Signalé par</TableHead>
                <TableHead>Sujet</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map(report => (
                <TableRow key={report.id}>
                  <TableCell>{report.id}</TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{report.reportedBy}</TableCell>
                  <TableCell>{report.subject}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === "Résolu" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {report.status}
                    </span>
                  </TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Voir</Button>
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
