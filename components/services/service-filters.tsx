"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { ServiceFilters as ServiceFiltersType } from "@/lib/api/services"

interface ServiceFiltersProps {
  filters: ServiceFiltersType
  onFiltersChange: (filters: Partial<ServiceFiltersType>) => void
}

export function ServiceFilters({ filters, onFiltersChange }: ServiceFiltersProps) {
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

  const currencies = [
    { value: "CFA", label: "CFA Franc" },
    { value: "EUR", label: "Euro" },
    { value: "USD", label: "Dollar US" },
  ]

  const sortOptions = [
    { value: "newest", label: "Plus récents" },
    { value: "price_low", label: "Prix croissant" },
    { value: "price_high", label: "Prix décroissant" },
    { value: "rating", label: "Mieux notés" },
  ]

  const clearFilters = () => {
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

  const hasActiveFilters = filters.search || filters.sector || filters.priceMin || filters.priceMax || filters.currency

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sector */}
        <div className="space-y-2">
          <Label>Secteur</Label>
          <Select
            value={filters.sector || "all"}
            onValueChange={(value) => onFiltersChange({ sector: value === "all" ? undefined : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les secteurs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les secteurs</SelectItem>
              {sectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <Label>Devise</Label>
          <Select
            value={filters.currency || "all"}
            onValueChange={(value) => onFiltersChange({ currency: value === "all" ? undefined : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Toutes les devises" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les devises</SelectItem>
              {currencies.map((currency) => (
                <SelectItem key={currency.value} value={currency.value}>
                  {currency.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <Label>Trier par</Label>
          <Select
            value={filters.sortBy || "newest"}
            onValueChange={(value) => onFiltersChange({ sortBy: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        <div className="space-y-2">
          <Label className="invisible">Actions</Label>
          <Button
            variant="outline"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className="w-full bg-transparent"
          >
            Réinitialiser
          </Button>
        </div>
      </div>

      {/* Price Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Prix minimum</Label>
          <Input
            type="number"
            placeholder="0"
            value={filters.priceMin || ""}
            onChange={(e) => onFiltersChange({ priceMin: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
        <div className="space-y-2">
          <Label>Prix maximum</Label>
          <Input
            type="number"
            placeholder="Illimité"
            value={filters.priceMax || ""}
            onChange={(e) => onFiltersChange({ priceMax: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-sm font-medium text-muted-foreground">Filtres actifs:</span>
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Recherche: {filters.search}
              <X className="w-3 h-3 cursor-pointer" onClick={() => onFiltersChange({ search: undefined })} />
            </Badge>
          )}
          {filters.sector && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.sector}
              <X className="w-3 h-3 cursor-pointer" onClick={() => onFiltersChange({ sector: undefined })} />
            </Badge>
          )}
          {filters.currency && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {currencies.find((c) => c.value === filters.currency)?.label}
              <X className="w-3 h-3 cursor-pointer" onClick={() => onFiltersChange({ currency: undefined })} />
            </Badge>
          )}
          {(filters.priceMin || filters.priceMax) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Prix: {filters.priceMin || 0} - {filters.priceMax || "∞"}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => onFiltersChange({ priceMin: undefined, priceMax: undefined })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
