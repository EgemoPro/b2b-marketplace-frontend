"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/hooks"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, MessageSquare, CreditCard, Shield, Globe } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export default function HomePage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const features = [
    {
      icon: Building2,
      title: "Catalogue de Services",
      description: "Découvrez des milliers de services proposés par des entreprises africaines vérifiées",
    },
    {
      icon: Users,
      title: "Réseau B2B",
      description: "Connectez-vous avec des partenaires commerciaux dans toute l'Afrique",
    },
    {
      icon: MessageSquare,
      title: "Chat Temps Réel",
      description: "Communiquez instantanément avec vos partenaires commerciaux",
    },
    {
      icon: CreditCard,
      title: "Paiements Sécurisés",
      description: "Transactions sécurisées en CFA Franc, EUR et USD avec système d'escrow",
    },
    {
      icon: Shield,
      title: "Entreprises Vérifiées",
      description: "Toutes les entreprises sont vérifiées pour garantir la confiance",
    },
    {
      icon: Globe,
      title: "Écosystème Africain",
      description: "Plateforme dédiée au développement du commerce B2B en Afrique",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="lg" />
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Se connecter</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Créer un compte</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            La Marketplace B2B
            <span className="text-primary"> Africaine</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            Connectez votre entreprise à l'écosystème B2B africain. Trouvez des partenaires, négociez des contrats et
            développez votre activité avec des paiements sécurisés en CFA Franc.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8">
                Commencer gratuitement
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                Explorer les services
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Pourquoi choisir AfriMarket B2B ?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une plateforme conçue spécifiquement pour les besoins du commerce B2B africain
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Prêt à développer votre business ?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'entreprises africaines qui font confiance à AfriMarket B2B
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="text-lg px-8">
              Créer mon compte maintenant
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <Logo size="md" className="justify-center mb-4" />
          <p className="text-muted-foreground">
            © 2024 AFRIMARKET B2B. Construit avec ❤️ pour l'écosystème B2B africain.
          </p>
        </div>
      </footer>
    </div>
  )
}
