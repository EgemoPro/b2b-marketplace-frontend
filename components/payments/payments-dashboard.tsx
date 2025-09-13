"use client"

import { useState } from "react"
import { useGetTransactionHistoryQuery, useGetEscrowPaymentsQuery, useGetPaymentStatsQuery } from "@/lib/api/payments"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionList } from "./transaction-list"
import { EscrowManager } from "./escrow-manager"
import { PaymentModal } from "./payment-modal"
import { CreditCard, TrendingUp, Clock, Shield, Plus, Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { motion } from "framer-motion"

export function PaymentsDashboard() {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const { data: stats } = useGetPaymentStatsQuery()
  const { data: transactionData } = useGetTransactionHistoryQuery({ page: 1, limit: 5 })
  const { data: escrowPayments } = useGetEscrowPaymentsQuery()

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

  const statsCards = [
    {
      title: "Revenus totaux",
      value: stats ? formatCurrency(stats.totalEarnings, stats.currency) : "0 CFA",
      change: "+12% ce mois",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Dépenses totales",
      value: stats ? formatCurrency(stats.totalSpent, stats.currency) : "0 CFA",
      change: "+5% ce mois",
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Fonds en séquestre",
      value: stats ? formatCurrency(stats.pendingEscrow, stats.currency) : "0 CFA",
      change: `${escrowPayments?.length || 0} paiements`,
      icon: Shield,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Transactions ce mois",
      value: transactionData?.total.toString() || "0",
      change: "Toutes réussies",
      icon: Wallet,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <CreditCard className="w-8 h-8 mr-3" />
            Paiements
          </h1>
          <p className="text-muted-foreground mt-2">Gérez vos transactions et paiements sécurisés</p>
        </div>
        <Button onClick={() => setShowPaymentModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau paiement
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="escrow">Séquestre</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          <TransactionList />
        </TabsContent>

        <TabsContent value="escrow" className="space-y-6">
          <EscrowManager />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Évolution des revenus
                </CardTitle>
                <CardDescription>Revenus des 6 derniers mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Graphique des revenus (à implémenter avec Recharts)
                </div>
              </CardContent>
            </Card>

            {/* Transaction Types */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition des transactions</CardTitle>
                <CardDescription>Types de transactions ce mois</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Revenus</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">75%</div>
                    <div className="text-xs text-muted-foreground">24 transactions</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ArrowDownLeft className="w-4 h-4 text-red-600" />
                    <span className="text-sm">Dépenses</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">20%</div>
                    <div className="text-xs text-muted-foreground">6 transactions</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">En attente</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">5%</div>
                    <div className="text-xs text-muted-foreground">2 transactions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Payment Modal */}
      <PaymentModal open={showPaymentModal} onOpenChange={setShowPaymentModal} />
    </div>
  )
}
