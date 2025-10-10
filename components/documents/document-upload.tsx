"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Upload, File, X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import {
  useUploadCompanyDocumentMutation,
  useUploadPersonalDocumentMutation,
  useUploadVerificationDocumentMutation,
  useUploadTransactionProofMutation,
  type Document,
} from "@/lib/api/documents"
import { FilePreview } from "./file-preview"

interface DocumentUploadProps {
  category: "company" | "personal" | "verification" | "transaction_proof"
  transactionId?: string
  onUploadComplete?: (document: Document) => void
}

const documentTypesByCategory = {
  company: [
    { value: "contract", label: "Contrat" },
    { value: "invoice", label: "Facture" },
    { value: "certificate", label: "Certificat" },
    { value: "presentation", label: "Présentation" },
  ],
  personal: [
    { value: "cv", label: "CV" },
    { value: "certification", label: "Certification" },
    { value: "diploma", label: "Diplôme" },
    { value: "portfolio", label: "Portfolio" },
  ],
  verification: [
    { value: "kbis", label: "KBIS" },
    { value: "siret", label: "SIRET" },
    { value: "identity", label: "Pièce d'identité" },
    { value: "license", label: "Licence commerciale" },
  ],
  transaction_proof: [
    { value: "delivery_proof", label: "Preuve de livraison" },
    { value: "work_completion", label: "Preuve de réalisation" },
    { value: "invoice", label: "Facture" },
    { value: "receipt", label: "Reçu" },
  ],
}

const maxFileSizes = {
  company: 10 * 1024 * 1024, // 10MB
  personal: 10 * 1024 * 1024, // 10MB
  verification: 5 * 1024 * 1024, // 5MB
  transaction_proof: 10 * 1024 * 1024, // 10MB
}

const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
]

export function DocumentUpload({ category, transactionId, onUploadComplete }: DocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [documentType, setDocumentType] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const [uploadCompanyDocument, { isLoading: isUploadingCompany }] = useUploadCompanyDocumentMutation()
  const [uploadPersonalDocument, { isLoading: isUploadingPersonal }] = useUploadPersonalDocumentMutation()
  const [uploadVerificationDocument, { isLoading: isUploadingVerification }] = useUploadVerificationDocumentMutation()
  const [uploadTransactionProof, { isLoading: isUploadingTransaction }] = useUploadTransactionProofMutation()

  const isLoading = isUploadingCompany || isUploadingPersonal || isUploadingVerification || isUploadingTransaction

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Type de fichier non supporté",
        description: "Seuls les fichiers PDF, DOC, DOCX, JPG et PNG sont acceptés.",
        variant: "destructive",
      })
      return
    }

    // Validate file size
    const maxSize = maxFileSizes[category]
    if (file.size > maxSize) {
      toast({
        title: "Fichier trop volumineux",
        description: `La taille maximale autorisée est de ${maxSize / (1024 * 1024)}MB.`,
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !documentType) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez sélectionner un fichier et un type de document.",
        variant: "destructive",
      })
      return
    }

    const formData = new FormData()
    formData.append("document", selectedFile)
    formData.append("documentType", documentType)
    if (description) formData.append("description", description)
    if (category === "personal") formData.append("isPublic", isPublic.toString())
    if (transactionId) formData.append("transactionId", transactionId)

    try {
      let result
      switch (category) {
        case "company":
          result = await uploadCompanyDocument(formData).unwrap()
          break
        case "personal":
          result = await uploadPersonalDocument(formData).unwrap()
          break
        case "verification":
          result = await uploadVerificationDocument(formData).unwrap()
          break
        case "transaction_proof":
          result = await uploadTransactionProof(formData).unwrap()
          break
      }

      toast({
        title: "Document téléchargé",
        description: "Votre document a été téléchargé avec succès.",
      })

      // Reset form
      setSelectedFile(null)
      setDocumentType("")
      setDescription("")
      setIsPublic(false)
      setShowPreview(false)
      if (fileInputRef.current) fileInputRef.current.value = ""

      onUploadComplete?.(result)
    } catch (error) {
      toast({
        title: "Erreur de téléchargement",
        description: "Une erreur est survenue lors du téléchargement.",
        variant: "destructive",
      })
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setShowPreview(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Télécharger un document
        </CardTitle>
        <CardDescription>
          {category === "company" && "Téléchargez des documents d'entreprise (contrats, factures, etc.)"}
          {category === "personal" && "Téléchargez vos documents personnels (CV, certifications, etc.)"}
          {category === "verification" && "Téléchargez vos documents de vérification (KBIS, SIRET, etc.)"}
          {category === "transaction_proof" && "Téléchargez les preuves de transaction"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : selectedFile
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3"
            >
              <File className="h-8 w-8 text-green-600" />
              <div className="text-left">
                <p className="font-medium text-green-700">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(true)}
                className="text-blue-500 hover:text-blue-700"
              >
                Prévisualiser
              </Button>
              <Button variant="ghost" size="sm" onClick={removeFile} className="text-red-500 hover:text-red-700">
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <div>
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">Glissez-déposez votre fichier ici</p>
              <p className="text-gray-500 mb-4">ou cliquez pour sélectionner</p>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                Sélectionner un fichier
              </Button>
              <p className="text-xs text-gray-400 mt-2">
                PDF, DOC, DOCX, JPG, PNG - Max {maxFileSizes[category] / (1024 * 1024)}MB
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileInputChange}
        />

        {/* Document Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="documentType">Type de document *</Label>
          <Select value={documentType} onValueChange={setDocumentType}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez le type de document" />
            </SelectTrigger>
            <SelectContent>
              {documentTypesByCategory[category].map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (optionnel)</Label>
          <Textarea
            id="description"
            placeholder="Décrivez brièvement ce document..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Public/Private Toggle for Personal Documents */}
        {category === "personal" && (
          <div className="flex items-center space-x-2">
            <Switch id="isPublic" checked={isPublic} onCheckedChange={setIsPublic} />
            <Label htmlFor="isPublic">Rendre ce document public (visible par les autres utilisateurs)</Label>
          </div>
        )}

        {/* Upload Button */}
        <Button onClick={handleUpload} disabled={!selectedFile || !documentType || isLoading} className="w-full">
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="mr-2"
            >
              <Upload className="h-4 w-4" />
            </motion.div>
          ) : (
            <CheckCircle className="h-4 w-4 mr-2" />
          )}
          {isLoading ? "Téléchargement..." : "Télécharger le document"}
        </Button>

        {/* File Preview Component */}
        <FilePreview file={selectedFile} isOpen={showPreview} onClose={() => setShowPreview(false)} />
      </CardContent>
    </Card>
  )
}
