"use client"

import {
  useGetEscrowPaymentsQuery,
  useReleaseEscrowPaymentMutation,
  useDisputeEscrowPaymentMutation,
} from "@/lib/api/payments"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Shield, Clock, AlertTriangle, CheckCircle, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export function EscrowManager() {
  const { data: escrowPayments, isLoading } = useGetEscrowPaymentsQuery()
  const [releasePayment] = useReleaseEscrowPaymentMutation()
  const [disputePayment] = useDisputeEscrowPaymentMutation()
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === "CFA") {
      return `${amount.toLocaleString("fr-FR")} CFA`
    }

    const formatter = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    })

    return formatter.format(amount)
  }

  const handleReleasePayment = async (paymentId: string) => {
    try {
      await releasePayment(paymentId).unwrap()
    } catch (error) {
      console.error("Failed to release payment:", error)
    }
  }

  const handleDisputePayment = async (paymentId: string) => {
    try {
      await disputePayment({
        paymentId,
        reason: "Travail non conforme aux spécifications",
      }).unwrap()
    } catch (error) {
      console.error("Failed to dispute payment:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      held: { label: "En séquestre", variant: "secondary" as const, icon: Clock },
      released: { label: "Libéré", variant: "default" as const, icon: CheckCircle },
      disputed: { label: "En litige", variant: "destructive" as const, icon: AlertTriangle },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    if (!config) return null

    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-8 bg-muted rounded w-24"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Fonds en séquestre</p>
                <p className="text-2xl font-bold">
                  {escrowPayments
                    ?.reduce((sum, payment) => (payment.status === "held" ? sum + payment.amount : sum), 0)
                    .toLocaleString("fr-FR") || 0}{" "}
                  CFA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Paiements en attente</p>
                <p className="text-2xl font-bold">{escrowPayments?.filter((p) => p.status === "held").length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Litiges actifs</p>
                <p className="text-2xl font-bold">
                  {escrowPayments?.filter((p) => p.status === "disputed").length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Escrow Payments List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Paiements en séquestre
          </CardTitle>
          <CardDescription>Gérez les paiements sécurisés en attente de validation</CardDescription>
        </CardHeader>
        <CardContent>
          {!escrowPayments || escrowPayments.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun paiement en séquestre</p>
            </div>
          ) : (
            <div className="space-y-4">
              {escrowPayments.map((payment, index) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {payment.payerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h4 className="font-medium text-foreground">{payment.description}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-sm text-muted-foreground">
                          De: {payment.payerName} → Vers: {payment.recipientName}
                        </p>
                        {payment.releaseDate && (
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>Libération: {new Date(payment.releaseDate).toLocaleDateString("fr-FR")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold text-lg">{formatCurrency(payment.amount, payment.currency)}</div>
                      {getStatusBadge(payment.status)}
                    </div>

                    {payment.status === "held" && (
                      <div className="flex space-x-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Contester
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Contester le paiement</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir contester ce paiement ? Cette action déclenchera une procédure
                                de résolution de litige.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDisputePayment(payment.id)}>
                                Contester
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Libérer
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Libérer le paiement</AlertDialogTitle>
                              <AlertDialogDescription>
                                Confirmez-vous que le travail a été réalisé de manière satisfaisante et que vous
                                souhaitez libérer ce paiement ?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleReleasePayment(payment.id)}>
                                Libérer le paiement
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
