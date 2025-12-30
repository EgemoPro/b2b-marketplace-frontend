import { baseApi } from "./base"

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

export const documentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadCompanyDocument: builder.mutation<Document, FormData>({
      query: (formData) => ({
        url: "/documents/company",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Document"],
    }),
    uploadPersonalDocument: builder.mutation<Document, FormData>({
      query: (formData) => ({
        url: "/documents/personal",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Document"],
    }),
    uploadVerificationDocument: builder.mutation<Document, FormData>({
      query: (formData) => ({
        url: "/documents/verification",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Document"],
    }),
    uploadTransactionProof: builder.mutation<Document, FormData>({
      query: (formData) => ({
        url: "/documents/transaction-proof",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Document"],
    }),
    getCompanyDocuments: builder.query<Document[], void>({
      query: () => "/documents/company",
      providesTags: ["Document"],
    }),
    getPersonalDocuments: builder.query<Document[], void>({
      query: () => "/documents/personal",
      providesTags: ["Document"],
    }),
    getSecureDocumentUrl: builder.query<{ secureUrl: string }, string>({
      query: (documentId) => `/documents/${documentId}/secure-url`,
    }),
    deleteDocument: builder.mutation<void, string>({
      query: (documentId) => ({
        url: `/documents/${documentId}`,
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
