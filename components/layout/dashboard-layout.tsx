"use client"

import type React from "react"
import { Logo } from "@/components/ui/logo"
import { useState } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { logout } from "@/lib/slices/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  CreditCard,
  Users,
  Settings,
  LogOut,
  Menu,
  Bell,
  Search,
  FileText,
  Star,
  Shield,
  FolderOpen,
  Building2,
  User,
} from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAppSelector((state) => state.auth)
  const { unreadCount } = useAppSelector((state) => state.notifications)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const accountType = user?.accountType || "company"
  const isIndividual = accountType === "individual"
  const isAdmin = user?.role === "admin"

  const themeColors = isAdmin
    ? {
        primary: "from-slate-800 to-slate-900",
        accent: "bg-slate-100",
        text: "text-slate-700",
        border: "border-slate-200",
        hover: "hover:bg-slate-100",
        badge: "bg-slate-600",
      }
    : isIndividual
      ? {
          primary: "from-emerald-500 to-teal-600",
          accent: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          hover: "hover:bg-emerald-50",
          badge: "bg-emerald-600",
        }
      : {
          primary: "from-orange-500 to-amber-600",
          accent: "bg-orange-50",
          text: "text-orange-700",
          border: "border-orange-200",
          hover: "hover:bg-orange-50",
          badge: "bg-orange-600",
        }

  const handleLogout = () => {
    dispatch(logout())
    router.push("/")
  }

  const navigation = [
    { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    { name: "Services", href: "/dashboard/services", icon: Package },
    { name: "Demandes", href: "/dashboard/requests", icon: FileText },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Paiements", href: "/dashboard/payments", icon: CreditCard },
    { name: "Documents", href: "/dashboard/documents", icon: FolderOpen },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Avis", href: "/dashboard/reviews", icon: Star },
    ...(user?.role === "admin"
      ? [
          { name: "Administration", href: "/admin", icon: Shield },
          { name: "Utilisateurs", href: "/admin/users", icon: Users },
        ]
      : []),
  ]

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full ${mobile ? "w-full" : "w-64"} bg-sidebar border-r border-sidebar-border`}>
      {/* Logo with theme indicator */}
      <div className={`flex items-center justify-between p-6 border-b border-sidebar-border`}>
        <Logo size="md" />
        <Badge className={`${themeColors.badge} text-white text-xs`}>
          {isAdmin ? (
            <Shield className="w-3 h-3" />
          ) : isIndividual ? (
            <User className="w-3 h-3" />
          ) : (
            <Building2 className="w-3 h-3" />
          )}
        </Badge>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? `${themeColors.accent} ${themeColors.text} font-medium`
                  : `text-sidebar-foreground ${themeColors.hover}`
              }`}
              onClick={() => mobile && setSidebarOpen(false)}
            >
              <item.icon className={`w-5 h-5 ${isActive ? themeColors.text : ""}`} />
              <span>{item.name}</span>
              {item.name === "Notifications" && unreadCount > 0 && (
                <Badge className={`ml-auto ${themeColors.badge} text-white text-xs px-1.5`}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Info with theme */}
      <div className={`p-4 border-t ${themeColors.border}`}>
        <div className="flex items-center space-x-3">
          <Avatar
            className={`ring-2 ${isIndividual ? "ring-emerald-200" : isAdmin ? "ring-slate-200" : "ring-orange-200"}`}
          >
            <AvatarFallback className={`bg-gradient-to-br ${themeColors.primary} text-white`}>
              {isIndividual ? user?.firstName?.charAt(0) || "U" : user?.companyName?.charAt(0) || "E"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {isIndividual ? `${user?.firstName} ${user?.lastName}` : user?.companyName}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge
                variant={user?.isVerified ? "default" : "secondary"}
                className={`text-xs ${user?.isVerified ? themeColors.badge + " text-white" : ""}`}
              >
                {user?.isVerified ? "Vérifié" : "En attente"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar mobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header with theme accent */}
        <header className={`bg-background border-b ${themeColors.border} sticky top-0 z-40`}>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>

              <div
                className={`hidden md:flex items-center space-x-2 ${themeColors.accent} rounded-lg px-3 py-2 min-w-[300px]`}
              >
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher des services, entreprises..."
                  className="bg-transparent border-0 outline-none flex-1 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Link href="/dashboard/notifications">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <Badge
                      className={`absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs ${themeColors.badge} text-white`}
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar
                      className={`h-8 w-8 ring-2 ${isIndividual ? "ring-emerald-200" : isAdmin ? "ring-slate-200" : "ring-orange-200"}`}
                    >
                      <AvatarFallback className={`bg-gradient-to-br ${themeColors.primary} text-white`}>
                        {isIndividual ? user?.firstName?.charAt(0) || "U" : user?.companyName?.charAt(0) || "E"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {isIndividual ? `${user?.firstName} ${user?.lastName}` : user?.companyName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      <Badge className={`w-fit mt-2 text-xs ${themeColors.badge} text-white`}>
                        {isAdmin ? "Administrateur" : isIndividual ? "Compte Personnel" : "Entreprise"}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
