import { baseApi } from "./base"
import type { AdminStats, User, Service, Transaction } from "./types"

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query<AdminStats, void>({
      query: () => "/admin/stats",
      providesTags: ["AdminStats"],
    }),
    getUsers: builder.query<
      { users: User[]; total: number },
      { page?: number; limit?: number; search?: string; role?: string; status?: string }
    >({
      query: ({ page = 1, limit = 10, search, role, status }) => ({
        url: "/admin/users",
        params: { page, limit, search, role, status },
      }),
      providesTags: ["Users"],
    }),
    updateUserStatus: builder.mutation<void, { userId: string; status: string }>({
      query: ({ userId, status }) => ({
        url: `/admin/users/${userId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Users", "AdminStats"],
    }),
    verifyUser: builder.mutation<void, { userId: string }>({
      query: ({ userId }) => ({
        url: `/admin/users/${userId}/verify`,
        method: "POST",
      }),
      invalidatesTags: ["Users", "AdminStats"],
    }),
    getServices: builder.query<
      { services: Service[]; total: number },
      { page?: number; limit?: number; search?: string; status?: string }
    >({
      query: ({ page = 1, limit = 10, search, status }) => ({
        url: "/admin/services",
        params: { page, limit, search, status },
      }),
      providesTags: ["Services"],
    }),
    updateServiceStatus: builder.mutation<void, { serviceId: string; status: string }>({
      query: ({ serviceId, status }) => ({
        url: `/admin/services/${serviceId}/status`,
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
        url: "/admin/transactions",
        params: { page, limit, status },
      }),
      providesTags: ["Transactions"],
    }),
    resolveDispute: builder.mutation<void, { transactionId: string; resolution: "refund" | "release" }>({
      query: ({ transactionId, resolution }) => ({
        url: `/admin/transactions/${transactionId}/resolve`,
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
