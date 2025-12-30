"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  X,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  DollarSign,
  Star,
  Clock,
  Building2,
  Coins,
  RotateCcw,
} from "lucide-react"
import type { ServiceFilters as ServiceFiltersType } from "@/lib/api/services"

interface ServiceFiltersProps {
  filters: ServiceFiltersType
  onFiltersChange: (filters: Partial<ServiceFiltersType>) => void
  isLoading?: boolean
}

export function ServiceFilters({ filters, onFiltersChange, isLoading = false }: ServiceFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([filters.priceMin || 0, filters.priceMax || 10000000])
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  const sectors = [
    { value: "Technology", label: "Technologie", icon: "💻" },
    { value: "Agriculture", label: "Agriculture", icon: "🌾" },
    { value: "Manufacturing", label: "Manufacture", icon: "🏭" },
    { value: "Services", label: "Services", icon: "🤝" },
    { value: "Commerce", label: "Commerce", icon: "🛒" },
    { value: "Construction", label: "Construction", icon: "🏗️" },
    { value: "Transport", label: "Transport", icon: "🚚" },
    { value: "Finance", label: "Finance", icon: "💰" },
  ]

  const currencies = [
    { value: "CFA", label: "CFA Franc", symbol: "FCFA", flag: "🇨🇫" },
    { value: "EUR", label: "Euro", symbol: "€", flag: "🇪🇺" },
    { value: "USD", label: "Dollar US", symbol: "$", flag: "🇺🇸" },
  ]

  const sortOptions = [
    { value: "newest", label: "Plus récents", icon: Clock },
    { value: "price_low", label: "Prix croissant", icon: TrendingUp },
    { value: "price_high", label: "Prix décroissant", icon: DollarSign },
    { value: "rating", label: "Mieux notés", icon: Star },
  ]

  useEffect(() => {
    let count = 0
    if (filters.search) count++
    if (filters.sector) count++
    if (filters.priceMin) count++
    if (filters.priceMax && filters.priceMax < 10000000) count++
    if (filters.currency) count++
    setActiveFiltersCount(count)
  }, [filters])

  const clearFilters = () => {
    setPriceRange([0, 10000000])
    onFiltersChange({
      search: undefined,
      sector: undefined,
      priceMin: undefined,
      priceMax: undefined,
      currency: undefined,
      tags: undefined,
      sortBy: "newest",
    })
  }

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange([values[0], values[1]])
  }

  const applyPriceRange = () => {
    onFiltersChange({
      priceMin: priceRange[0] > 0 ? priceRange[0] : undefined,
      priceMax: priceRange[1] < 10000000 ? priceRange[1] : undefined,
    })
  }

  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`
    }
    return value.toString()
  }

  const hasActiveFilters = filters.search || filters.sector || filters.priceMin || filters.priceMax || filters.currency

  return (
    <div className="space-y-6">
      {/* Header with active filters count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Filtres avancés</h3>
            <p className="text-sm text-muted-foreground">Affinez votre recherche</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <Sparkles className="w-3 h-3 mr-1" />
                {activeFiltersCount} filtre{activeFiltersCount > 1 ? "s" : ""} actif{activeFiltersCount > 1 ? "s" : ""}
              </Badge>
            </motion.div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            disabled={!hasActiveFilters || isLoading}
            className="text-muted-foreground hover:text-destructive"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Réinitialiser
          </Button>
        </div>
      </div>

      {/* Main Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sector Filter */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            Secteur d'activité
          </Label>
          <Select
            value={filters.sector || "all"}
            onValueChange={(value) => onFiltersChange({ sector: value === "all" ? undefined : value })}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-background border-2 hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Tous les secteurs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="font-medium">
                Tous les secteurs
              </SelectItem>
              {sectors.map((sector) => (
                <SelectItem key={sector.value} value={sector.value}>
                  <span className="flex items-center gap-2">
                    <span>{sector.icon}</span>
                    <span>{sector.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Currency Filter */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Coins className="w-4 h-4 text-muted-foreground" />
            Devise
          </Label>
          <Select
            value={filters.currency || "all"}
            onValueChange={(value) => onFiltersChange({ currency: value === "all" ? undefined : value })}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-background border-2 hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Toutes les devises" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="font-medium">
                Toutes les devises
              </SelectItem>
              {currencies.map((currency) => (
                <SelectItem key={currency.value} value={currency.value}>
                  <span className="flex items-center gap-2">
                    <span>{currency.flag}</span>
                    <span>{currency.label}</span>
                    <span className="text-muted-foreground">({currency.symbol})</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Sort Filter */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Label className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            Trier par
          </Label>
          <Select
            value={filters.sortBy || "newest"}
            onValueChange={(value) => onFiltersChange({ sortBy: value as any })}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-background border-2 hover:border-primary/50 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => {
                const Icon = option.icon
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{option.label}</span>
                    </span>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            Actions rapides
          </Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30 hover:border-amber-500/50 text-amber-700 dark:text-amber-400"
              onClick={() => onFiltersChange({ sortBy: "rating" })}
              disabled={isLoading}
            >
              <Star className="w-4 h-4 mr-1 fill-amber-500 text-amber-500" />
              Top notés
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30 hover:border-emerald-500/50 text-emerald-700 dark:text-emerald-400"
              onClick={() => onFiltersChange({ sortBy: "newest" })}
              disabled={isLoading}
            >
              <Clock className="w-4 h-4 mr-1" />
              Récents
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Price Range Slider */}
      <motion.div
        className="space-y-4 p-4 rounded-xl bg-muted/30 border"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            Fourchette de prix
          </Label>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])} FCFA
            </Badge>
            <Button size="sm" variant="secondary" onClick={applyPriceRange} disabled={isLoading} className="h-7">
              Appliquer
            </Button>
          </div>
        </div>

        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            min={0}
            max={10000000}
            step={50000}
            disabled={isLoading}
            className="py-4"
          />
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0 FCFA</span>
          <span>2.5M</span>
          <span>5M</span>
          <span>7.5M</span>
          <span>10M+ FCFA</span>
        </div>
      </motion.div>

      {/* Active Filters Tags */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            className="flex flex-wrap gap-2 pt-4 border-t"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Filtres actifs:
            </span>

            {filters.search && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/20 transition-colors cursor-pointer"
                  onClick={() => onFiltersChange({ search: undefined })}
                >
                  🔍 "{filters.search}"
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              </motion.div>
            )}

            {filters.sector && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30 hover:bg-purple-500/20 transition-colors cursor-pointer"
                  onClick={() => onFiltersChange({ sector: undefined })}
                >
                  {sectors.find((s) => s.value === filters.sector)?.icon} {filters.sector}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              </motion.div>
            )}

            {filters.currency && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                  onClick={() => onFiltersChange({ currency: undefined })}
                >
                  {currencies.find((c) => c.value === filters.currency)?.flag}{" "}
                  {currencies.find((c) => c.value === filters.currency)?.label}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              </motion.div>
            )}

            {(filters.priceMin || (filters.priceMax && filters.priceMax < 10000000)) && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20 transition-colors cursor-pointer"
                  onClick={() => {
                    setPriceRange([0, 10000000])
                    onFiltersChange({ priceMin: undefined, priceMax: undefined })
                  }}
                >
                  💰 {formatPrice(filters.priceMin || 0)} - {formatPrice(filters.priceMax || 10000000)} FCFA
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
