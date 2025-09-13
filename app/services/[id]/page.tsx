"use client"

import { useParams } from "next/navigation"
import { useGetServiceQuery } from "@/lib/api/services"
import { useAppSelector } from "@/lib/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Star, Clock, Shield, MessageSquare, ArrowLeft, Building2, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Logo } from "@/components/ui/logo"

export default function ServiceDetailPage() {
  const params = useParams()
  const serviceId = params.id as string
  const { user } = useAppSelector((state) => state.auth)

  const { data: service, isLoading, error } = useGetServiceQuery(serviceId)

  const formatPrice = (price: number, currency: string) => {
    if (currency === "CFA") {
      return `${price.toLocaleString("fr-FR")} CFA`
    }

    const formatter = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    })

    return formatter.format(price)
  }

  const getPriceDisplay = () => {
    if (!service) return ""

    if (service.priceType === "fixed") {
      return formatPrice(service.priceMin, service.currency)
    } else if (service.priceType === "hourly") {
      return `${formatPrice(service.priceMin, service.currency)}/h`
    } else {
      const min = formatPrice(service.priceMin, service.currency)
      const max = service.priceMax ? formatPrice(service.priceMax, service.currency) : null
      return max ? `${min} - ${max}` : `À partir de ${min}`
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="h-8 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-5/6"></div>
                      <div className="h-4 bg-muted rounded w-4/6"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="h-6 bg-muted rounded w-1/2"></div>
                      <div className="h-10 bg-muted rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Service non trouvé</p>
              <Link href="/services">
                <Button className="mt-4">Retour aux services</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/services" className="flex items-center space-x-2">
            <Logo size="lg" />
            <span className="text-xl font-bold text-foreground">AfriMarket B2B</span>
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">Se connecter</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Créer un compte</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/services" className="hover:text-primary flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Services
          </Link>
          <span>/</span>
          <span className="text-foreground">{service.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                      <CardDescription className="text-base">{service.description}</CardDescription>
                    </div>
                    <Badge variant={service.status === "active" ? "default" : "secondary"}>
                      {service.status === "active" ? "Actif" : "Inactif"}
                    </Badge>
                  </div>

                  {/* Supplier Info */}
                  <div className="flex items-center space-x-3 mt-6 p-4 bg-muted/50 rounded-lg">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {service.supplierName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-foreground">{service.supplierName}</h3>
                        {service.supplierVerified && <Shield className="w-4 h-4 text-primary" />}
                      </div>
                      {service.rating && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-muted-foreground">
                            {service.rating.toFixed(1)} ({service.reviewCount} avis)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Service Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Détails du service</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Prix</p>
                        <p className="font-semibold">{getPriceDisplay()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Délai de livraison</p>
                        <p className="font-semibold">{service.deliveryTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Building2 className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Secteur</p>
                        <p className="font-semibold">{service.sector}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Créé le</p>
                        <p className="font-semibold">{new Date(service.createdAt).toLocaleDateString("fr-FR")}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Tags */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Compétences</p>
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contacter le fournisseur</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary mb-1">{getPriceDisplay()}</p>
                    <p className="text-sm text-muted-foreground">
                      {service.priceType === "fixed"
                        ? "Prix fixe"
                        : service.priceType === "hourly"
                          ? "Prix horaire"
                          : "Prix du projet"}
                    </p>
                  </div>

                  <Separator />

                  {user ? (
                    <div className="space-y-3">
                      <Button className="w-full">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Envoyer un message
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent">
                        Demander un devis
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground text-center">
                        Connectez-vous pour contacter ce fournisseur
                      </p>
                      <Link href="/auth/login">
                        <Button className="w-full">Se connecter</Button>
                      </Link>
                      <Link href="/auth/register">
                        <Button variant="outline" className="w-full bg-transparent">
                          Créer un compte
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Service Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Temps de réponse</span>
                    <span className="text-sm font-medium">&lt; 2h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Projets terminés</span>
                    <span className="text-sm font-medium">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Taux de satisfaction</span>
                    <span className="text-sm font-medium">98%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Membre depuis</span>
                    <span className="text-sm font-medium">2023</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
