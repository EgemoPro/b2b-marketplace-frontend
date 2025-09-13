"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetAdminStatsQuery } from "@/lib/api/admin"
import { Users, Package, CreditCard, TrendingUp, AlertTriangle, CheckCircle, Clock, DollarSign } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
}: {
  title: string
  value: string | number
  icon: any
  trend?: number
  color?: string
}) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}-600`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend !== undefined && (
          <p className={`text-xs ${trend >= 0 ? "text-green-600" : "text-red-600"} flex items-center gap-1`}>
            <TrendingUp className="h-3 w-3" />
            {trend >= 0 ? "+" : ""}
            {trend}% ce mois
          </p>
        )}
      </CardContent>
    </Card>
  </motion.div>
)

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStatsQuery()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord Admin</h1>
          <p className="text-muted-foreground">Vue d'ensemble de la plateforme</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold">Tableau de bord Admin</h1>
        <p className="text-muted-foreground">Vue d'ensemble de la plateforme</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Utilisateurs totaux"
          value={stats?.totalUsers || 0}
          icon={Users}
          trend={stats?.monthlyGrowth}
          color="blue"
        />
        <StatCard title="Services actifs" value={stats?.totalServices || 0} icon={Package} color="green" />
        <StatCard title="Transactions" value={stats?.totalTransactions || 0} icon={CreditCard} color="purple" />
        <StatCard title="Revenus totaux" value={`${stats?.totalRevenue || 0} CFA`} icon={DollarSign} color="orange" />
        <StatCard title="Utilisateurs actifs" value={stats?.activeUsers || 0} icon={CheckCircle} color="green" />
        <StatCard
          title="Vérifications en attente"
          value={stats?.pendingVerifications || 0}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Transactions disputées"
          value={stats?.disputedTransactions || 0}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard title="Croissance mensuelle" value={`${stats?.monthlyGrowth || 0}%`} icon={TrendingUp} color="blue" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <a
                  href="/admin/users"
                  className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <Users className="h-4 w-4" />
                  Gérer les utilisateurs
                </a>
                <a
                  href="/admin/services"
                  className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <Package className="h-4 w-4" />
                  Modérer les services
                </a>
                <a
                  href="/admin/transactions"
                  className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <CreditCard className="h-4 w-4" />
                  Gérer les transactions
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Alertes système</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.pendingVerifications && stats.pendingVerifications > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">{stats.pendingVerifications} vérifications en attente</span>
                  </div>
                )}
                {stats?.disputedTransactions && stats.disputedTransactions > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">{stats.disputedTransactions} transactions disputées</span>
                  </div>
                )}
                {(!stats?.pendingVerifications || stats.pendingVerifications === 0) &&
                  (!stats?.disputedTransactions || stats.disputedTransactions === 0) && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Aucune alerte système</span>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
