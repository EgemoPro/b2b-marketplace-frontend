"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold mb-8">Politique de Confidentialité</h1>

          <Card className="p-8">
            <div className="prose prose-slate max-w-none">
              <p className="text-sm text-muted-foreground mb-8">
                Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  AfriMarket B2B s'engage à protéger la confidentialité de vos données personnelles. Cette politique
                  explique comment nous collectons, utilisons, partageons et protégeons vos informations personnelles.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Données collectées</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Nous collectons les types de données suivants :
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>Informations d'identification : nom, email, téléphone, adresse</li>
                  <li>Informations d'entreprise : nom, SIRET, secteur d'activité, adresse</li>
                  <li>Données de transaction : historique des achats et ventes</li>
                  <li>Données de navigation : adresse IP, cookies, pages visitées</li>
                  <li>Communications : messages échangés sur la plateforme</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Utilisation des données</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">Nous utilisons vos données pour :</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>Fournir et améliorer nos services</li>
                  <li>Traiter vos transactions et paiements</li>
                  <li>Communiquer avec vous concernant votre compte</li>
                  <li>Personnaliser votre expérience sur la plateforme</li>
                  <li>Prévenir la fraude et assurer la sécurité</li>
                  <li>Respecter nos obligations légales</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Partage des données</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Nous ne vendons pas vos données personnelles. Nous pouvons partager vos informations avec :
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>D'autres utilisateurs dans le cadre des transactions</li>
                  <li>Nos prestataires de services (paiement, hébergement, etc.)</li>
                  <li>Les autorités légales si requis par la loi</li>
                  <li>En cas de fusion ou acquisition de notre entreprise</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Sécurité des données</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos
                  données contre l'accès non autorisé, la perte ou la destruction. Cela inclut :
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>Chiffrement des données sensibles</li>
                  <li>Authentification sécurisée</li>
                  <li>Surveillance continue de la sécurité</li>
                  <li>Formation régulière de notre personnel</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Vos droits</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Vous disposez des droits suivants concernant vos données personnelles :
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>Droit d'accès à vos données</li>
                  <li>Droit de rectification des données inexactes</li>
                  <li>Droit à l'effacement de vos données</li>
                  <li>Droit à la limitation du traitement</li>
                  <li>Droit à la portabilité des données</li>
                  <li>Droit d'opposition au traitement</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Nous utilisons des cookies pour améliorer votre expérience sur notre plateforme. Vous pouvez gérer vos
                  préférences de cookies dans les paramètres de votre navigateur.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. Conservation des données</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services et
                  respecter nos obligations légales. Les données de transaction sont conservées pendant 10 ans
                  conformément aux obligations comptables.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">9. Modifications de la politique</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Nous pouvons modifier cette politique de confidentialité à tout moment. Les modifications seront
                  publiées sur cette page avec une date de mise à jour révisée.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">10. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Pour toute question concernant cette politique ou pour exercer vos droits, contactez-nous à{" "}
                  <a href="mailto:privacy@afrimarket.com" className="text-primary hover:underline">
                    privacy@afrimarket.com
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
