"use client"

import type React from "react"

import { useAppSelector } from "@/lib/hooks"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (user && user.role !== "admin") {
      redirect("/dashboard")
    }
  }, [user])

  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  )
}
