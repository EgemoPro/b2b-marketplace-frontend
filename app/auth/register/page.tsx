"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useRegisterMutation } from "@/lib/api/auth"
import { useAppDispatch } from "@/lib/hooks"
import { setCredentials } from "@/lib/slices/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  MapPin,
  Building2,
  User,
  Check,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  FileText,
  Globe,
  Users,
  UserCircle,
} from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"

type AccountType = "individual" | "business" | ""

interface FormData {
  email: string
  password: string
  confirmPassword: string
  accountType: AccountType
  role: "client" | "supplier" | ""
  // Individual fields
  firstName: string
  lastName: string
  // Business fields
  companyName: string
  siret: string
  sector: string
  description: string
  companySize: string
  website: string
  // Common fields
  address: string
  phone: string
  country: string
}

const STEPS = {
  individual: [
    { id: 1, title: "Type de compte", icon: UserCircle },
    { id: 2, title: "Informations personnelles", icon: User },
    { id: 3, title: "Sécurité", icon: Lock },
    { id: 4, title: "Coordonnées", icon: Phone },
  ],
  business: [
    { id: 1, title: "Type de compte", icon: UserCircle },
    { id: 2, title: "Entreprise", icon: Building2 },
    { id: 3, title: "Activité", icon: Briefcase },
    { id: 4, title: "Sécurité", icon: Lock },
    { id: 5, title: "Coordonnées", icon: Phone },
  ],
}

const COUNTRIES = [
  "Sénégal",
  "Côte d'Ivoire",
  "Cameroun",
  "Mali",
  "Burkina Faso",
  "Niger",
  "Bénin",
  "Togo",
  "Guinée",
  "Congo",
  "Gabon",
  "Maroc",
  "Tunisie",
  "Algérie",
  "Nigeria",
  "Ghana",
  "Kenya",
  "Afrique du Sud",
]

const SECTORS = [
  { value: "Technology", label: "Technologie & IT" },
  { value: "Agriculture", label: "Agriculture & Agroalimentaire" },
  { value: "Manufacturing", label: "Industrie & Fabrication" },
  { value: "Services", label: "Services aux entreprises" },
  { value: "Commerce", label: "Commerce & Distribution" },
  { value: "Construction", label: "BTP & Construction" },
  { value: "Transport", label: "Transport & Logistique" },
  { value: "Finance", label: "Finance & Assurance" },
  { value: "Energy", label: "Énergie & Environnement" },
  { value: "Health", label: "Santé & Pharma" },
]

