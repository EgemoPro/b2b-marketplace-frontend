"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useGetAdminStatsQuery } from "@/lib/api/admin"
import {
  Users,
  Package,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Shield,
  Activity,
  Globe,
  Server,
  Settings,
  Eye,
  UserCheck,
  Ban,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStatsQuery()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 p-8">
          <Skeleton className="h-8 w-64 bg-white/20" />
          <Skeleton className="h-4 w-48 mt-2 bg-white/10" />
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

  const mainStats = [
    {
      title: "Utilisateurs totaux",
      value: stats?.totalUsers || 1247,
      change: stats?.monthlyGrowth || 12,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      lightBg: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Services actifs",
      value: stats?.totalServices || 856,
      change: 8,
      icon: Package,
      color: "from-emerald-500 to-emerald-600",
      lightBg: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Transactions",
      value: stats?.totalTransactions || 3421,
      change: 15,
      icon: CreditCard,
      color: "from-purple-500 to-purple-600",
      lightBg: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Revenus totaux",
      value: `${((stats?.totalRevenue || 125000000) / 1000000).toFixed(1)}M CFA`,
      change: 23,
      icon: DollarSign,
      color: "from-amber-500 to-amber-600",
      lightBg: "bg-amber-50",
      textColor: "text-amber-600",
    },
  ]

  const secondaryStats = [
    {
      title: "Utilisateurs actifs",
      value: stats?.activeUsers || 892,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Vérifications en attente",
      value: stats?.pendingVerifications || 23,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Litiges en cours",
      value: stats?.disputedTransactions || 5,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    { title: "Taux de conversion", value: "68%", icon: TrendingUp, color: "text-blue-600", bgColor: "bg-blue-50" },
  ]

  const systemHealth = [
    { name: "API Response", value: 98, status: "healthy" },
    { name: "Database", value: 100, status: "healthy" },
    { name: "Storage", value: 72, status: "warning" },
    { name: "Queue", value: 95, status: "healthy" },
  ]

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Console d'Administration</h1>
              <p className="text-slate-400 mt-1">AfriMarket B2B - Vue d'ensemble système</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Activity className="w-3 h-3 mr-1 animate-pulse" />
              Système opérationnel
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Globe className="w-3 h-3 mr-1" />5 régions actives
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-xl ${stat.lightBg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center mt-2">
                  {stat.change >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${stat.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {stat.change >= 0 ? "+" : ""}
                    {stat.change}% ce mois
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {secondaryStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
          >
            <Card className="border-slate-200">
              <CardContent className="p-4 flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-slate-700">
                <Server className="w-5 h-5 mr-2" />
                Santé du système
              </CardTitle>
              <CardDescription>Performance en temps réel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemHealth.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{item.value}%</span>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item.status === "healthy"
                            ? "bg-green-500"
                            : item.status === "warning"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                    </div>
                  </div>
                  <Progress
                    value={item.value}
                    className={`h-2 ${
                      item.status === "healthy"
                        ? "[&>div]:bg-green-500"
                        : item.status === "warning"
                          ? "[&>div]:bg-yellow-500"
                          : "[&>div]:bg-red-500"
                    }`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-slate-700">
                <Zap className="w-5 h-5 mr-2" />
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/users">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Gérer les utilisateurs
                </Button>
              </Link>
              <Link href="/admin/services">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Modérer les services
                </Button>
              </Link>
              <Link href="/admin/transactions">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Gérer les transactions
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres système
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-slate-700">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Alertes système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats?.pendingVerifications && stats.pendingVerifications > 0 && (
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800">{stats.pendingVerifications} vérifications</p>
                    <p className="text-xs text-yellow-600">En attente de validation</p>
                  </div>
                  <Link href="/admin/users?filter=pending">
                    <Button size="sm" variant="ghost" className="text-yellow-700 hover:bg-yellow-100">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              )}
              {stats?.disputedTransactions && stats.disputedTransactions > 0 && (
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <Ban className="h-5 w-5 text-red-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">{stats.disputedTransactions} litiges</p>
                    <p className="text-xs text-red-600">Nécessitent une intervention</p>
                  </div>
                  <Link href="/admin/transactions?filter=disputed">
                    <Button size="sm" variant="ghost" className="text-red-700 hover:bg-red-100">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              )}
              {(!stats?.pendingVerifications || stats.pendingVerifications === 0) &&
                (!stats?.disputedTransactions || stats.disputedTransactions === 0) && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Tout est en ordre</p>
                      <p className="text-xs text-green-600">Aucune alerte système</p>
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
