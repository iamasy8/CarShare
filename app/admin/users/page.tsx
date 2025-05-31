"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Check, ChevronDown, Edit, Eye, MoreHorizontal, Search, Shield, Trash, User, X } from "lucide-react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { cn, handleError, formatDate, useRealApi } from "@/lib/utils"

// Mock data for users
const users = [
  {
    id: "user-001",
    name: "Sophie Martin",
    email: "sophie.martin@example.com",
    role: "client",
    status: "active",
    verified: true,
    registeredAt: "2023-01-15",
    lastLogin: "2023-06-10",
  },
  {
    id: "user-002",
    name: "Thomas Dubois",
    email: "thomas.dubois@example.com",
    role: "owner",
    status: "active",
    verified: true,
    registeredAt: "2023-02-20",
    lastLogin: "2023-06-08",
  },
  {
    id: "user-003",
    name: "Julie Lefèvre",
    email: "julie.lefevre@example.com",
    role: "client",
    status: "active",
    verified: true,
    registeredAt: "2023-03-05",
    lastLogin: "2023-06-05",
  },
  {
    id: "user-004",
    name: "Alexandre Chen",
    email: "alexandre.chen@example.com",
    role: "owner",
    status: "pending",
    verified: false,
    registeredAt: "2023-06-01",
    lastLogin: "2023-06-01",
  },
  {
    id: "user-005",
    name: "Marie Petit",
    email: "marie.petit@example.com",
    role: "client",
    status: "suspended",
    verified: true,
    registeredAt: "2023-04-10",
    lastLogin: "2023-05-15",
  },
  {
    id: "user-006",
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    role: "admin",
    status: "active",
    verified: true,
    registeredAt: "2022-12-01",
    lastLogin: "2023-06-09",
  },
]

export default function AdminUsersPage() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [openDialog, setOpenDialog] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Filter users based on selected tab and search query
  const filteredUsers = users
    .filter((user) => {
      if (selectedTab === "all") return true
      if (selectedTab === "clients") return user.role === "client"
      if (selectedTab === "owners") return user.role === "owner"
      if (selectedTab === "admins") return user.role === "admin"
      if (selectedTab === "pending") return user.status === "pending"
      if (selectedTab === "suspended") return user.status === "suspended"
      return true
    })
    .filter((user) => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query)
      )
    })

  // Mock handler for user verification
  const handleVerifyUser = async (userId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // In production this would be an API call
      // await userService.verifyUser(userId)
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update local state
      // This would normally be a refresh API call
      
      setLoading(false)
    } catch (err) {
      const errorMessage = handleError(err, "Failed to verify user")
      setError(errorMessage)
      setLoading(false)
    }
  }

  // Mock handler for user suspension
  const handleSuspendUser = async (userId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // In production this would be an API call
      // await userService.suspendUser(userId)
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update local state
      // This would normally be a refresh API call
      
      setLoading(false)
    } catch (err) {
      const errorMessage = handleError(err, "Failed to suspend user")
      setError(errorMessage)
      setLoading(false)
    }
  }

  // Get role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "client":
        return <Badge className="bg-blue-600">Client</Badge>
      case "owner":
        return <Badge className="bg-red-600">Propriétaire</Badge>
      case "admin":
        return <Badge className="bg-purple-600">Admin</Badge>
      default:
        return <Badge>Inconnu</Badge>
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">Actif</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">En attente</Badge>
      case "suspended":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Suspendu
          </Badge>
        )
      default:
        return <Badge>Inconnu</Badge>
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      setError("")
      
      try {
        if (useRealApi()) {
          // In production, use the actual API
          const userData = await userService.getUsers()
          setUsers(userData)
        } else {
          // For development, use mock data
          setUsers(users)
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      } catch (err) {
        console.error("Error fetching users:", err)
        setError("Failed to load user data")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUsers()
  }, [])

  return (
    <div className="md:pl-64">
      <AdminSidebar />

      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gestion des utilisateurs</h1>
          <p className="text-gray-500 dark:text-gray-400">Consultez et gérez tous les utilisateurs de la plateforme</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Rechercher un utilisateur..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
            >
              <Check className="mr-2 h-4 w-4" />
              Vérifier la sélection
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              <User className="mr-2 h-4 w-4" />
              Ajouter un utilisateur
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="owners">Propriétaires</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="suspended">Suspendus</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab}>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Liste des utilisateurs</CardTitle>
                    <CardDescription>
                      {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? "s" : ""} trouvé
                      {filteredUsers.length > 1 ? "s" : ""}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                      >
                        Exporter <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Options d'export</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Exporter en CSV</DropdownMenuItem>
                      <DropdownMenuItem>Exporter en Excel</DropdownMenuItem>
                      <DropdownMenuItem>Exporter en PDF</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Vérifié</TableHead>
                      <TableHead>Inscription</TableHead>
                      <TableHead>Dernière connexion</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500 dark:text-gray-400">
                          Aucun utilisateur trouvé
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <input type="checkbox" className="rounded border-gray-300" />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${user.name.charAt(0)}`} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>
                            {user.verified ? (
                              <Check className="h-5 w-5 text-green-600" />
                            ) : (
                              <X className="h-5 w-5 text-red-600" />
                            )}
                          </TableCell>
                          <TableCell>{formatDate(user.registeredAt)}</TableCell>
                          <TableCell>{formatDate(user.lastLogin)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Voir le profil
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                {user.status === "pending" && (
                                  <DropdownMenuItem onClick={() => handleVerifyUser(user.id)}>
                                    <Check className="mr-2 h-4 w-4" />
                                    Vérifier
                                  </DropdownMenuItem>
                                )}
                                {user.status === "active" && (
                                  <DropdownMenuItem onClick={() => handleSuspendUser(user.id)}>
                                    <X className="mr-2 h-4 w-4" />
                                    Suspendre
                                  </DropdownMenuItem>
                                )}
                                {user.status === "suspended" && (
                                  <DropdownMenuItem>
                                    <Check className="mr-2 h-4 w-4" />
                                    Réactiver
                                  </DropdownMenuItem>
                                )}
                                {user.role !== "admin" && (
                                  <DropdownMenuItem>
                                    <Shield className="mr-2 h-4 w-4" />
                                    Promouvoir admin
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <Dialog
                                  open={openDialog === user.id}
                                  onOpenChange={(open) => setOpenDialog(open ? user.id : null)}
                                >
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                                      <Trash className="mr-2 h-4 w-4" />
                                      Supprimer
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Supprimer l'utilisateur</DialogTitle>
                                      <DialogDescription>
                                        Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est
                                        irréversible.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => setOpenDialog(null)}>
                                        Annuler
                                      </Button>
                                      <Button variant="destructive">Confirmer la suppression</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
