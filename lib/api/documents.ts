import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface Document {
  id: string
  filename: string
  originalName: string
  documentType:
    | "contract"
    | "invoice"
    | "certificate"
    | "presentation"
    | "cv"
    | "certification"
    | "diploma"
    | "portfolio"
    | "kbis"
    | "siret"
    | "identity"
    | "license"
    | "delivery_proof"
    | "work_completion"
    | "receipt"
  category: "company" | "personal" | "verification" | "transaction_proof"
  description?: string
  fileSize: number
  mimeType: string
  secureUrl: string
  isPublic?: boolean
  uploadedAt: string
  uploadedBy: string
  companyId?: string
  transactionId?: string
}

export interface DocumentUploadRequest {
  document: File
  documentType: Document["documentType"]
  category: Document["category"]
  description?: string
  isPublic?: boolean
  transactionId?: string
}

export const documentsApi = createApi({
  reducerPath: "documentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/documents",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["Document"],
  endpoints: (builder) => ({
    uploadCompanyDocument: builder.mutation<Document, FormData>({
      query: (formData) => ({
        url: "/company",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Document"],
    }),
    uploadPersonalDocument: builder.mutation<Document, FormData>({
      query: (formData) => ({
        url: "/personal",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Document"],
    }),
    uploadVerificationDocument: builder.mutation<Document, FormData>({
      query: (formData) => ({
        url: "/verification",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Document"],
    }),
    uploadTransactionProof: builder.mutation<Document, FormData>({
      query: (formData) => ({
        url: "/transaction-proof",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Document"],
    }),
    getCompanyDocuments: builder.query<Document[], void>({
      query: () => "/company",
      providesTags: ["Document"],
    }),
    getPersonalDocuments: builder.query<Document[], void>({
      query: () => "/personal",
      providesTags: ["Document"],
    }),
    getSecureDocumentUrl: builder.query<{ secureUrl: string }, string>({
      query: (documentId) => `/${documentId}/secure-url`,
    }),
    deleteDocument: builder.mutation<void, string>({
      query: (documentId) => ({
        url: `/${documentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Document"],
    }),
  }),
})

export const {
  useUploadCompanyDocumentMutation,
  useUploadPersonalDocumentMutation,
  useUploadVerificationDocumentMutation,
  useUploadTransactionProofMutation,
  useGetCompanyDocumentsQuery,
  useGetPersonalDocumentsQuery,
  useGetSecureDocumentUrlQuery,
  useDeleteDocumentMutation,
} = documentsApi
