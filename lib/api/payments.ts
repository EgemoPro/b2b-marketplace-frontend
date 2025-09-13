import { baseApi } from "./base"

export interface Transaction {
  id: string
  type: "payment" | "refund" | "escrow_release"
  amount: number
  currency: "CFA" | "EUR" | "USD"
  status: "pending" | "processing" | "completed" | "failed" | "cancelled"
  description: string
  fromUserId: string
  toUserId: string
  fromUserName: string
  toUserName: string
  serviceId?: string
  serviceName?: string
  requestId?: string
  requestTitle?: string
  stripePaymentIntentId?: string
  escrowReleaseDate?: string
  createdAt: string
  updatedAt: string
}

export interface PaymentIntent {
  id: string
  clientSecret: string
  amount: number
  currency: string
  status: string
}

export interface CreatePaymentIntentRequest {
  amount: number
  currency: "CFA" | "EUR" | "USD"
  description: string
  recipientId: string
  serviceId?: string
  requestId?: string
  useEscrow?: boolean
}

export interface EscrowPayment {
  id: string
  amount: number
  currency: string
  description: string
  payerId: string
  payerName: string
  recipientId: string
  recipientName: string
  status: "held" | "released" | "disputed"
  releaseDate?: string
  createdAt: string
}

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<PaymentIntent, CreatePaymentIntentRequest>({
      query: (payment) => ({
        url: "/payments/intent",
        method: "POST",
        body: payment,
      }),
      invalidatesTags: ["Payment"],
    }),
    confirmPayment: builder.mutation<Transaction, { paymentIntentId: string }>({
      query: ({ paymentIntentId }) => ({
        url: "/payments/confirm",
        method: "POST",
        body: { paymentIntentId },
      }),
      invalidatesTags: ["Payment"],
    }),
    getTransactionHistory: builder.query<
      { transactions: Transaction[]; total: number },
      { page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/payments/history",
        params,
      }),
      providesTags: ["Payment"],
    }),
    getEscrowPayments: builder.query<EscrowPayment[], void>({
      query: () => "/payments/escrow",
      providesTags: ["Payment"],
    }),
    releaseEscrowPayment: builder.mutation<void, string>({
      query: (paymentId) => ({
        url: `/payments/release/${paymentId}`,
        method: "POST",
      }),
      invalidatesTags: ["Payment"],
    }),
    disputeEscrowPayment: builder.mutation<void, { paymentId: string; reason: string }>({
      query: ({ paymentId, reason }) => ({
        url: `/payments/dispute/${paymentId}`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["Payment"],
    }),
    getPaymentStats: builder.query<
      {
        totalEarnings: number
        totalSpent: number
        pendingEscrow: number
        currency: string
      },
      void
    >({
      query: () => "/payments/stats",
      providesTags: ["Payment"],
    }),
  }),
})

export const {
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
  useGetTransactionHistoryQuery,
  useGetEscrowPaymentsQuery,
  useReleaseEscrowPaymentMutation,
  useDisputeEscrowPaymentMutation,
  useGetPaymentStatsQuery,
} = paymentsApi
