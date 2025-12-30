// Shared types across API modules

export interface AdminStats {
  totalUsers: number
  totalServices: number
  totalTransactions: number
  totalRevenue: number
  monthlyGrowth: number
  activeUsers: number
  pendingVerifications: number
  disputedTransactions: number
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  company: string
  role: "client" | "provider" | "admin"
  accountType?: "individual" | "company"
  status: "active" | "suspended" | "pending"
  verified: boolean
  createdAt: string
  lastLogin: string
}

export interface Service {
  id: string
  title: string
  provider: {
    id: string
    name: string
    company: string
  }
  category: string
  price: number
  currency: string
  status: "active" | "inactive" | "pending" | "rejected"
  createdAt: string
  views: number
  orders: number
}

export interface Transaction {
  id: string
  amount: number
  currency: string
  status: "pending" | "completed" | "disputed" | "cancelled"
  client: {
    id: string
    name: string
    company: string
  }
  provider: {
    id: string
    name: string
    company: string
  }
  service: {
    id: string
    title: string
  }
  createdAt: string
  escrowStatus: "held" | "released" | "disputed"
}
