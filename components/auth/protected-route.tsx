"use client"

import type React from "react"
import { useEffect, useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { logout, updateActivity, checkSession } from "@/lib/slices/auth"
import { isTokenExpired, isInIframe } from "@/lib/security"
import { Loader2, ShieldAlert, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "client" | "supplier" | "admin"
  requiredAccountType?: "individual" | "company"
}

export function ProtectedRoute({ children, requiredRole, requiredAccountType }: ProtectedRouteProps) {
  const { isAuthenticated, user, token } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    if (isInIframe()) {
      console.error("[Security] Application loaded in iframe - possible clickjacking attempt")
      document.body.innerHTML = "<h1>Accès non autorisé</h1>"
    }
  }, [isMounted])

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      dispatch(logout())
      router.push("/auth/login?expired=true")
      return
    }
  }, [token, dispatch, router])

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(checkSession())
    }, 60000)

    return () => clearInterval(interval)
  }, [dispatch])

  const handleActivity = useCallback(() => {
    dispatch(updateActivity())
  }, [dispatch])

  useEffect(() => {
    if (!isMounted) return

    window.addEventListener("mousemove", handleActivity)
    window.addEventListener("keypress", handleActivity)
    window.addEventListener("click", handleActivity)
    window.addEventListener("scroll", handleActivity)

    return () => {
      window.removeEventListener("mousemove", handleActivity)
      window.removeEventListener("keypress", handleActivity)
      window.removeEventListener("click", handleActivity)
      window.removeEventListener("scroll", handleActivity)
    }
  }, [handleActivity, isMounted])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    if (requiredRole && user?.role !== requiredRole && user?.role !== "admin") {
      router.push("/dashboard")
      return
    }

    if (requiredAccountType && user?.accountType !== requiredAccountType) {
      router.push("/dashboard")
      return
    }
  }, [isAuthenticated, user, requiredRole, requiredAccountType, router])

  // Loading state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Role not authorized
  if (requiredRole && user?.role !== requiredRole && user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Accès non autorisé</CardTitle>
            <CardDescription>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Retour au tableau de bord
            </Button>
            <Button variant="outline" onClick={() => router.back()} className="w-full">
              Page précédente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Account type not authorized
  if (requiredAccountType && user?.accountType !== requiredAccountType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
            <CardTitle className="text-2xl">Type de compte requis</CardTitle>
            <CardDescription>
              Cette fonctionnalité est réservée aux comptes{" "}
              {requiredAccountType === "company" ? "entreprise" : "individuels"}.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button onClick={() => router.push("/dashboard/settings")} className="w-full">
              Mettre à jour mon compte
            </Button>
            <Button variant="outline" onClick={() => router.back()} className="w-full">
              Page précédente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
