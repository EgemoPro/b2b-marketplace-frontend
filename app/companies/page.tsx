"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, MapPin, Building2, CheckCircle, Users, TrendingUp, Filter, Menu, X } from "lucide-react"
import { useGetCompaniesQuery } from "@/lib/api/companies"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Logo } from "@/components/ui/logo"
import Image from "next/image"

const SECTORS = [
  "Tous les secteurs",
  "Technologie",
  "Finance",
  "Santé",
  "Éducation",
  "Commerce",
  "Industrie",
  "Agriculture",
  "Transport",
  "Construction",
  "Services",
]

const COUNTRIES = [
  "Tous les pays",
  "Sénégal",
  "Côte d'Ivoire",
  "Cameroun",
  "Mali",
  "Burkina Faso",
  "Niger",
  "Bénin",
  "Togo",
  "Guinée",
  "Madagascar",
]

export default function CompaniesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [sector, setSector] = useState("Tous les secteurs")
  const [country, setCountry] = useState("Tous les pays")
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { data, isLoading } = useGetCompaniesQuery({
    page,
    limit: 12,
    search: search || undefined,
    sector: sector !== "Tous les secteurs" ? sector : undefined,
    country: country !== "Tous les pays" ? country : undefined,
    verified: verifiedOnly || undefined,
  })

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const FilterContent = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Secteur d'activité</label>
        <Select
          value={sector}
          onValueChange={(value) => {
            setSector(value)
            setPage(1)
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SECTORS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Pays</label>
        <Select
          value={country}
          onValueChange={(value) => {
            setCountry(value)
            setPage(1)
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Entreprises vérifiées uniquement</label>
        <Button
          variant={verifiedOnly ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setVerifiedOnly(!verifiedOnly)
            setPage(1)
          }}
        >
          {verifiedOnly ? "Activé" : "Désactivé"}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Logo size="lg" />
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              <Link href="/services">
                <Button variant="ghost">Services</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline">Connexion</Button>
              </Link>
            </div>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Accueil
                    </Button>
                  </Link>
                  <Link href="/services" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Services
                    </Button>
                  </Link>
                  <Link href="/companies" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Entreprises
                    </Button>
                  </Link>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full bg-transparent">
                      Connexion
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Inscription</Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-balance">Annuaire des Entreprises B2B</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 text-pretty">
              Découvrez et connectez-vous avec des milliers d'entreprises africaines vérifiées
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une entreprise..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="lg" variant="outline" className="sm:w-auto bg-transparent">
                    <Filter className="h-5 w-5 mr-2" />
                    Filtres
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <h3 className="text-lg font-semibold mb-6">Filtres de recherche</h3>
                  <FilterContent />
                </SheetContent>
              </Sheet>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Active Filters */}
          {(sector !== "Tous les secteurs" || country !== "Tous les pays" || verifiedOnly) && (
            <div className="mb-6 flex flex-wrap gap-2">
              {sector !== "Tous les secteurs" && (
                <Badge variant="secondary" className="px-3 py-1">
                  {sector}
                  <button onClick={() => setSector("Tous les secteurs")} className="ml-2">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {country !== "Tous les pays" && (
                <Badge variant="secondary" className="px-3 py-1">
                  {country}
                  <button onClick={() => setCountry("Tous les pays")} className="ml-2">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {verifiedOnly && (
                <Badge variant="secondary" className="px-3 py-1">
                  Vérifiées uniquement
                  <button onClick={() => setVerifiedOnly(false)} className="ml-2">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-20 w-20 rounded-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-1/2" />
                </Card>
              ))}
            </div>
          ) : data?.companies && data.companies.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.companies.map((company, index) => (
                  <motion.div
                    key={company.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/companies/${company.id}`}>
                      <Card className="p-6 hover:shadow-lg transition-all cursor-pointer h-full">
                        <div className="flex items-start justify-between mb-4">
                          <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                            {company.logo ? (
                              <Image
                                src={company.logo || "/placeholder.svg"}
                                alt={company.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Building2 className="h-8 w-8 text-primary" />
                            )}
                          </div>
                          {company.verified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Vérifiée
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-xl font-semibold mb-2 line-clamp-1">{company.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{company.description}</p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Building2 className="h-4 w-4 mr-2" />
                            {company.sector}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            {company.city}, {company.country}
                          </div>
                        </div>

                        {company.stats && (
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center text-sm">
                              <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="font-medium">{company.stats.totalServices}</span>
                              <span className="text-muted-foreground ml-1">services</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <TrendingUp className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="font-medium">{company.stats.rating.toFixed(1)}</span>
                              <span className="text-muted-foreground ml-1">({company.stats.reviewCount})</span>
                            </div>
                          </div>
                        )}
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <Button variant="outline" onClick={() => setPage(page - 1)} disabled={page === 1}>
                    Précédent
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} sur {data.totalPages}
                  </span>
                  <Button variant="outline" onClick={() => setPage(page + 1)} disabled={page === data.totalPages}>
                    Suivant
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune entreprise trouvée</h3>
              <p className="text-muted-foreground">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
