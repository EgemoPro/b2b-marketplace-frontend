"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, ChevronDown, ChevronUp, HelpCircle, Book, MessageCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"

const faqs = [
  {
    category: "Compte et inscription",
    questions: [
      {
        q: "Comment créer un compte sur AfriMarket B2B ?",
        a: 'Pour créer un compte, cliquez sur "Inscription" en haut de la page, remplissez le formulaire avec les informations de votre entreprise, et validez votre email. Vous devrez fournir votre SIRET ou équivalent pour la vérification.',
      },
      {
        q: "Comment vérifier mon entreprise ?",
        a: "Après l'inscription, accédez à votre profil et téléchargez les documents requis (KBIS, SIRET, etc.). Notre équipe vérifiera vos documents sous 48h et vous recevrez un badge de vérification.",
      },
    ],
  },
  {
    category: "Services et transactions",
    questions: [
      {
        q: "Comment publier un service ?",
        a: 'Connectez-vous à votre compte, allez dans "Mes Services", cliquez sur "Créer un service" et remplissez les informations requises : titre, description, prix, catégorie, etc.',
      },
      {
        q: "Comment fonctionne le système de paiement ?",
        a: "Nous utilisons un système d'escrow sécurisé. Le paiement est bloqué jusqu'à la livraison du service. Une fois satisfait, le client libère les fonds qui sont transférés au fournisseur.",
      },
      {
        q: "Quelles devises sont acceptées ?",
        a: "Nous acceptons le CFA Franc (XOF/XAF), l'Euro (EUR) et le Dollar américain (USD). Vous pouvez définir vos prix dans la devise de votre choix.",
      },
    ],
  },
  {
    category: "Sécurité et confidentialité",
    questions: [
      {
        q: "Mes données sont-elles sécurisées ?",
        a: "Oui, nous utilisons un chiffrement de niveau bancaire pour protéger vos données. Toutes les transactions sont sécurisées et nous ne partageons jamais vos informations sans votre consentement.",
      },
      {
        q: "Comment signaler un problème ou une fraude ?",
        a: 'Utilisez le bouton "Signaler" sur le profil ou le service concerné, ou contactez notre équipe support à support@afrimarket.com. Nous traitons tous les signalements avec la plus haute priorité.',
      },
    ],
  },
  {
    category: "Support et assistance",
    questions: [
      {
        q: "Comment contacter le support ?",
        a: "Vous pouvez nous contacter par email à support@afrimarket.com, par téléphone au +221 12 345 67 89, ou via le formulaire de contact sur notre site.",
      },
      {
        q: "Quel est le délai de réponse du support ?",
        a: "Nous nous efforçons de répondre à toutes les demandes sous 24h en jours ouvrés. Les urgences sont traitées en priorité.",
      },
    ],
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

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
              <Link href="/contact">
                <Button variant="ghost">Contact</Button>
              </Link>
              <Link href="/auth/login">
                <Button>Connexion</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <HelpCircle className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl font-bold mb-4">Centre d'aide</h1>
            <p className="text-lg text-muted-foreground mb-8">Trouvez rapidement des réponses à vos questions</p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans l'aide..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            <Link href="/contact">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer text-center">
                <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Nous contacter</h3>
                <p className="text-sm text-muted-foreground">Envoyez-nous un message</p>
              </Card>
            </Link>

            <Link href="/dashboard/messages">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Chat en direct</h3>
                <p className="text-sm text-muted-foreground">Discutez avec notre équipe</p>
              </Card>
            </Link>

            <Card className="p-6 text-center">
              <Book className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Documentation</h3>
              <p className="text-sm text-muted-foreground">Guides et tutoriels</p>
            </Card>
          </div>

          {/* FAQs */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Questions fréquentes</h2>

            {filteredFaqs.length > 0 ? (
              <div className="space-y-8">
                {filteredFaqs.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
                    <div className="space-y-3">
                      {category.questions.map((item, itemIndex) => {
                        const id = `${categoryIndex}-${itemIndex}`
                        const isExpanded = expandedItems.includes(id)

                        return (
                          <Card key={id} className="overflow-hidden">
                            <button
                              onClick={() => toggleItem(id)}
                              className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                            >
                              <span className="font-medium pr-4">{item.q}</span>
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                              )}
                            </button>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-6 pb-6"
                              >
                                <p className="text-muted-foreground leading-relaxed">{item.a}</p>
                              </motion.div>
                            )}
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <HelpCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h3>
                <p className="text-muted-foreground mb-6">Essayez avec d'autres mots-clés ou contactez notre support</p>
                <Link href="/contact">
                  <Button>Contacter le support</Button>
                </Link>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
