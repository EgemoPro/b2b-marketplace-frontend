"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetServicesQuery, useUpdateServiceStatusMutation } from "@/lib/api/admin"
import { Search, MoreHorizontal, CheckCircle, XCircle, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
}

export default function AdminServices() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const { data, isLoading } = useGetServicesQuery({
    page,
    limit: 10,
    search: search || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
  })

  const [updateServiceStatus] = useUpdateServiceStatusMutation()

  const handleStatusUpdate = async (serviceId: string, status: string) => {
    try {
      await updateServiceStatus({ serviceId, status }).unwrap()
      toast({
        title: "Statut mis à jour",
        description: "Le statut du service a été modifié avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold">Modération des services</h1>
        <p className="text-muted-foreground">Gérez et modérez les services de la plateforme</p>
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
                placeholder="Rechercher par titre ou fournisseur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="rejected">Rejeté</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Services ({data?.total || 0})</CardTitle>
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
              {data?.services.map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{service.title}</h3>
                      <Badge className={statusColors[service.status]}>
                        {service.status === "active"
                          ? "Actif"
                          : service.status === "inactive"
                            ? "Inactif"
                            : service.status === "pending"
                              ? "En attente"
                              : "Rejeté"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        <strong>Fournisseur:</strong> {service.provider.name} ({service.provider.company})
                      </p>
                      <p>
                        <strong>Catégorie:</strong> {service.category}
                      </p>
                      <p>
                        <strong>Prix:</strong> {service.price} {service.currency}
                      </p>
                      <p>
                        <strong>Créé le:</strong> {new Date(service.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {service.views} vues
                        </span>
                        <span>{service.orders} commandes</span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {service.status === "pending" && (
                        <>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(service.id, "active")}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approuver
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(service.id, "rejected")}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Rejeter
                          </DropdownMenuItem>
                        </>
                      )}
                      {service.status === "active" && (
                        <DropdownMenuItem onClick={() => handleStatusUpdate(service.id, "inactive")}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Désactiver
                        </DropdownMenuItem>
                      )}
                      {service.status === "inactive" && (
                        <DropdownMenuItem onClick={() => handleStatusUpdate(service.id, "active")}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Réactiver
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
