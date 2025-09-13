import { baseApi } from "./base"

export interface User {
  id: string
  email: string
  role: "client" | "supplier" | "admin"
  companyName: string
  siret?: string
  sector: string
  description?: string
  address: string
  phone: string
  isVerified: boolean
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  role: "client" | "supplier"
  companyName: string
  siret?: string
  sector: string
  description?: string
  address: string
  phone: string
}

export interface AuthResponse {
  token: string
  user: User
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    getProfile: builder.query<User, void>({
      query: () => "/auth/profile",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (updates) => ({
        url: "/auth/profile",
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["User"],
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation, useGetProfileQuery, useUpdateProfileMutation } = authApi
