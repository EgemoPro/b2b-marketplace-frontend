"use client"

import { RequestForm } from "@/components/requests/request-form"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function CreateRequestPage() {
  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className="container mx-auto p-6">
        <RequestForm />
      </div>
    </ProtectedRoute>
  )
}
