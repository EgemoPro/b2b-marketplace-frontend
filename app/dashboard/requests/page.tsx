"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Calendar, Building, User, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetMyRequestsQuery, useGetMyProposalsQuery } from "@/lib/api/requests"
import { useAppSelector } from "@/lib/hooks"
import Link from "next/link"

export default function RequestsPage() {
  const { user } = useAppSelector((state) => state.auth)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sectorFilter, setSectorFilter] = useState("all")

  const { data: myRequests = [], isLoading: isLoadingRequests } = useGetMyRequestsQuery()
  const { data: myProposals = [], isLoading: isLoadingProposals } = useGetMyProposalsQuery()

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === "CFA") {
      return `${amount.toLocaleString()} CFA`
    }
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Ouvert"
      case "in_progress":
        return "En cours"
      case "completed":
        return "Terminé"
      case "cancelled":
        return "Annulé"
      default:
        return status
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              Demandes de Collaboration
            </h1>
            <p className="text-gray-600">Gérez vos demandes et propositions de collaboration</p>
          </div>
          {user?.role === "client" && (
            <Button asChild>
              <Link href="/dashboard/requests/create">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle demande
              </Link>
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher des demandes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="open">Ouvert</SelectItem>
              <SelectItem value="in_progress">En cours</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sectorFilter} onValueChange={setSectorFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Secteur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les secteurs</SelectItem>
              <SelectItem value="Technology">Technologie</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Consulting">Conseil</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Mes Demandes ({myRequests.length})
          </TabsTrigger>
          <TabsTrigger value="proposals" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Mes Propositions ({myProposals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          {isLoadingRequests ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : myRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande</h3>
                <p className="text-gray-500 mb-4">Vous n'avez pas encore créé de demande de collaboration.</p>
                {user?.role === "client" && (
                  <Button asChild>
                    <Link href="/dashboard/requests/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer ma première demande
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg line-clamp-2">{request.title}</CardTitle>
                        <Badge className={getStatusColor(request.status)}>{getStatusLabel(request.status)}</Badge>
                      </div>
                      <CardDescription className="line-clamp-2">{request.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Budget:</span>
                          <span className="font-medium">
                            {formatCurrency(request.budgetMin, request.currency)} -{" "}
                            {formatCurrency(request.budgetMax, request.currency)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Secteur:</span>
                          <Badge variant="outline">{request.sector}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Échéance:</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(request.deadline).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Propositions:</span>
                          <span className="font-medium">{request.proposalsCount || 0}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <Button asChild variant="outline" className="w-full bg-transparent">
                          <Link href={`/dashboard/requests/${request.id}`}>Voir les détails</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="proposals" className="space-y-4">
          {isLoadingProposals ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : myProposals.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune proposition</h3>
                <p className="text-gray-500 mb-4">Vous n'avez pas encore soumis de proposition.</p>
                <Button asChild>
                  <Link href="/dashboard/services">Parcourir les demandes</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myProposals.map((proposal, index) => (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg line-clamp-2">{proposal.requestTitle}</CardTitle>
                        <Badge className={getStatusColor(proposal.status)}>{getStatusLabel(proposal.status)}</Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        Proposition pour: {proposal.clientCompany}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Montant proposé:</span>
                          <span className="font-medium">
                            {formatCurrency(proposal.proposedAmount, proposal.currency)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Délai proposé:</span>
                          <span>{proposal.proposedDeliveryTime}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Soumise le:</span>
                          <span>{new Date(proposal.submittedAt).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <Button asChild variant="outline" className="w-full bg-transparent">
                          <Link href={`/dashboard/proposals/${proposal.id}`}>Voir les détails</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
