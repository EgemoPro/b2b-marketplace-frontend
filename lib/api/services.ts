import { baseApi } from "./base"

export interface Service {
  id: string
  title: string
  description: string
  priceType: "fixed" | "hourly" | "project"
  priceMin: number
  priceMax?: number
  currency: "CFA" | "EUR" | "USD"
  deliveryTime: string
  tags: string[]
  sector: string
  supplierId: string
  supplierName: string
  supplierVerified: boolean
  images?: string[]
  createdAt: string
  updatedAt: string
  status: "active" | "paused" | "draft"
  rating?: number
  reviewCount?: number
}

export interface CreateServiceRequest {
  title: string
  description: string
  priceType: "fixed" | "hourly" | "project"
  priceMin: number
  priceMax?: number
  currency: "CFA" | "EUR" | "USD"
  deliveryTime: string
  tags: string[]
  sector: string
}

export interface ServiceFilters {
  search?: string
  sector?: string
  priceMin?: number
  priceMax?: number
  currency?: string
  tags?: string[]
  sortBy?: "newest" | "price_low" | "price_high" | "rating"
  page?: number
  limit?: number
}

export const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<
      { services: Service[]; total: number; page: number; totalPages: number },
      ServiceFilters
    >({
      query: (filters) => ({
        url: "/services",
        params: filters,
      }),
      providesTags: ["Service"],
    }),
    getService: builder.query<Service, string>({
      query: (id) => `/services/${id}`,
      providesTags: (result, error, id) => [{ type: "Service", id }],
    }),
    createService: builder.mutation<Service, CreateServiceRequest>({
      query: (service) => ({
        url: "/services",
        method: "POST",
        body: service,
      }),
      invalidatesTags: ["Service"],
    }),
    updateService: builder.mutation<Service, { id: string; updates: Partial<CreateServiceRequest> }>({
      query: ({ id, updates }) => ({
        url: `/services/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Service", id }],
    }),
    deleteService: builder.mutation<void, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),
    getMyServices: builder.query<Service[], void>({
      query: () => "/services/my/services",
      providesTags: ["Service"],
    }),
  }),
})

export const {
  useGetServicesQuery,
  useGetServiceQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetMyServicesQuery,
} = servicesApi
