"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useGetServicesQuery } from "@/lib/api/services"
import { ServiceCard } from "@/components/services/service-card"
import { ServiceFilters } from "@/components/services/service-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Search, Filter, ArrowRight, Menu, Home, Package, MessageSquare, User, Settings } from "lucide-react"
import Link from "next/link"
import type { ServiceFilters as ServiceFiltersType } from "@/lib/api/services"
import { Logo } from "@/components/ui/logo"

export default function ServicesPage() {
  const [filters, setFilters] = useState<ServiceFiltersType>({
    page: 1,
    limit: 12,
    sortBy: "newest",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { data, isLoading, error } = useGetServicesQuery(filters)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }))
  }

  const handleFilterChange = (newFilters: Partial<ServiceFiltersType>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }

  const sectors = [
    "Technology",
    "Agriculture",
    "Manufacturing",
    "Services",
    "Commerce",
    "Construction",
    "Transport",
    "Finance",
  ]

  const navigationItems = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/services", label: "Services", icon: Package },
    { href: "/dashboard", label: "Dashboard", icon: User },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
    { href: "/dashboard/documents", label: "Documents", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Mobile menu button - only visible on small screens */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden p-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Ouvrir le menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex flex-col h-full">
                  {/* Logo in mobile menu */}
                  <div className="flex items-center space-x-2 pb-6 border-b">
                    <Logo size="lg" />
                    <span className="text-lg font-bold">AfriMarket B2B</span>
                  </div>

                  {/* Navigation items */}
                  <nav className="flex-1 py-6">
                    <ul className="space-y-2">
                      {navigationItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Icon className="h-5 w-5" />
                              <span>{item.label}</span>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </nav>

                  {/* Auth buttons in mobile menu */}
                  <div className="border-t pt-6 space-y-3">
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full bg-transparent">
                        Se connecter
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Créer un compte</Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo section - always visible */}
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <Logo size="lg" />
            </Link>

            {/* Brand name - hidden on mobile, visible on larger screens */}
            <span className="hidden md:block text-lg lg:text-xl font-bold text-foreground">AfriMarket B2B</span>

            {/* Auth buttons - hidden on mobile, visible on larger screens */}
            <div className="hidden md:flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="text-sm sm:text-base px-2 sm:px-4">
                  Se connecter
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="text-sm sm:text-base px-2 sm:px-4">
                  Créer un compte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Catalogue de Services B2B</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Découvrez des milliers de services proposés par des entreprises africaines vérifiées
            </p>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher des services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Rechercher</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-transparent"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </Button>
              </form>

              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t pt-4"
                >
                  <ServiceFilters filters={filters} onFiltersChange={handleFilterChange} />
                </motion.div>
              )}

              {/* Popular Sectors */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-sm font-medium text-muted-foreground mr-2">Secteurs populaires:</span>
                {sectors.slice(0, 4).map((sector) => (
                  <Badge
                    key={sector}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleFilterChange({ sector })}
                  >
                    {sector}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Erreur lors du chargement des services</p>
            </CardContent>
          </Card>
        ) : data?.services.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">Aucun service trouvé</p>
              <Button variant="outline" onClick={() => setFilters({ page: 1, limit: 12, sortBy: "newest" })}>
                Réinitialiser les filtres
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {data?.total} service{data?.total !== 1 ? "s" : ""} trouvé{data?.total !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {data?.services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ServiceCard service={service} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  disabled={filters.page === 1}
                  onClick={() => handleFilterChange({ page: (filters.page || 1) - 1 })}
                >
                  Précédent
                </Button>
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  Page {filters.page} sur {data.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={filters.page === data.totalPages}
                  onClick={() => handleFilterChange({ page: (filters.page || 1) + 1 })}
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Vous êtes fournisseur de services ?</h2>
              <p className="text-muted-foreground mb-6">
                Rejoignez AfriMarket B2B et proposez vos services à des milliers d'entreprises africaines
              </p>
              <Link href="/auth/register">
                <Button size="lg">
                  Créer mon compte fournisseur
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
