"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, Upload, X, FileText, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DocumentUpload } from "@/components/documents/document-upload"
import { FilePreview } from "@/components/documents/file-preview"
import { useToast } from "@/hooks/use-toast"
import { useCreateRequestMutation } from "@/lib/api/requests"
import type { Document } from "@/lib/api/documents"

interface RequestFormData {
  title: string
  description: string
  budgetMin: number
  budgetMax: number
  currency: "CFA" | "EUR" | "USD"
  deadline: string
  sector: string
  requirements: string
  attachedDocuments: Document[]
}

export function RequestForm() {
  const [formData, setFormData] = useState<RequestFormData>({
    title: "",
    description: "",
    budgetMin: 0,
    budgetMax: 0,
    currency: "CFA",
    deadline: "",
    sector: "",
    requirements: "",
    attachedDocuments: [],
  })
  const [showDocumentUpload, setShowDocumentUpload] = useState(false)
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)
  const { toast } = useToast()
  const [createRequest, { isLoading }] = useCreateRequestMutation()

  const handleInputChange = (field: keyof RequestFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDocumentUpload = (document: Document) => {
    setFormData((prev) => ({
      ...prev,
      attachedDocuments: [...prev.attachedDocuments, document],
    }))
    setShowDocumentUpload(false)
    toast({
      title: "Document ajouté",
      description: "Le document a été ajouté à votre demande.",
    })
  }

  const removeDocument = (documentId: string) => {
    setFormData((prev) => ({
      ...prev,
      attachedDocuments: prev.attachedDocuments.filter((doc) => doc.id !== documentId),
    }))
  }

  const handlePreviewDocument = async (document: Document) => {
    try {
      const response = await fetch(document.secureUrl)
      const blob = await response.blob()
      const file = new File([blob], document.originalName, { type: document.mimeType })
      setPreviewDocument({ ...document, file })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger le document pour la prévisualisation.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.sector) {
      toast({
        title: "Champs requis manquants",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      })
      return
    }

    if (formData.budgetMin >= formData.budgetMax) {
      toast({
        title: "Budget invalide",
        description: "Le budget maximum doit être supérieur au budget minimum.",
        variant: "destructive",
      })
      return
    }

    try {
      await createRequest({
        ...formData,
        documentIds: formData.attachedDocuments.map((doc) => doc.id),
      }).unwrap()

      toast({
        title: "Demande créée",
        description: "Votre demande de collaboration a été publiée avec succès.",
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        budgetMin: 0,
        budgetMax: 0,
        currency: "CFA",
        deadline: "",
        sector: "",
        requirements: "",
        attachedDocuments: [],
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la demande.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle Demande de Collaboration</CardTitle>
          <CardDescription>Décrivez votre projet et trouvez le partenaire idéal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de la demande *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Développement d'une application mobile"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sector">Secteur d'activité *</Label>
                <Select value={formData.sector} onValueChange={(value) => handleInputChange("sector", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technologie</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Consulting">Conseil</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Legal">Juridique</SelectItem>
                    <SelectItem value="Manufacturing">Fabrication</SelectItem>
                    <SelectItem value="Logistics">Logistique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description du projet *</Label>
              <Textarea
                id="description"
                placeholder="Décrivez en détail votre projet, vos objectifs et vos attentes..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                required
              />
            </div>

            {/* Budget and Currency */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="budgetMin">Budget minimum *</Label>
                <Input
                  id="budgetMin"
                  type="number"
                  placeholder="0"
                  value={formData.budgetMin || ""}
                  onChange={(e) => handleInputChange("budgetMin", Number.parseInt(e.target.value) || 0)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetMax">Budget maximum *</Label>
                <Input
                  id="budgetMax"
                  type="number"
                  placeholder="0"
                  value={formData.budgetMax || ""}
                  onChange={(e) => handleInputChange("budgetMax", Number.parseInt(e.target.value) || 0)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Devise</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value: "CFA" | "EUR" | "USD") => handleInputChange("currency", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CFA">CFA Franc</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    <SelectItem value="USD">Dollar US (USD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <Label htmlFor="deadline">Date limite souhaitée</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange("deadline", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <Label htmlFor="requirements">Exigences spécifiques</Label>
              <Textarea
                id="requirements"
                placeholder="Compétences requises, certifications, expérience minimale..."
                value={formData.requirements}
                onChange={(e) => handleInputChange("requirements", e.target.value)}
                rows={3}
              />
            </div>

            {/* Document Attachments */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Documents joints</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowDocumentUpload(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Ajouter un document
                </Button>
              </div>

              {formData.attachedDocuments.length > 0 && (
                <div className="space-y-2">
                  {formData.attachedDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">{doc.originalName}</p>
                          <p className="text-xs text-gray-500">{doc.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreviewDocument(doc)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(doc.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showDocumentUpload && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <DocumentUpload category="company" onUploadComplete={handleDocumentUpload} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDocumentUpload(false)}
                    className="mt-2"
                  >
                    Annuler
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="mr-2"
                  >
                    <Save className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isLoading ? "Publication..." : "Publier la demande"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Document Preview Modal */}
      <FilePreview
        file={previewDocument?.file || null}
        isOpen={!!previewDocument}
        onClose={() => setPreviewDocument(null)}
        onDownload={() => previewDocument && window.open(previewDocument.secureUrl, "_blank")}
      />
    </div>
  )
}
