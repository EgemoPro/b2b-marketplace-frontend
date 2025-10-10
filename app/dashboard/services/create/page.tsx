"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Plus, Save, Eye } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function CreateServicePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    currency: "XOF",
    duration: "",
    location: "",
    tags: [] as string[],
    images: [] as string[],
    isActive: true,
  })
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    "Technologie",
    "Conseil",
    "Formation",
    "Marketing",
    "Design",
    "Logistique",
    "Finance",
    "Juridique",
    "Ressources Humaines",
    "Autre",
  ]

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      // Mock image upload - replace with actual upload logic
      const newImages = Array.from(files).map(
        (file, index) => `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(file.name)}`,
      )
      setFormData({
        ...formData,
        images: [...formData.images, ...newImages].slice(0, 5), // Max 5 images
      })
    }
  }

  const handleRemoveImage = (imageToRemove: string) => {
    setFormData({
      ...formData,
      images: formData.images.filter((img) => img !== imageToRemove),
    })
  }

  const handleSubmit = async (isDraft = false) => {
    setIsSubmitting(true)

    // Validation
    if (!formData.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre est requis.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: isDraft ? "Brouillon sauvegardé" : "Service créé",
        description: isDraft
          ? "Votre service a été sauvegardé en brouillon."
          : "Votre service a été publié avec succès.",
      })

      router.push("/dashboard/services")
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du service.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Créer un service</h1>
          <p className="text-muted-foreground">Ajoutez un nouveau service à votre catalogue</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleSubmit(true)} disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
          <Button onClick={() => handleSubmit(false)} disabled={isSubmitting}>
            <Eye className="w-4 h-4 mr-2" />
            Publier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de base</CardTitle>
              <CardDescription>Décrivez votre service de manière claire et attractive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du service *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Développement d'applications web"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez en détail votre service, vos compétences et ce que vous proposez..."
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: Dakar, Sénégal"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Tarification</CardTitle>
              <CardDescription>Définissez le prix de votre service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="price">Prix</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Devise</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
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
                <Label htmlFor="duration">Durée estimée</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="Ex: 2-3 semaines, 1 mois, Sur mesure"
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>Ajoutez des images pour illustrer votre service (max 5)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Service image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                      onClick={() => handleRemoveImage(image)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                {formData.images.length < 5 && (
                  <label className="border-2 border-dashed border-muted-foreground/25 rounded-lg h-24 flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
                    <div className="text-center">
                      <Upload className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Ajouter</span>
                    </div>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Mots-clés</CardTitle>
              <CardDescription>Ajoutez des mots-clés pour améliorer la visibilité</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Ajouter un mot-clé"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                    {tag}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publication Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de publication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Service actif</Label>
                  <p className="text-sm text-muted-foreground">Visible par les autres entreprises</p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Aperçu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  {formData.images.length > 0 ? (
                    <img
                      src={formData.images[0] || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-muted-foreground text-sm">Aucune image</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold line-clamp-2">{formData.title || "Titre du service"}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {formData.description || "Description du service"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {formData.price
                      ? `${Number.parseInt(formData.price).toLocaleString()} ${formData.currency}`
                      : "Prix non défini"}
                  </span>
                  {formData.category && <Badge variant="outline">{formData.category}</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
