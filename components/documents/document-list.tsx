"use client"
import { motion } from "framer-motion"
import { File, Download, Trash2, Calendar, Globe, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { type Document, useDeleteDocumentMutation } from "@/lib/api/documents"

interface DocumentListProps {
  documents: Document[]
  title: string
  description?: string
  showPublicIndicator?: boolean
}

const documentTypeLabels = {
  contract: "Contrat",
  invoice: "Facture",
  certificate: "Certificat",
  presentation: "Présentation",
  cv: "CV",
  certification: "Certification",
  diploma: "Diplôme",
  portfolio: "Portfolio",
  kbis: "KBIS",
  siret: "SIRET",
  identity: "Pièce d'identité",
  license: "Licence commerciale",
  delivery_proof: "Preuve de livraison",
  work_completion: "Preuve de réalisation",
  receipt: "Reçu",
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.includes("pdf")) return "📄"
  if (mimeType.includes("word")) return "📝"
  if (mimeType.includes("image")) return "🖼️"
  return "📁"
}

export function DocumentList({ documents, title, description, showPublicIndicator = false }: DocumentListProps) {
  const [deleteDocument] = useDeleteDocumentMutation()
  const { toast } = useToast()

  const handleDelete = async (documentId: string) => {
    try {
      await deleteDocument(documentId).unwrap()
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = (document: Document) => {
    // Open secure URL in new tab for download
    window.open(document.secureUrl, "_blank")
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun document téléchargé</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <File className="h-5 w-5" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="text-2xl">{getFileIcon(document.mimeType)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{document.originalName}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {documentTypeLabels[document.documentType]}
                    </Badge>
                    {showPublicIndicator && (
                      <Badge variant={document.isPublic ? "default" : "outline"} className="text-xs">
                        {document.isPublic ? (
                          <>
                            <Globe className="h-3 w-3 mr-1" />
                            Public
                          </>
                        ) : (
                          <>
                            <Lock className="h-3 w-3 mr-1" />
                            Privé
                          </>
                        )}
                      </Badge>
                    )}
                  </div>
                  {document.description && (
                    <p className="text-sm text-gray-600 truncate mb-1">{document.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(document.uploadedAt).toLocaleDateString("fr-FR")}
                    </span>
                    <span>{(document.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(document)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer le document</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer "{document.originalName}" ? Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(document.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
