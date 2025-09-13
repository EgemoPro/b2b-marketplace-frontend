"use client"

import type React from "react"

import { useState } from "react"
import { useCreatePaymentIntentMutation } from "@/lib/api/payments"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Shield, AlertCircle } from "lucide-react"

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentModal({ open, onOpenChange }: PaymentModalProps) {
  const [formData, setFormData] = useState({
    amount: "",
    currency: "CFA" as "CFA" | "EUR" | "USD",
    description: "",
    recipientId: "",
    useEscrow: true,
  })

  const [createPaymentIntent, { isLoading, error }] = useCreatePaymentIntentMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount || !formData.description || !formData.recipientId) {
      return
    }

    try {
      const result = await createPaymentIntent({
        amount: Number(formData.amount),
        currency: formData.currency,
        description: formData.description,
        recipientId: formData.recipientId,
        useEscrow: formData.useEscrow,
      }).unwrap()

      // Redirect to Stripe payment page or handle payment intent
      console.log("Payment intent created:", result)
      onOpenChange(false)

      // Reset form
      setFormData({
        amount: "",
        currency: "CFA",
        description: "",
        recipientId: "",
        useEscrow: true,
      })
    } catch (error) {
      console.error("Failed to create payment:", error)
    }
  }

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Nouveau paiement
          </DialogTitle>
          <DialogDescription>Effectuez un paiement sécurisé avec ou sans séquestre</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {"data" in error
                  ? (error.data as any)?.message || "Erreur lors de la création du paiement"
                  : "Erreur lors de la création du paiement"}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={formData.amount}
                onChange={(e) => updateFormData("amount", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Select value={formData.currency} onValueChange={(value) => updateFormData("currency", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CFA">CFA Franc</SelectItem>
                  <SelectItem value="EUR">Euro</SelectItem>
                  <SelectItem value="USD">Dollar US</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipientId">Destinataire</Label>
            <Input
              id="recipientId"
              placeholder="ID ou email du destinataire"
              value={formData.recipientId}
              onChange={(e) => updateFormData("recipientId", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Décrivez le motif du paiement..."
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <Label htmlFor="escrow" className="text-sm font-medium">
                  Utiliser le séquestre
                </Label>
                <p className="text-xs text-muted-foreground">Le paiement sera retenu jusqu'à validation du travail</p>
              </div>
            </div>
            <Switch
              id="escrow"
              checked={formData.useEscrow}
              onCheckedChange={(checked) => updateFormData("useEscrow", checked)}
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Création..." : "Créer le paiement"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
