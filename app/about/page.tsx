"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Building2, Users, Globe, TrendingUp, Shield, Zap, Heart, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"

export default function AboutPage() {
  const stats = [
    { label: "Entreprises inscrites", value: "10,000+", icon: Building2 },
    { label: "Transactions réalisées", value: "50,000+", icon: TrendingUp },
    { label: "Pays couverts", value: "15+", icon: Globe },
    { label: "Utilisateurs actifs", value: "25,000+", icon: Users },
  ]

  const values = [
    {
      icon: Shield,
      title: "Sécurité",
      description: "Protection maximale des transactions avec notre système d'escrow et vérification des entreprises",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Technologies de pointe pour faciliter les échanges commerciaux en Afrique",
    },
    {
      icon: Heart,
      title: "Engagement",
      description: "Soutien au développement économique africain et à la croissance des PME",
    },
    {
      icon: Target,
      title: "Excellence",
      description: "Service de qualité supérieure pour garantir la satisfaction de nos utilisateurs",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Logo size="lg" />
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/services">
                <Button variant="ghost">Services</Button>
              </Link>
              <Link href="/companies">
                <Button variant="ghost">Entreprises</Button>
              </Link>
              <Link href="/auth/login">
                <Button>Connexion</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">À propos d'AfriMarket B2B</h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty">
              La première marketplace dédiée au commerce inter-entreprises en Afrique, facilitant les échanges
              commerciaux et le développement économique du continent
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold mb-6 text-center">Notre Mission</h2>
              <Card className="p-8">
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  AfriMarket B2B a été créée avec une vision claire : démocratiser l'accès au commerce inter-entreprises
                  en Afrique et faciliter les échanges commerciaux entre entreprises du continent.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Nous croyons fermement que la digitalisation des échanges B2B est un levier essentiel pour le
                  développement économique de l'Afrique. Notre plateforme offre un environnement sécurisé, transparent
                  et efficace pour que les entreprises africaines puissent se connecter, collaborer et prospérer
                  ensemble.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Notre Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center">
                  <stat.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <value.icon className="h-10 w-10 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">Rejoignez-nous</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Faites partie de la révolution du commerce B2B en Afrique
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg">Créer un compte</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
