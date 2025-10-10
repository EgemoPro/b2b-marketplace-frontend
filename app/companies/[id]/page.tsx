"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  Building2,
  MapPin,
  Globe,
  Phone,
  Mail,
  Calendar,
  Users,
  CheckCircle,
  Star,
  MessageCircle,
  ArrowLeft,
  ExternalLink,
  Award,
  Briefcase,
} from "lucide-react"
import { useGetCompanyByIdQuery, useFollowCompanyMutation, useUnfollowCompanyMutation } from "@/lib/api/companies"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function CompanyProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const companyId = params.id as string

  const { data: company, isLoading } = useGetCompanyByIdQuery(companyId)
  const [followCompany] = useFollowCompanyMutation()
  const [unfollowCompany] = useUnfollowCompanyMutation()
  const [isFollowing, setIsFollowing] = useState(false)

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowCompany(companyId).unwrap()
        setIsFollowing(false)
        toast({
          title: "Entreprise retirée des favoris",
          description: "Vous ne suivez plus cette entreprise",
        })
      } else {
        await followCompany(companyId).unwrap()
        setIsFollowing(true)
        toast({
          title: "Entreprise ajoutée aux favoris",
          description: "Vous suivez maintenant cette entreprise",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      })
    }
  }

  const handleContact = () => {
    router.push(`/dashboard/messages?company=${companyId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="h-96" />
            <Skeleton className="h-96 lg:col-span-2" />
          </div>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Entreprise non trouvée</h2>
          <p className="text-muted-foreground mb-6">Cette entreprise n'existe pas ou a été supprimée</p>
          <Link href="/companies">
            <Button>Retour à l'annuaire</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-r from-primary to-secondary">
        {company.coverImage && (
          <Image src={company.coverImage || "/placeholder.svg"} alt={company.name} fill className="object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute top-4 left-4">
          <Button variant="secondary" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Company Header */}
        <div className="relative -mt-20 mb-8">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative h-32 w-32 rounded-xl bg-background border-4 border-background shadow-lg overflow-hidden flex-shrink-0">
                {company.logo ? (
                  <Image src={company.logo || "/placeholder.svg"} alt={company.name} fill className="object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Building2 className="h-16 w-16 text-primary" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl md:text-3xl font-bold">{company.name}</h1>
                      {company.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Vérifiée
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{company.sector}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleFollow} variant={isFollowing ? "secondary" : "default"}>
                      {isFollowing ? "Ne plus suivre" : "Suivre"}
                    </Button>
                    <Button onClick={handleContact}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contacter
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {company.city}, {company.country}
                  </div>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-primary"
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      Site web
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  )}
                  {company.foundedYear && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Fondée en {company.foundedYear}
                    </div>
                  )}
                  {company.employeeCount && (
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {company.employeeCount} employés
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            {company.stats && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Statistiques</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Services</span>
                    <span className="font-semibold">{company.stats.totalServices}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Projets complétés</span>
                    <span className="font-semibold">{company.stats.completedProjects}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Note moyenne</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-semibold">{company.stats.rating.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground ml-1">({company.stats.reviewCount})</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Contact Info */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Informations de contact</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Mail className="h-4 w-4 mr-3 mt-0.5 text-muted-foreground" />
                  <a href={`mailto:${company.email}`} className="text-sm hover:text-primary break-all">
                    {company.email}
                  </a>
                </div>
                <div className="flex items-start">
                  <Phone className="h-4 w-4 mr-3 mt-0.5 text-muted-foreground" />
                  <a href={`tel:${company.phone}`} className="text-sm hover:text-primary">
                    {company.phone}
                  </a>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-3 mt-0.5 text-muted-foreground" />
                  <span className="text-sm">{company.address}</span>
                </div>
              </div>
            </Card>

            {/* Certifications */}
            {company.certifications && company.certifications.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Certifications
                </h3>
                <div className="space-y-2">
                  {company.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary" className="mr-2 mb-2">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="about">À propos</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="reviews">Avis</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">À propos de l'entreprise</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{company.description}</p>

                  {company.siret && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-semibold mb-2">Informations légales</h4>
                      <p className="text-sm text-muted-foreground">SIRET: {company.siret}</p>
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="services" className="mt-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Services proposés</h3>
                  {company.services && company.services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {company.services.map((service) => (
                        <Link key={service.id} href={`/services/${service.id}`}>
                          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex items-start justify-between mb-2">
                              <Briefcase className="h-5 w-5 text-primary" />
                              <Badge variant="secondary">{service.category}</Badge>
                            </div>
                            <h4 className="font-semibold">{service.title}</h4>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Aucun service publié pour le moment</p>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Avis clients</h3>
                  <p className="text-muted-foreground">Les avis seront bientôt disponibles</p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
