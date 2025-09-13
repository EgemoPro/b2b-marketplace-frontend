"use client"

import { useAppSelector } from "@/lib/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Package, FileText, MessageSquare, CreditCard, TrendingUp, Users, Clock, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function DashboardOverview() {
  const { user } = useAppSelector((state) => state.auth)

  const stats = [
    {
      title: "Services actifs",
      value: "12",
      change: "+2 ce mois",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Demandes reçues",
      value: "8",
      change: "+3 cette semaine",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Messages non lus",
      value: "5",
      change: "2 nouveaux",
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Revenus ce mois",
      value: "2,450,000 CFA",
      change: "+15%",
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  const recentActivities = [
    {
      type: "request",
      title: "Nouvelle demande de développement web",
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
      title: "Paiement reçu - 850,000 CFA",
      company: "InnovateAfrica",
      time: "Il y a 1j",
      status: "completed",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bonjour, {user?.companyName} 👋</h1>
          <p className="text-muted-foreground mt-2">Voici un aperçu de votre activité sur AfriMarket B2B</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Badge variant={user?.isVerified ? "default" : "secondary"}>
            {user?.isVerified ? "Compte vérifié" : "Vérification en attente"}
          </Badge>
          <Link href="/dashboard/services/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau service
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Activité récente
            </CardTitle>
            <CardDescription>Vos dernières interactions sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.company} • {activity.time}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.status === "pending" && "En attente"}
                  {activity.status === "unread" && "Non lu"}
                  {activity.status === "completed" && "Terminé"}
                </Badge>
              </div>
            ))}
            <div className="pt-4">
              <Link href="/dashboard/activity">
                <Button variant="outline" className="w-full bg-transparent">
                  Voir toute l'activité
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Accès direct aux fonctionnalités principales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/services/new">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Package className="w-4 h-4 mr-2" />
                Créer un service
              </Button>
            </Link>
            <Link href="/dashboard/requests/new">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <FileText className="w-4 h-4 mr-2" />
                Publier une demande
              </Button>
            </Link>
            <Link href="/dashboard/messages">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <MessageSquare className="w-4 h-4 mr-2" />
                Voir les messages
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Users className="w-4 h-4 mr-2" />
                Modifier le profil
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Aperçu des performances
          </CardTitle>
          <CardDescription>Votre progression ce mois-ci</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Taux de réponse</span>
                <span className="text-sm text-muted-foreground">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Satisfaction client</span>
                <span className="text-sm text-muted-foreground">4.8/5</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Objectif mensuel</span>
                <span className="text-sm text-muted-foreground">72%</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
