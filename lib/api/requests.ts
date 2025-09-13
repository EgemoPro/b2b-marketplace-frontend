import { baseApi } from "./base"

export interface CollaborationRequest {
  id: string
  title: string
  description: string
  budgetMin: number
  budgetMax?: number
  currency: "CFA" | "EUR" | "USD"
  deadline: string
  sector: string
  clientId: string
  clientName: string
  clientVerified: boolean
  status: "open" | "in_progress" | "completed" | "cancelled"
  proposalCount: number
  createdAt: string
  updatedAt: string
}

export interface Proposal {
  id: string
  requestId: string
  supplierId: string
  supplierName: string
  supplierVerified: boolean
  price: number
  currency: "CFA" | "EUR" | "USD"
  deliveryTime: string
  description: string
  status: "pending" | "accepted" | "rejected"
  createdAt: string
}

export interface CreateRequestRequest {
  title: string
  description: string
  budgetMin: number
  budgetMax?: number
  currency: "CFA" | "EUR" | "USD"
  deadline: string
  sector: string
}

export interface CreateProposalRequest {
  requestId: string
  price: number
  currency: "CFA" | "EUR" | "USD"
  deliveryTime: string
  description: string
}

export const requestsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRequests: builder.query<
      { requests: CollaborationRequest[]; total: number },
      { page?: number; sector?: string; search?: string }
    >({
      query: (params) => ({
        url: "/requests",
        params,
      }),
      providesTags: ["Request"],
    }),
    getRequest: builder.query<CollaborationRequest, string>({
      query: (id) => `/requests/${id}`,
      providesTags: (result, error, id) => [{ type: "Request", id }],
    }),
    createRequest: builder.mutation<CollaborationRequest, CreateRequestRequest>({
      query: (request) => ({
        url: "/requests",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["Request"],
    }),
    getMyRequests: builder.query<CollaborationRequest[], void>({
      query: () => "/requests/my/requests",
      providesTags: ["Request"],
    }),
    createProposal: builder.mutation<Proposal, CreateProposalRequest>({
      query: (proposal) => ({
        url: `/requests/${proposal.requestId}/proposals`,
        method: "POST",
        body: proposal,
      }),
      invalidatesTags: ["Request"],
    }),
    getMyProposals: builder.query<Proposal[], void>({
      query: () => "/requests/my/proposals",
      providesTags: ["Request"],
    }),
    acceptProposal: builder.mutation<void, string>({
      query: (proposalId) => ({
        url: `/requests/proposals/${proposalId}/accept`,
        method: "POST",
      }),
      invalidatesTags: ["Request"],
    }),
  }),
})

export const {
  useGetRequestsQuery,
  useGetRequestQuery,
  useCreateRequestMutation,
  useGetMyRequestsQuery,
  useCreateProposalMutation,
  useGetMyProposalsQuery,
  useAcceptProposalMutation,
} = requestsApi
