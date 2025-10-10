import { api } from "./base"

export interface Company {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  sector: string
  description: string
  website?: string
  siret?: string
  verified: boolean
  logo?: string
  coverImage?: string
  employeeCount?: string
  foundedYear?: number
  certifications?: string[]
  services?: Array<{
    id: string
    title: string
    category: string
  }>
  stats?: {
    totalServices: number
    completedProjects: number
    rating: number
    reviewCount: number
  }
  createdAt: string
}

export const companiesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCompanies: builder.query<
      { companies: Company[]; total: number; page: number; totalPages: number },
      { page?: number; limit?: number; sector?: string; country?: string; search?: string; verified?: boolean }
    >({
      query: (params) => ({
        url: "/companies",
        params,
      }),
    }),
    getCompanyById: builder.query<Company, string>({
      query: (id) => `/companies/${id}`,
    }),
    followCompany: builder.mutation<void, string>({
      query: (id) => ({
        url: `/companies/${id}/follow`,
        method: "POST",
      }),
    }),
    unfollowCompany: builder.mutation<void, string>({
      query: (id) => ({
        url: `/companies/${id}/unfollow`,
        method: "POST",
      }),
    }),
  }),
})

export const { useGetCompaniesQuery, useGetCompanyByIdQuery, useFollowCompanyMutation, useUnfollowCompanyMutation } =
  companiesApi
