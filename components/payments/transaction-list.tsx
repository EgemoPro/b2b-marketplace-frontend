"use client"

import { useState } from "react"
import { useGetTransactionHistoryQuery } from "@/lib/api/payments"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpRight, ArrowDownLeft, Search, Download, Clock, CheckCircle, XCircle } from "lucide-react"
import { motion } from "framer-motion"
import type { Transaction } from "@/lib/api/payments"

export function TransactionList() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const { data, isLoading } = useGetTransactionHistoryQuery({ page, limit: 10 })

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === "CFA") {
      return `${amount.toLocaleString("fr-FR")} CFA`
    }

    const formatter = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    })

    return formatter.format(amount)
  }

  const getStatusBadge = (status: Transaction["status"]) => {
    const statusConfig = {
      completed: { label: "Terminé", variant: "default" as const, icon: CheckCircle },
      pending: { label: "En attente", variant: "secondary" as const, icon: Clock },
      processing: { label: "En cours", variant: "secondary" as const, icon: Clock },
      failed: { label: "Échoué", variant: "destructive" as const, icon: XCircle },
      cancelled: { label: "Annulé", variant: "outline" as const, icon: XCircle },
    }

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getTransactionIcon = (type: Transaction["type"], fromUserId: string, currentUserId: string) => {
    const isIncoming = fromUserId !== currentUserId

    if (type === "refund") {
      return <ArrowDownLeft className="w-4 h-4 text-orange-600" />
    }

    return isIncoming ? (
      <ArrowDownLeft className="w-4 h-4 text-green-600" />
    ) : (
      <ArrowUpRight className="w-4 h-4 text-red-600" />
    )
  }

  const filteredTransactions =
    data?.transactions.filter((transaction) => {
      const matchesSearch =
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.fromUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.toUserName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
      const matchesType = typeFilter === "all" || transaction.type === typeFilter

      return matchesSearch && matchesStatus && matchesType
    }) || []

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-muted rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Historique des transactions</CardTitle>
            <CardDescription>Toutes vos transactions et paiements</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une transaction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="processing">En cours</SelectItem>
              <SelectItem value="failed">Échoué</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="payment">Paiement</SelectItem>
              <SelectItem value="refund">Remboursement</SelectItem>
              <SelectItem value="escrow_release">Libération séquestre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucune transaction trouvée</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  {getTransactionIcon(transaction.type, transaction.fromUserId, "current-user-id")}
                </div>

                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {(transaction.fromUserId === "current-user-id"
                      ? transaction.toUserName
                      : transaction.fromUserName
                    ).charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground truncate">{transaction.description}</h4>
                    <div className="text-right">
                      <div
                        className={`font-semibold ${
                          transaction.fromUserId === "current-user-id" ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {transaction.fromUserId === "current-user-id" ? "-" : "+"}
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-muted-foreground">
                      {transaction.fromUserId === "current-user-id" ? "Vers" : "De"}{" "}
                      {transaction.fromUserId === "current-user-id" ? transaction.toUserName : transaction.fromUserName}
                    </p>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(transaction.status)}
                      <span className="text-xs text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Pagination */}
            {data && data.total > 10 && (
              <div className="flex justify-center space-x-2 pt-4">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                  Précédent
                </Button>
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  Page {page} sur {Math.ceil(data.total / 10)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= Math.ceil(data.total / 10)}
                  onClick={() => setPage(page + 1)}
                >
                  Suivant
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
