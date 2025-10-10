"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Logo size="lg" />
            </Link>
            <Link href="/">
              <Button variant="ghost">Retour à l'accueil</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Conditions Générales d'Utilisation</h1>

          <Card className="p-8">
            <div className="prose prose-slate max-w-none">
              <p className="text-sm text-muted-foreground mb-8">
                Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Acceptation des conditions</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  En accédant et en utilisant AfriMarket B2B, vous acceptez d'être lié par ces conditions générales
                  d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Description du service</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  AfriMarket B2B est une plateforme de commerce inter-entreprises qui facilite les échanges commerciaux
                  entre entreprises africaines. Nous fournissons un espace sécurisé pour la publication de services, la
                  communication entre entreprises et la réalisation de transactions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Inscription et compte utilisateur</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Pour utiliser certaines fonctionnalités de la plateforme, vous devez créer un compte. Vous êtes
                  responsable de :
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>Fournir des informations exactes et à jour lors de l'inscription</li>
                  <li>Maintenir la sécurité de votre compte et de votre mot de passe</li>
                  <li>Toutes les activités effectuées sous votre compte</li>
                  <li>Nous informer immédiatement de toute utilisation non autorisée</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Utilisation de la plateforme</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">Vous vous engagez à :</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>Utiliser la plateforme conformément aux lois applicables</li>
                  <li>Ne pas publier de contenu frauduleux, trompeur ou illégal</li>
                  <li>Respecter les droits de propriété intellectuelle d'autrui</li>
                  <li>Ne pas perturber le fonctionnement de la plateforme</li>
                  <li>Maintenir un comportement professionnel dans vos interactions</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Transactions et paiements</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Les transactions effectuées sur la plateforme sont soumises à notre système de paiement sécurisé. Nous
                  utilisons un système d'escrow pour protéger les deux parties. Les frais de transaction sont clairement
                  indiqués avant la confirmation de toute transaction.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Propriété intellectuelle</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Tous les contenus de la plateforme, y compris les textes, graphiques, logos et logiciels, sont la
                  propriété d'AfriMarket B2B ou de ses concédants de licence et sont protégés par les lois sur la
                  propriété intellectuelle.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Limitation de responsabilité</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  AfriMarket B2B agit en tant qu'intermédiaire entre les entreprises. Nous ne sommes pas responsables de
                  la qualité, de la sécurité ou de la légalité des services proposés, ni de la capacité des utilisateurs
                  à honorer leurs engagements.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. Résiliation</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Nous nous réservons le droit de suspendre ou de résilier votre compte en cas de violation de ces
                  conditions, sans préavis et sans remboursement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">9. Modifications des conditions</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entreront en
                  vigueur dès leur publication sur la plateforme. Votre utilisation continue de la plateforme après les
                  modifications constitue votre acceptation des nouvelles conditions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">10. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Pour toute question concernant ces conditions, veuillez nous contacter à{" "}
                  <a href="mailto:legal@afrimarket.com" className="text-primary hover:underline">
                    legal@afrimarket.com
                  </a>
                </p>
              </section>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
