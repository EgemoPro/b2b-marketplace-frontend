"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, Filter, MoreHorizontal, Edit, Eye, Trash2, TrendingUp, Users, DollarSign } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

export default function MyServicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data - replace with actual API call
  const services = [
    {
      id: "1",
      title: "Développement d'applications web",
      description: "Création d'applications web modernes avec React et Node.js",
      category: "Technologie",
      price: 500000,
      currency: "XOF",
      status: "active",
      views: 245,
      inquiries: 12,
      createdAt: "2024-01-15",
      image: "/web-development-concept.png",
    },
    {
      id: "2",
      title: "Consultation en transformation digitale",
      description: "Accompagnement des entreprises dans leur transformation digitale",
      category: "Conseil",
      price: 150000,
      currency: "XOF",
      status: "draft",
      views: 0,
      inquiries: 0,
      createdAt: "2024-01-20",
      image: "/digital-transformation-concept.png",
    },
    {
      id: "3",
      title: "Formation en cybersécurité",
      description: "Formation complète sur les bonnes pratiques de cybersécurité",
      category: "Formation",
      price: 75000,
      currency: "XOF",
      status: "paused",
      views: 89,
      inquiries: 3,
      createdAt: "2024-01-10",
      image: "/cybersecurity-training.jpg",
    },
  ]

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || service.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>
      case "draft":
        return <Badge variant="secondary">Brouillon</Badge>
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">En pause</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleDelete = (serviceId: string) => {
    toast({
      title: "Service supprimé",
      description: "Le service a été supprimé avec succès.",
    })
  }

  const totalViews = services.reduce((sum, service) => sum + service.views, 0)
  const totalInquiries = services.reduce((sum, service) => sum + service.inquiries, 0)
  const activeServices = services.filter((s) => s.status === "active").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mes Services</h1>
          <p className="text-muted-foreground">Gérez vos services et offres commerciales</p>
        </div>
        <Link href="/dashboard/services/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau service
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services actifs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeServices}</div>
            <p className="text-xs text-muted-foreground">+2 ce mois-ci</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vues totales</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">+12% par rapport au mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demandes reçues</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInquiries}</div>
            <p className="text-xs text-muted-foreground">+3 cette semaine</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="draft">Brouillon</SelectItem>
            <SelectItem value="paused">En pause</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">{getStatusBadge(service.status)}</div>
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{service.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">{service.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/services/${service.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        Voir
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/services/${service.id}/edit`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(service.id)} className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">
                    {service.price.toLocaleString()} {service.currency}
                  </span>
                </div>
                <Badge variant="outline">{service.category}</Badge>
              </div>
              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <span>{service.views} vues</span>
                <span>{service.inquiries} demandes</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== "all"
              ? "Aucun service ne correspond à vos critères"
              : "Vous n'avez pas encore de services"}
          </div>
          {!searchTerm && statusFilter === "all" && (
            <Link href="/dashboard/services/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Créer votre premier service
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
