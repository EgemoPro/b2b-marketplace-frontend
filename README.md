# 🌍 AFRIMARKET B2B - Marketplace Africaine

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/egemopros-projects/v0-b2-b-marketplace-frontend)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/ALJpW91sS6y)

## 🎯 Qu'est-ce qu'AFRIMARKET B2B ?

**AFRIMARKET B2B** est la première marketplace dédiée au commerce inter-entreprises africain. Notre plateforme facilite les échanges commerciaux entre entreprises du continent en offrant un environnement sécurisé, des outils de communication avancés et un support natif du CFA Franc.

### 🚀 Mission
Connecter l'écosystème B2B africain en permettant aux entreprises de trouver des partenaires commerciaux fiables, de négocier des contrats et de réaliser des transactions sécurisées.

## ✨ Fonctionnalités principales

### 🏢 **Gestion d'entreprises**
- ✅ Inscription et vérification d'entreprises (KBIS, SIRET)
- ✅ Profils détaillés avec secteur d'activité et certifications
- ✅ Système de badges de vérification pour garantir la confiance

### 🛍️ **Catalogue de services**
- ✅ Publication et recherche de services B2B
- ✅ Filtres avancés (secteur, prix, devise, localisation)
- ✅ Support multi-devises (CFA Franc, EUR, USD)
- ✅ Interface responsive avec navigation mobile

### 💬 **Communication temps réel**
- ✅ Chat instantané entre entreprises via WebSocket
- ✅ Système de notifications en temps réel
- ✅ Historique des conversations et indicateurs de statut

### 💳 **Paiements sécurisés**
- ✅ Intégration Stripe avec support CFA Franc
- ✅ Système d'escrow pour sécuriser les transactions
- ✅ Gestion des litiges et libération de fonds
- ✅ Dashboard des paiements avec historique complet

### 📄 **Gestion documentaire**
- ✅ Upload de documents d'entreprise (contrats, factures, présentations)
- ✅ Documents de vérification (KBIS, licences, cartes d'identité)
- ✅ Preuves de transaction et portfolios
- ✅ Validation des formats et tailles (PDF, DOC, DOCX, JPG, PNG)

### 🤝 **Système de collaboration**
- ✅ Demandes de partenariat structurées
- ✅ Propositions commerciales avec pièces jointes
- ✅ Suivi des négociations et gestion des statuts

### 👨‍💼 **Administration**
- ✅ Dashboard admin complet avec statistiques
- ✅ Modération des services et utilisateurs
- ✅ Résolution des litiges et gestion des transactions

### 📱 **Application mobile (PWA)**
- ✅ Installation sur mobile et desktop
- ✅ Fonctionnement hors ligne
- ✅ Interface responsive optimisée
- ✅ Menu mobile avec navigation intuitive

## 🎯 Cas d'usage

### 👨‍💼 **Pour les fournisseurs**
- **Entreprise de logistique sénégalaise** : Publier ses services de transport et recevoir des demandes de devis avec paiement sécurisé en CFA
- **Société IT ivoirienne** : Proposer ses services de développement web aux entreprises de la région avec portfolio intégré
- **Fabricant textile marocain** : Vendre ses produits en gros à des distributeurs africains avec système d'escrow

### 🛒 **Pour les clients**
- **Startup camerounaise** : Trouver un prestataire comptable certifié dans sa région avec vérification KBIS
- **Distributeur nigérian** : Sourcer des produits auprès de fabricants vérifiés avec chat temps réel
- **Entreprise de construction malienne** : Trouver des fournisseurs de matériaux avec négociation intégrée

### 🔧 **Pour les administrateurs**
- **Modération** : Valider les nouvelles entreprises et services via dashboard dédié
- **Support** : Résoudre les litiges entre partenaires commerciaux avec outils intégrés
- **Analytics** : Suivre les performances de la plateforme avec métriques détaillées

## 🛠️ Technologies utilisées

### Frontend
- **Next.js 15** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS v4** pour le styling
- **Framer Motion** pour les animations
- **Lucide React** pour les icônes

### État et données
- **Redux Toolkit** avec RTK Query pour la gestion d'état
- **WebSocket** pour la communication temps réel
- **PWA** avec Service Worker pour le mode hors ligne

### UI/UX
- **shadcn/ui** pour les composants
- **Design responsive** mobile-first
- **Thème sombre/clair** adaptatif
- **Animations fluides** et micro-interactions

## 🚀 Déploiement

### Application live
**[https://vercel.com/egemopros-projects/v0-b2-b-marketplace-frontend](https://vercel.com/egemopros-projects/v0-b2-b-marketplace-frontend)**

### Continuer le développement
**[https://v0.app/chat/projects/ALJpW91sS6y](https://v0.app/chat/projects/ALJpW91sS6y)**

## 📋 Variables d'environnement requises

\`\`\`env
NEXT_PUBLIC_API_URL=https://your-api-url.com
NEXT_PUBLIC_WS_URL=wss://your-websocket-url.com
\`\`\`

## 🔄 Comment ça fonctionne

1. **Développement** : Créez et modifiez votre projet sur [v0.app](https://v0.app)
2. **Déploiement** : Déployez vos modifications depuis l'interface v0
3. **Synchronisation** : Les changements sont automatiquement poussés vers ce repository
4. **Production** : Vercel déploie la dernière version depuis ce repository

## 🌟 Fonctionnalités à venir

- [ ] Intégration avec d'autres passerelles de paiement africaines
- [ ] Système de reviews et notations avancé
- [ ] API publique pour intégrations tierces
- [ ] Support de langues locales africaines
- [ ] Marketplace de services financiers B2B

---

*Construit avec ❤️ pour l'écosystème B2B africain*
