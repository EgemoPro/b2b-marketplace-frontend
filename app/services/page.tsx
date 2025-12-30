"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGetServicesQuery } from "@/lib/api/services"
import { ServiceCard } from "@/components/services/service-card"
import { ServiceFilters } from "@/components/services/service-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Search,
  Filter,
  ArrowRight,
  Menu,
  Home,
  Package,
  MessageSquare,
  User,
  Settings,
  Loader2,
  AlertCircle,
  SearchX,
  RefreshCcw,
  Wifi,
  WifiOff,
  X,
  Sparkles,
} from "lucide-react"
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
  const [isSearching, setIsSearching] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  const { data, isLoading, error, isFetching, refetch } = useGetServicesQuery(filters)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [isMounted])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        setIsSearching(true)
        setFilters((prev) => ({ ...prev, search: searchTerm || undefined, page: 1 }))
        setTimeout(() => setIsSearching(false), 500)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }))
    setTimeout(() => setIsSearching(false), 500)
  }

  const handleFilterChange = (newFilters: Partial<ServiceFiltersType>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }

  const clearSearch = () => {
    setSearchTerm("")
    setFilters((prev) => ({ ...prev, search: undefined, page: 1 }))
  }

  const sectors = [
    { value: "Technology", label: "Technologie", icon: "💻" },
    { value: "Agriculture", label: "Agriculture", icon: "🌾" },
    { value: "Manufacturing", label: "Manufacture", icon: "🏭" },
    { value: "Services", label: "Services", icon: "🤝" },
  ]

  const navigationItems = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/services", label: "Services", icon: Package },
    { href: "/dashboard", label: "Dashboard", icon: User },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
    { href: "/dashboard/documents", label: "Documents", icon: Settings },
  ]

  const renderErrorState = () => {
    if (!isOnline) {
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-orange-500/30 bg-orange-500/5">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                <WifiOff className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Connexion perdue</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Vous semblez être hors ligne. Vérifiez votre connexion internet et réessayez.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" onClick={() => refetch()} className="bg-transparent">
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Réessayer
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )
    }

    if (error) {
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Erreur de chargement</h3>
              <p className="text-muted-foreground mb-2">Une erreur est survenue lors du chargement des services.</p>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                Cela peut être dû à un problème de serveur ou de connexion. Veuillez réessayer.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" onClick={() => refetch()} className="bg-transparent">
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Réessayer
                </Button>
                <Link href="/help">
                  <Button variant="ghost">Obtenir de l'aide</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )
    }

    return null
  }

  const renderEmptyState = () => {
    if (data?.services.length === 0) {
      const hasFilters = filters.search || filters.sector || filters.priceMin || filters.priceMax || filters.currency

      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-muted">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <SearchX className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {hasFilters ? "Aucun résultat trouvé" : "Aucun service disponible"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {hasFilters
                  ? "Essayez de modifier vos critères de recherche ou réinitialisez les filtres pour voir plus de résultats."
                  : "Il n'y a pas encore de services publiés. Revenez bientôt !"}
              </p>
              <div className="flex items-center justify-center gap-3">
                {hasFilters && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setFilters({ page: 1, limit: 12, sortBy: "newest" })
                    }}
                    className="bg-transparent"
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Réinitialiser les filtres
                  </Button>
                )}
                <Link href="/auth/register">
                  <Button>Proposer un service</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )
    }

    return null
  }

  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
          <Card className="overflow-hidden">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-muted animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-3 bg-muted rounded animate-pulse" />
                <div className="h-3 bg-muted rounded animate-pulse w-5/6" />
                <div className="h-3 bg-muted rounded animate-pulse w-4/6" />
                <div className="flex gap-2 pt-2">
                  <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
                  <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )

  const showOfflineBanner = isMounted && !isOnline

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <AnimatePresence>
        {showOfflineBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-orange-500 text-white"
          >
            <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2 text-sm">
              <WifiOff className="w-4 h-4" />
              <span>Vous êtes actuellement hors ligne. Certaines fonctionnalités peuvent être limitées.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden p-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Ouvrir le menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                {/* ... existing mobile menu code ... */}
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 pb-6 border-b">
                    <Logo size="lg" />
                    <span className="text-lg font-bold">AfriMarket B2B</span>
                  </div>
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

            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <Logo size="lg" />
            </Link>

            <span className="hidden md:block text-lg lg:text-xl font-bold text-foreground">AfriMarket B2B</span>

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

        <div className="mb-8">
          <Card className="overflow-hidden border-2 shadow-lg">
            <CardContent className="p-0">
              {/* Search Bar Section */}
              <div className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
                <form onSubmit={handleSearch} className="relative">
                  <div className="flex flex-col md:flex-row gap-3">
                    {/* Search Input */}
                    <div className="flex-1 relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                      <div className="relative flex items-center">
                        <div className="absolute left-4 flex items-center pointer-events-none">
                          {isSearching || (isFetching && searchTerm) ? (
                            <Loader2 className="h-5 w-5 text-primary animate-spin" />
                          ) : (
                            <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          )}
                        </div>
                        <Input
                          placeholder="Rechercher des services, entreprises, catégories..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-12 pr-12 h-14 text-lg bg-background border-2 border-muted focus:border-primary rounded-xl shadow-sm transition-all"
                        />
                        {searchTerm && (
                          <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-4 p-1 rounded-full hover:bg-muted transition-colors"
                          >
                            <X className="h-4 w-4 text-muted-foreground" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        size="lg"
                        className="h-14 px-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                        loading={isSearching}
                      >
                        <Search className="w-5 h-5 mr-2" />
                        Rechercher
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`h-14 px-6 rounded-xl bg-background border-2 transition-all ${
                          showFilters ? "border-primary text-primary" : "border-muted"
                        }`}
                      >
                        <Filter className={`w-5 h-5 mr-2 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                        Filtres
                        {(filters.sector || filters.currency || filters.priceMin || filters.priceMax) && (
                          <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
                            {
                              [filters.sector, filters.currency, filters.priceMin || filters.priceMax].filter(Boolean)
                                .length
                            }
                          </Badge>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Quick Sector Tags */}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Populaires:
                    </span>
                    {sectors.map((sector) => (
                      <Badge
                        key={sector.value}
                        variant={filters.sector === sector.value ? "default" : "secondary"}
                        className={`cursor-pointer transition-all hover:scale-105 ${
                          filters.sector === sector.value
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "hover:bg-primary/10 hover:text-primary"
                        }`}
                        onClick={() =>
                          handleFilterChange({
                            sector: filters.sector === sector.value ? undefined : sector.value,
                          })
                        }
                      >
                        <span className="mr-1">{sector.icon}</span>
                        {sector.label}
                      </Badge>
                    ))}
                  </div>
                </form>
              </div>

              {/* Expandable Filters Section */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 border-t bg-muted/20">
                      <ServiceFilters filters={filters} onFiltersChange={handleFilterChange} isLoading={isFetching} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        <div className="relative">
          {/* Loading overlay for refetching */}
          <AnimatePresence>
            {isFetching && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-start justify-center pt-20"
              >
                <div className="flex items-center gap-3 bg-background border rounded-full px-6 py-3 shadow-lg">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  <span className="text-sm font-medium">Chargement des résultats...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error State */}
          {(error || !isOnline) && renderErrorState()}

          {/* Loading State */}
          {isLoading && renderLoadingSkeleton()}

          {/* Empty State */}
          {!isLoading && !error && isOnline && renderEmptyState()}

          {/* Results */}
          {!isLoading && !error && isOnline && data?.services && data.services.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {isOnline && (
                    <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">
                      <Wifi className="w-3 h-3 mr-1" />
                      En ligne
                    </Badge>
                  )}
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{data?.total}</span> service
                    {data?.total !== 1 ? "s" : ""} trouvé{data?.total !== 1 ? "s" : ""}
                  </p>
                </div>
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
                    disabled={filters.page === 1 || isFetching}
                    onClick={() => handleFilterChange({ page: (filters.page || 1) - 1 })}
                  >
                    Précédent
                  </Button>
                  <span className="flex items-center px-4 text-sm text-muted-foreground">
                    Page {filters.page} sur {data.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={filters.page === data.totalPages || isFetching}
                    onClick={() => handleFilterChange({ page: (filters.page || 1) + 1 })}
                  >
                    Suivant
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

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
