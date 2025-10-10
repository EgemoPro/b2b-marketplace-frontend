"use client"

import { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { motion } from "framer-motion"
import { X, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

interface FilePreviewProps {
  file: File | null
  isOpen: boolean
  onClose: () => void
  onDownload?: () => void
}

export function FilePreview({ file, isOpen, onClose, onDownload }: FilePreviewProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [loading, setLoading] = useState<boolean>(true)
  const { toast } = useToast()

  if (!file) return null

  const isImage = file.type.startsWith("image/")
  const isPDF = file.type === "application/pdf"
  const isDocument = file.type.includes("word") || file.type.includes("document")

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setLoading(false)
  }

  const onDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF:", error)
    setLoading(false)
    toast({
      title: "Erreur de chargement",
      description: "Impossible de charger le document PDF.",
      variant: "destructive",
    })
  }

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => {
      const newPageNumber = prevPageNumber + offset
      return Math.max(1, Math.min(newPageNumber, numPages))
    })
  }

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3.0))
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <DialogTitle className="truncate">{file.name}</DialogTitle>
            <Badge variant="secondary" className="text-xs">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {isPDF && (
              <>
                <Button variant="ghost" size="sm" onClick={zoomOut} disabled={scale <= 0.5}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600 min-w-[60px] text-center">{Math.round(scale * 100)}%</span>
                <Button variant="ghost" size="sm" onClick={zoomIn} disabled={scale >= 3.0}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </>
            )}
            {onDownload && (
              <Button variant="ghost" size="sm" onClick={onDownload}>
                <Download className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {isImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center p-4"
            >
              <img
                src={URL.createObjectURL(file) || "/placeholder.svg"}
                alt={file.name}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onLoad={() => setLoading(false)}
              />
            </motion.div>
          )}

          {isPDF && (
            <div className="flex flex-col items-center space-y-4">
              {loading && (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}

              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading=""
                className="flex justify-center"
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  className="shadow-lg"
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>

              {numPages > 1 && (
                <div className="flex items-center gap-4 bg-gray-100 rounded-lg px-4 py-2">
                  <Button variant="ghost" size="sm" onClick={() => changePage(-1)} disabled={pageNumber <= 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    Page {pageNumber} sur {numPages}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => changePage(1)} disabled={pageNumber >= numPages}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {isDocument && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-lg font-medium mb-2">Document Word</p>
              <p className="text-sm text-center">
                La prévisualisation n'est pas disponible pour ce type de fichier.
                <br />
                Téléchargez le fichier pour le consulter.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
