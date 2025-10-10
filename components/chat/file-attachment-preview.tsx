"use client"

import { useState } from "react"
import { X, Send, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { FilePreview } from "@/components/documents/file-preview"

interface FileAttachmentPreviewProps {
  file: File | null
  isOpen: boolean
  onClose: () => void
  onSend: (file: File, message?: string) => void
}

export function FileAttachmentPreview({ file, isOpen, onClose, onSend }: FileAttachmentPreviewProps) {
  const [message, setMessage] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  if (!file) return null

  const handleSend = () => {
    onSend(file, message.trim() || undefined)
    setMessage("")
    onClose()
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return "🖼️"
    if (type === "application/pdf") return "📄"
    if (type.includes("word")) return "📝"
    return "📁"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Envoyer un fichier</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Info */}
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <div className="text-2xl">{getFileIcon(file.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(true)}
              className="text-blue-500 hover:text-blue-700"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          {/* Optional Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Message (optionnel)</label>
            <Input placeholder="Ajouter un message..." value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={handleSend}>
              <Send className="h-4 w-4 mr-2" />
              Envoyer
            </Button>
          </div>
        </div>

        {/* File Preview Modal */}
        <FilePreview file={file} isOpen={showPreview} onClose={() => setShowPreview(false)} />
      </DialogContent>
    </Dialog>
  )
}
