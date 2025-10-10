"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Bell, Shield, CreditCard, Globe, Moon, Sun, Monitor, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      marketing: false,
      messages: true,
      requests: true,
      payments: true,
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false,
    },
    preferences: {
      language: "fr",
      currency: "XOF",
      theme: "system",
    },
  })

  const handleSave = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences ont été mises à jour.",
    })
  }

  const handleDeleteAccount = () => {
    // Show confirmation dialog
    toast({
      title: "Suppression de compte",
      description: "Cette action est irréversible. Contactez le support pour confirmer.",
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">Gérez vos préférences et paramètres de compte</p>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>Configurez vos préférences de notification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications par email</Label>
              <p className="text-sm text-muted-foreground">Recevoir des notifications par email</p>
            </div>
            <Switch
              checked={settings.notifications.email}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, email: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications push</Label>
              <p className="text-sm text-muted-foreground">Recevoir des notifications push</p>
            </div>
            <Switch
              checked={settings.notifications.push}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, push: checked },
                })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Messages</Label>
              <p className="text-sm text-muted-foreground">Nouveaux messages et conversations</p>
            </div>
            <Switch
              checked={settings.notifications.messages}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, messages: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Demandes de collaboration</Label>
              <p className="text-sm text-muted-foreground">Nouvelles demandes et réponses</p>
            </div>
            <Switch
              checked={settings.notifications.requests}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, requests: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Paiements</Label>
              <p className="text-sm text-muted-foreground">Transactions et factures</p>
            </div>
            <Switch
              checked={settings.notifications.payments}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, payments: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing</Label>
              <p className="text-sm text-muted-foreground">Offres spéciales et nouveautés</p>
            </div>
            <Switch
              checked={settings.notifications.marketing}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, marketing: checked },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <CardTitle>Confidentialité</CardTitle>
          </div>
          <CardDescription>Contrôlez la visibilité de vos informations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Profil public</Label>
              <p className="text-sm text-muted-foreground">Votre profil est visible par les autres entreprises</p>
            </div>
            <Switch
              checked={settings.privacy.profileVisible}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  privacy: { ...settings.privacy, profileVisible: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Afficher l'email</Label>
              <p className="text-sm text-muted-foreground">Votre email est visible sur votre profil public</p>
            </div>
            <Switch
              checked={settings.privacy.showEmail}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  privacy: { ...settings.privacy, showEmail: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Afficher le téléphone</Label>
              <p className="text-sm text-muted-foreground">Votre numéro est visible sur votre profil public</p>
            </div>
            <Switch
              checked={settings.privacy.showPhone}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  privacy: { ...settings.privacy, showPhone: checked },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <CardTitle>Préférences</CardTitle>
          </div>
          <CardDescription>Langue, devise et apparence</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Langue</Label>
              <Select
                value={settings.preferences.language}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, language: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Devise par défaut</Label>
              <Select
                value={settings.preferences.currency}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, currency: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XOF">CFA Franc (XOF)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  <SelectItem value="USD">Dollar US (USD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Thème</Label>
            <Select
              value={settings.preferences.theme}
              onValueChange={(value) =>
                setSettings({
                  ...settings,
                  preferences: { ...settings.preferences, theme: value },
                })
              }
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center">
                    <Sun className="w-4 h-4 mr-2" />
                    Clair
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center">
                    <Moon className="w-4 h-4 mr-2" />
                    Sombre
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center">
                    <Monitor className="w-4 h-4 mr-2" />
                    Système
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <CardTitle>Gestion du compte</CardTitle>
          </div>
          <CardDescription>Paramètres avancés du compte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Statut du compte</Label>
              <p className="text-sm text-muted-foreground">Votre compte est vérifié et actif</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Vérifié
            </Badge>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Changer le mot de passe</Label>
                <p className="text-sm text-muted-foreground">Dernière modification il y a 3 mois</p>
              </div>
              <Button variant="outline">Modifier</Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Authentification à deux facteurs</Label>
                <p className="text-sm text-muted-foreground">Sécurisez votre compte avec 2FA</p>
              </div>
              <Button variant="outline">Configurer</Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-destructive">Supprimer le compte</Label>
                <p className="text-sm text-muted-foreground">Cette action est irréversible</p>
              </div>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Sauvegarder les paramètres
        </Button>
      </div>
    </div>
  )
}
