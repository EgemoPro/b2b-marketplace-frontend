"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Clock, Shield, MessageSquare } from "lucide-react"
import Link from "next/link"
import type { Service } from "@/lib/api/services"

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  const formatPrice = (price: number, currency: string) => {
    const formatter = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency === "CFA" ? "XOF" : currency,
      minimumFractionDigits: currency === "CFA" ? 0 : 2,
    })

    if (currency === "CFA") {
      return `${price.toLocaleString("fr-FR")} CFA`
    }

    return formatter.format(price)
  }

  const getPriceDisplay = () => {
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

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {service.title}
            </CardTitle>
            <CardDescription className="mt-2 line-clamp-2">{service.description}</CardDescription>
          </div>
        </div>

        {/* Supplier Info */}
        <div className="flex items-center space-x-2 mt-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {service.supplierName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-foreground truncate">{service.supplierName}</span>
              {service.supplierVerified && <Shield className="w-3 h-3 text-primary" />}
            </div>
            {service.rating && (
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-muted-foreground">
                  {service.rating.toFixed(1)} ({service.reviewCount} avis)
                </span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          <Badge variant="secondary" className="text-xs">
            {service.sector}
          </Badge>
          {service.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {service.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{service.tags.length - 2}
            </Badge>
          )}
        </div>

        {/* Price and Delivery */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Prix:</span>
            <span className="font-semibold text-primary">{getPriceDisplay()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Délai:</span>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm">{service.deliveryTime}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Link href={`/services/${service.id}`} className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              Voir détails
            </Button>
          </Link>
          <Button size="sm" className="px-3">
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
