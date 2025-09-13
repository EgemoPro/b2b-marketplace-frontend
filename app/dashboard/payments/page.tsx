"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PaymentsDashboard } from "@/components/payments/payments-dashboard"

export default function PaymentsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PaymentsDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
