"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetUsersQuery, useUpdateUserStatusMutation, useVerifyUserMutation } from "@/lib/api/admin"
import { Search, MoreHorizontal, CheckCircle, XCircle, Shield } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"

const statusColors = {
  active: "bg-green-100 text-green-800",
  suspended: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
}

const roleColors = {
  client: "bg-blue-100 text-blue-800",
  provider: "bg-purple-100 text-purple-800",
  admin: "bg-orange-100 text-orange-800",
}

export default function AdminUsers() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const { data, isLoading } = useGetUsersQuery({
    page,
    limit: 10,
    search: search || undefined,
    role: roleFilter === "all" ? undefined : roleFilter,
    status: statusFilter === "all" ? undefined : statusFilter,
  })

  const [updateUserStatus] = useUpdateUserStatusMutation()
  const [verifyUser] = useVerifyUserMutation()

  const handleStatusUpdate = async (userId: string, status: string) => {
    try {
      await updateUserStatus({ userId, status }).unwrap()
      toast({
        title: "Statut mis à jour",
        description: "Le statut de l'utilisateur a été modifié avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive",
      })
    }
  }

  const handleVerifyUser = async (userId: string) => {
    try {
      await verifyUser({ userId }).unwrap()
      toast({
        title: "Utilisateur vérifié",
        description: "L'utilisateur a été vérifié avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de vérifier l'utilisateur.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
        <p className="text-muted-foreground">Gérez les comptes utilisateurs de la plateforme</p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres et recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email ou entreprise..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="provider">Fournisseur</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs ({data?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {data?.users.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">
                        {user.firstName} {user.lastName}
                      </h3>
                      {user.verified && <CheckCircle className="h-4 w-4 text-green-600" />}
                      <Badge className={roleColors[user.role]}>
                        {user.role === "client" ? "Client" : user.role === "provider" ? "Fournisseur" : "Admin"}
                      </Badge>
                      <Badge className={statusColors[user.status]}>
                        {user.status === "active" ? "Actif" : user.status === "suspended" ? "Suspendu" : "En attente"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{user.email}</p>
                      <p>{user.company}</p>
                      <p>Inscrit le {new Date(user.createdAt).toLocaleDateString("fr-FR")}</p>
                      <p>Dernière connexion: {new Date(user.lastLogin).toLocaleDateString("fr-FR")}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!user.verified && (
                        <DropdownMenuItem onClick={() => handleVerifyUser(user.id)}>
                          <Shield className="h-4 w-4 mr-2" />
                          Vérifier
                        </DropdownMenuItem>
                      )}
                      {user.status === "active" && (
                        <DropdownMenuItem onClick={() => handleStatusUpdate(user.id, "suspended")}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Suspendre
                        </DropdownMenuItem>
                      )}
                      {user.status === "suspended" && (
                        <DropdownMenuItem onClick={() => handleStatusUpdate(user.id, "active")}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Réactiver
                        </DropdownMenuItem>
                      )}
                      {user.status === "pending" && (
                        <DropdownMenuItem onClick={() => handleStatusUpdate(user.id, "active")}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approuver
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
