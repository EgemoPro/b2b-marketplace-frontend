import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

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

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/admin`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["AdminStats", "Users", "Services", "Transactions"],
  endpoints: (builder) => ({
    getAdminStats: builder.query<AdminStats, void>({
      query: () => "/stats",
      providesTags: ["AdminStats"],
    }),
    getUsers: builder.query<
      { users: User[]; total: number },
      { page?: number; limit?: number; search?: string; role?: string; status?: string }
    >({
      query: ({ page = 1, limit = 10, search, role, status }) => ({
        url: "/users",
        params: { page, limit, search, role, status },
      }),
      providesTags: ["Users"],
    }),
    updateUserStatus: builder.mutation<void, { userId: string; status: string }>({
      query: ({ userId, status }) => ({
        url: `/users/${userId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Users", "AdminStats"],
    }),
    verifyUser: builder.mutation<void, { userId: string }>({
      query: ({ userId }) => ({
        url: `/users/${userId}/verify`,
        method: "POST",
      }),
      invalidatesTags: ["Users", "AdminStats"],
    }),
    getServices: builder.query<
      { services: Service[]; total: number },
      { page?: number; limit?: number; search?: string; status?: string }
    >({
      query: ({ page = 1, limit = 10, search, status }) => ({
        url: "/services",
        params: { page, limit, search, status },
      }),
      providesTags: ["Services"],
    }),
    updateServiceStatus: builder.mutation<void, { serviceId: string; status: string }>({
      query: ({ serviceId, status }) => ({
        url: `/services/${serviceId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Services", "AdminStats"],
    }),
    getTransactions: builder.query<
      { transactions: Transaction[]; total: number },
      { page?: number; limit?: number; status?: string }
    >({
      query: ({ page = 1, limit = 10, status }) => ({
        url: "/transactions",
        params: { page, limit, status },
      }),
      providesTags: ["Transactions"],
    }),
    resolveDispute: builder.mutation<void, { transactionId: string; resolution: "refund" | "release" }>({
      query: ({ transactionId, resolution }) => ({
        url: `/transactions/${transactionId}/resolve`,
        method: "POST",
        body: { resolution },
      }),
      invalidatesTags: ["Transactions", "AdminStats"],
    }),
  }),
})

export const {
  useGetAdminStatsQuery,
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  useVerifyUserMutation,
  useGetServicesQuery,
  useUpdateServiceStatusMutation,
  useGetTransactionsQuery,
  useResolveDisputeMutation,
} = adminApi
