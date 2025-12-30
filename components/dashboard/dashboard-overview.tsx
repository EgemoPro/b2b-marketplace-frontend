"use client"

import { useAppSelector } from "@/lib/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Package,
  FileText,
  MessageSquare,
  CreditCard,
  Users,
  Clock,
  Plus,
  ArrowRight,
  BarChart3,
  Building2,
  User,
  Wallet,
  ShoppingCart,
  Heart,
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

function IndividualDashboard({ user }: { user: any }) {
  const stats = [
    {
      title: "Services consultés",
      value: "28",
      change: "+5 cette semaine",
      icon: Package,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Demandes envoyées",
      value: "6",
      change: "+2 ce mois",
      icon: FileText,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      title: "Messages",
      value: "12",
      change: "3 non lus",
      icon: MessageSquare,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      title: "Budget dépensé",
      value: "450,000 CFA",
      change: "Ce mois",
      icon: Wallet,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ]

  const favoriteServices = [
    { name: "Développement Web", provider: "TechPro Solutions", price: "250,000 CFA" },
    { name: "Design Graphique", provider: "CreativeHub", price: "150,000 CFA" },
    { name: "Consulting Business", provider: "BizAdvisors", price: "300,000 CFA" },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section - Individual Style */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6 md:p-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Bonjour, {user?.firstName || user?.companyName}
              </h1>
              <p className="text-white/80 mt-1">Trouvez les meilleurs services pour vos besoins</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <User className="w-3 h-3 mr-1" />
              Compte Personnel
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="border-l-4 border-l-emerald-500">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Favorite Services */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-emerald-700">
              <Heart className="w-5 h-5 mr-2" />
              Services favoris
            </CardTitle>
            <CardDescription>Vos services sauvegardés pour plus tard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {favoriteServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100"
              >
                <div>
                  <p className="font-medium text-foreground">{service.name}</p>
                  <p className="text-sm text-muted-foreground">{service.provider}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-600">{service.price}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                  >
                    Contacter
                  </Button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-emerald-700">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/services">
              <Button
                variant="outline"
                className="w-full justify-start bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Explorer les services
              </Button>
            </Link>
            <Link href="/dashboard/requests/create">
              <Button
                variant="outline"
                className="w-full justify-start bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100"
              >
                <FileText className="w-4 h-4 mr-2" />
                Publier une demande
              </Button>
            </Link>
            <Link href="/dashboard/messages">
              <Button
                variant="outline"
                className="w-full justify-start bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Mes conversations
              </Button>
            </Link>
            <Link href="/companies">
              <Button
                variant="outline"
                className="w-full justify-start bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
              >
                <Users className="w-4 h-4 mr-2" />
                Annuaire entreprises
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CompanyDashboard({ user }: { user: any }) {
  const isSupplier = user?.role === "supplier"

  const supplierStats = [
    {
      title: "Services actifs",
      value: "12",
      change: "+2 ce mois",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Demandes reçues",
      value: "8",
      change: "+3 cette semaine",
      icon: FileText,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Messages non lus",
      value: "5",
      change: "2 nouveaux",
      icon: MessageSquare,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Revenus ce mois",
      value: "2,450,000 CFA",
      change: "+15%",
      icon: CreditCard,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  const clientStats = [
    {
      title: "Fournisseurs actifs",
      value: "8",
      change: "+1 ce mois",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Commandes en cours",
      value: "5",
      change: "2 en livraison",
      icon: Package,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Messages",
      value: "12",
      change: "4 non lus",
      icon: MessageSquare,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Budget mensuel",
      value: "1,850,000 CFA",
      change: "72% utilisé",
      icon: Wallet,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  const stats = isSupplier ? supplierStats : clientStats

  const recentActivities = [
    {
      type: "request",
      title: isSupplier ? "Nouvelle demande reçue" : "Proposition acceptée",
      company: "TechCorp SARL",
      time: "Il y a 2h",
      status: "pending",
    },
    {
      type: "message",
      title: "Message de DataSolutions",
      company: "DataSolutions",
      time: "Il y a 4h",
      status: "unread",
    },
    {
      type: "payment",
      title: isSupplier ? "Paiement reçu - 850,000 CFA" : "Facture payée - 850,000 CFA",
      company: "InnovateAfrica",
      time: "Il y a 1j",
      status: "completed",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section - Company Style */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 md:p-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{user?.companyName}</h1>
              <p className="text-white/80 mt-1">
                {isSupplier ? "Développez votre activité sur AfriMarket B2B" : "Gérez vos partenaires commerciaux"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Building2 className="w-3 h-3 mr-1" />
              Entreprise
            </Badge>
            <Badge className={`${user?.isVerified ? "bg-green-500/80" : "bg-white/20"} text-white border-white/30`}>
              {user?.isVerified ? "Vérifié" : "En attente"}
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 capitalize">
              {isSupplier ? "Fournisseur" : "Client"}
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="border-l-4 border-l-orange-500">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <Clock className="w-5 h-5 mr-2" />
              Activité récente
            </CardTitle>
            <CardDescription>Vos dernières interactions sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100"
              >
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.company} • {activity.time}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    activity.status === "completed"
                      ? "border-green-200 text-green-600 bg-green-50"
                      : activity.status === "pending"
                        ? "border-orange-200 text-orange-600 bg-orange-50"
                        : "border-amber-200 text-amber-600 bg-amber-50"
                  }`}
                >
                  {activity.status === "pending" && "En attente"}
                  {activity.status === "unread" && "Non lu"}
                  {activity.status === "completed" && "Terminé"}
                </Badge>
              </motion.div>
            ))}
            <Link href="/dashboard/notifications">
              <Button
                variant="outline"
                className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
              >
                Voir toute l'activité
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-700">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isSupplier ? (
              <>
                <Link href="/dashboard/services/create">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer un service
                  </Button>
                </Link>
                <Link href="/dashboard/requests">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Voir les demandes
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/services">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Explorer les services
                  </Button>
                </Link>
                <Link href="/dashboard/requests/create">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Publier une demande
                  </Button>
                </Link>
              </>
            )}
            <Link href="/dashboard/messages">
              <Button
                variant="outline"
                className="w-full justify-start bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </Button>
            </Link>
            <Link href="/dashboard/payments">
              <Button
                variant="outline"
                className="w-full justify-start bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Paiements
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-orange-700">
            <BarChart3 className="w-5 h-5 mr-2" />
            Aperçu des performances
          </CardTitle>
          <CardDescription>Votre progression ce mois-ci</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Taux de réponse</span>
                <span className="text-sm text-orange-600 font-semibold">85%</span>
              </div>
              <Progress value={85} className="h-2 [&>div]:bg-orange-500" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Satisfaction</span>
                <span className="text-sm text-amber-600 font-semibold">4.8/5</span>
              </div>
              <Progress value={96} className="h-2 [&>div]:bg-amber-500" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Objectif mensuel</span>
                <span className="text-sm text-yellow-600 font-semibold">72%</span>
              </div>
              <Progress value={72} className="h-2 [&>div]:bg-yellow-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function DashboardOverview() {
  const { user } = useAppSelector((state) => state.auth)

  // Determine account type - default to company for backward compatibility
  const accountType = user?.accountType || "company"

  return (
    <AnimatePresence mode="wait">
      {accountType === "individual" ? (
        <motion.div key="individual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <IndividualDashboard user={user} />
        </motion.div>
      ) : (
        <motion.div key="company" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <CompanyDashboard user={user} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