const COMPANY_SIZES = [
  { value: "1-10", label: "1-10 employés" },
  { value: "11-50", label: "11-50 employés" },
  { value: "51-200", label: "51-200 employés" },
  { value: "201-500", label: "201-500 employés" },
  { value: "500+", label: "Plus de 500 employés" },
]

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "",
    role: "",
    firstName: "",
    lastName: "",
    companyName: "",
    siret: "",
    sector: "",
    description: "",
    companySize: "",
    website: "",
    address: "",
    phone: "",
    country: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [register, { isLoading, error }] = useRegisterMutation()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const steps = formData.accountType === "business" ? STEPS.business : STEPS.individual
  const totalSteps = steps.length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      return
    }

    try {
      const { confirmPassword, ...registerData } = formData
      const result = await register(registerData).unwrap()
      dispatch(setCredentials(result))
      router.push("/dashboard")
    } catch (err) {
      console.error("Registration failed:", err)
    }
  }

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.accountType !== "" && formData.role !== ""
      case 2:
        if (formData.accountType === "individual") {
          return formData.firstName !== "" && formData.lastName !== "" && formData.email !== ""
        }
        return formData.companyName !== "" && formData.email !== ""
      case 3:
        if (formData.accountType === "individual") {
          return (
            formData.password !== "" && formData.password === formData.confirmPassword && formData.password.length >= 8
          )
        }
        return formData.sector !== "" && formData.companySize !== ""
      case 4:
        if (formData.accountType === "individual") {
          return formData.phone !== "" && formData.country !== ""
        }
        return (
          formData.password !== "" && formData.password === formData.confirmPassword && formData.password.length >= 8
        )
      case 5:
        return formData.phone !== "" && formData.country !== ""
      default:
        return false
    }
  }

  const isLastStep = currentStep === totalSteps

  // Render step content based on account type and current step
  const renderStepContent = () => {
    // Step 1: Account Type Selection (common for both)
    if (currentStep === 1) {
      return (
        <motion.div
          key="step-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold">Choisissez votre type de compte</h3>
            <p className="text-sm text-muted-foreground">
              Sélectionnez le type de compte qui correspond à votre situation
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Individual Account Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateFormData("accountType", "individual")}
              className={cn(
                "relative cursor-pointer rounded-xl border-2 p-6 transition-all",
                formData.accountType === "individual"
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-border hover:border-primary/50 hover:bg-muted/50",
              )}
            >
              {formData.accountType === "individual" && (
                <div className="absolute top-3 right-3">
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
              )}
              <div className="flex flex-col items-center text-center space-y-3">
                <div
                  className={cn(
                    "h-16 w-16 rounded-full flex items-center justify-center",
                    formData.accountType === "individual" ? "bg-primary/20" : "bg-muted",
                  )}
                >
                  <User
                    className={cn(
                      "h-8 w-8",
                      formData.accountType === "individual" ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Compte Individuel</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pour les freelances, consultants et professionnels indépendants
                  </p>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1 text-left">
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-primary" /> Inscription simplifiée
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-primary" /> Profil personnel
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-primary" /> Accès aux services B2B
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Business Account Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateFormData("accountType", "business")}
              className={cn(
                "relative cursor-pointer rounded-xl border-2 p-6 transition-all",
                formData.accountType === "business"
                  ? "border-secondary bg-secondary/5 shadow-lg"
                  : "border-border hover:border-secondary/50 hover:bg-muted/50",
              )}
            >
              {formData.accountType === "business" && (
                <div className="absolute top-3 right-3">
                  <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                    <Check className="h-4 w-4 text-secondary-foreground" />
                  </div>
                </div>
              )}
              <div className="flex flex-col items-center text-center space-y-3">
                <div
                  className={cn(
                    "h-16 w-16 rounded-full flex items-center justify-center",
                    formData.accountType === "business" ? "bg-secondary/20" : "bg-muted",
                  )}
                >
                  <Building2
                    className={cn(
                      "h-8 w-8",
                      formData.accountType === "business" ? "text-secondary" : "text-muted-foreground",
                    )}
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Compte Entreprise</h4>
                  <p className="text-xs text-muted-foreground mt-1">Pour les sociétés, PME et grandes entreprises</p>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1 text-left">
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-secondary" /> Badge entreprise vérifié
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-secondary" /> Outils collaboratifs
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-secondary" /> Facturation entreprise
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Role Selection */}
          {formData.accountType && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 pt-4 border-t"
            >
              <Label>Quel est votre objectif principal ?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => updateFormData("role", "client")}
                  className={cn(
                    "cursor-pointer rounded-lg border p-4 transition-all",
                    formData.role === "client"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Users
                      className={cn("h-5 w-5", formData.role === "client" ? "text-primary" : "text-muted-foreground")}
                    />
                    <div>
                      <p className="font-medium text-sm">Client</p>
                      <p className="text-xs text-muted-foreground">Je recherche des services</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => updateFormData("role", "supplier")}
                  className={cn(
                    "cursor-pointer rounded-lg border p-4 transition-all",
                    formData.role === "supplier"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Briefcase
                      className={cn("h-5 w-5", formData.role === "supplier" ? "text-primary" : "text-muted-foreground")}
                    />
                    <div>
                      <p className="font-medium text-sm">Fournisseur</p>
                      <p className="text-xs text-muted-foreground">J'offre des services</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )
    }

    // Individual Account Steps
    if (formData.accountType === "individual") {
      switch (currentStep) {
        case 2:
          return (
            <motion.div
              key="individual-step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">Informations personnelles</h3>
                <p className="text-sm text-muted-foreground">Dites-nous en plus sur vous</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      placeholder="Votre prénom"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      placeholder="Votre nom"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Domaine d'activité (optionnel)</Label>
                <Select value={formData.sector} onValueChange={(value) => updateFormData("sector", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre domaine" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS.map((sector) => (
                      <SelectItem key={sector.value} value={sector.value}>
                        {sector.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )
        case 3:
          return (
            <motion.div
              key="individual-step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">Sécurité du compte</h3>
                <p className="text-sm text-muted-foreground">Créez un mot de passe sécurisé</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Minimum 8 caractères</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-destructive">Les mots de passe ne correspondent pas</p>
                )}
              </div>

              {/* Password Strength Indicator */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Force du mot de passe</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        formData.password.length >= level * 2
                          ? level <= 2
                            ? "bg-destructive"
                            : level === 3
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          : "bg-muted",
                      )}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )
        case 4:
          return (
            <motion.div
              key="individual-step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">Coordonnées</h3>
                <p className="text-sm text-muted-foreground">Comment vous contacter ?</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="+221 70 123 45 67"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Select value={formData.country} onValueChange={(value) => updateFormData("country", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre pays" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse (optionnel)</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    placeholder="Votre adresse"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </motion.div>
          )
      }
    }

    // Business Account Steps
    if (formData.accountType === "business") {
      switch (currentStep) {
        case 2:
          return (
            <motion.div
              key="business-step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-secondary/20 mb-2">
                  <Building2 className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold">Informations entreprise</h3>
                <p className="text-sm text-muted-foreground">Présentez votre société</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Nom de l'entreprise</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companyName"
                    placeholder="Nom de votre entreprise"
                    value={formData.companyName}
                    onChange={(e) => updateFormData("companyName", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@entreprise.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siret">SIRET / Numéro fiscal</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="siret"
                      placeholder="12345678901234"
                      value={formData.siret}
                      onChange={(e) => updateFormData("siret", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Site web (optionnel)</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      placeholder="https://www.entreprise.com"
                      value={formData.website}
                      onChange={(e) => updateFormData("website", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )
        case 3:
          return (
            <motion.div
              key="business-step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-secondary/20 mb-2">
                  <Briefcase className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold">Activité de l'entreprise</h3>
                <p className="text-sm text-muted-foreground">Décrivez votre secteur d'activité</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Secteur d'activité</Label>
                <Select value={formData.sector} onValueChange={(value) => updateFormData("sector", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS.map((sector) => (
                      <SelectItem key={sector.value} value={sector.value}>
                        {sector.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize">Taille de l'entreprise</Label>
                <Select value={formData.companySize} onValueChange={(value) => updateFormData("companySize", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Nombre d'employés" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description de l'entreprise (optionnel)</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez brièvement votre entreprise et vos activités..."
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  rows={3}
                />
              </div>
            </motion.div>
          )
        case 4:
          return (
            <motion.div
              key="business-step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-secondary/20 mb-2">
                  <Lock className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold">Sécurité du compte</h3>
                <p className="text-sm text-muted-foreground">Créez un mot de passe sécurisé</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Minimum 8 caractères</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-destructive">Les mots de passe ne correspondent pas</p>
                )}
              </div>

              {/* Password Strength Indicator */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Force du mot de passe</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        formData.password.length >= level * 2
                          ? level <= 2
                            ? "bg-destructive"
                            : level === 3
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          : "bg-muted",
                      )}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )
        case 5:
          return (
            <motion.div
              key="business-step-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-secondary/20 mb-2">
                  <Phone className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold">Coordonnées</h3>
                <p className="text-sm text-muted-foreground">Où se situe votre entreprise ?</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="+221 70 123 45 67"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Select value={formData.country} onValueChange={(value) => updateFormData("country", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre pays" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    placeholder="Adresse complète"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </motion.div>
          )
      }
    }

    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-4"
          >
            <Logo size="xl" className="justify-center" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground">AfriMarket B2B</h1>
          <p className="text-muted-foreground mt-2">Créez votre compte professionnel</p>
        </div>

        <Card className="border-0 shadow-xl overflow-hidden">
          {/* Stepper Header */}
          {formData.accountType && (
            <div
              className={cn(
                "px-6 py-4 border-b",
                formData.accountType === "business" ? "bg-secondary/5" : "bg-primary/5",
              )}
            >
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const StepIcon = step.icon
                  const isCompleted = step.id < currentStep
                  const isCurrent = step.id === currentStep

                  return (
                    <div key={step.id} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <motion.div
                          initial={false}
                          animate={{
                            scale: isCurrent ? 1.1 : 1,
                            backgroundColor: isCompleted
                              ? formData.accountType === "business"
                                ? "hsl(var(--secondary))"
                                : "hsl(var(--primary))"
                              : isCurrent
                                ? formData.accountType === "business"
                                  ? "hsl(var(--secondary))"
                                  : "hsl(var(--primary))"
                                : "hsl(var(--muted))",
                          }}
                          className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                            (isCompleted || isCurrent) && "text-white",
                          )}
                        >
                          {isCompleted ? <Check className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
                        </motion.div>
                        <span
                          className={cn(
                            "text-xs mt-1 hidden sm:block",
                            isCurrent ? "text-foreground font-medium" : "text-muted-foreground",
                          )}
                        >
                          {step.title}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={cn(
                            "h-0.5 w-8 sm:w-12 mx-2",
                            isCompleted
                              ? formData.accountType === "business"
                                ? "bg-secondary"
                                : "bg-primary"
                              : "bg-muted",
                          )}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">
              {currentStep === 1 ? "Inscription" : `Étape ${currentStep} sur ${totalSteps}`}
            </CardTitle>
            <CardDescription className="text-center">Rejoignez la marketplace B2B africaine</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {"data" in error ? (error.data as any)?.message || "Erreur d'inscription" : "Erreur d'inscription"}
                  </AlertDescription>
                </Alert>
              )}

              <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button type="button" variant="ghost" onClick={prevStep} disabled={currentStep === 1} className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Retour
                </Button>

                {isLastStep ? (
                  <Button
                    type="submit"
                    disabled={isLoading || !canProceed()}
                    loading={isLoading}
                    className={cn("gap-2", formData.accountType === "business" && "bg-secondary hover:bg-secondary/90")}
                  >
                    Créer mon compte
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className={cn("gap-2", formData.accountType === "business" && "bg-secondary hover:bg-secondary/90")}
                  >
                    Continuer
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Déjà un compte ? </span>
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Se connecter
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
