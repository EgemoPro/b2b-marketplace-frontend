"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetTransactionsQuery, useResolveDisputeMutation } from "@/lib/api/admin"
import { MoreHorizontal, CheckCircle, XCircle, DollarSign } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  disputed: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
}

const escrowColors = {
  held: "bg-blue-100 text-blue-800",
  released: "bg-green-100 text-green-800",
  disputed: "bg-red-100 text-red-800",
}

export default function AdminTransactions() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("all")

  const { data, isLoading } = useGetTransactionsQuery({
    page,
    limit: 10,
    status: statusFilter === "all" ? undefined : statusFilter,
  })

  const [resolveDispute] = useResolveDisputeMutation()

  const handleResolveDispute = async (transactionId: string, resolution: "refund" | "release") => {
    try {
      await resolveDispute({ transactionId, resolution }).unwrap()
      toast({
        title: "Litige résolu",
        description: `Le litige a été résolu avec ${resolution === "refund" ? "un remboursement" : "une libération des fonds"}.`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de résoudre le litige.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold">Gestion des transactions</h1>
        <p className="text-muted-foreground">Gérez les transactions et résolvez les litiges</p>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="disputed">Disputé</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transactions ({data?.total || 0})</CardTitle>
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
              {data?.transactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        {transaction.amount} {transaction.currency}
                      </h3>
                      <Badge className={statusColors[transaction.status]}>
                        {transaction.status === "pending"
                          ? "En attente"
                          : transaction.status === "completed"
                            ? "Terminé"
                            : transaction.status === "disputed"
                              ? "Disputé"
                              : "Annulé"}
                      </Badge>
                      <Badge className={escrowColors[transaction.escrowStatus]}>
                        Escrow:{" "}
                        {transaction.escrowStatus === "held"
                          ? "Retenu"
                          : transaction.escrowStatus === "released"
                            ? "Libéré"
                            : "Disputé"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        <strong>Service:</strong> {transaction.service.title}
                      </p>
                      <p>
                        <strong>Client:</strong> {transaction.client.name} ({transaction.client.company})
                      </p>
                      <p>
                        <strong>Fournisseur:</strong> {transaction.provider.name} ({transaction.provider.company})
                      </p>
                      <p>
                        <strong>Date:</strong> {new Date(transaction.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  {transaction.status === "disputed" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleResolveDispute(transaction.id, "release")}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Libérer les fonds
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleResolveDispute(transaction.id, "refund")}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Rembourser le client
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
