import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react"
import type { RootState } from "../store"
import { logout } from "../slices/auth"
import { isTokenExpired, getCsrfToken, sanitizeObject } from "../security"

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token

    // Add Bearer token
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }

    // Add CSRF token
    const csrfToken = getCsrfToken()
    if (csrfToken) {
      headers.set("X-CSRF-Token", csrfToken)
    }

    // Security headers
    headers.set("Content-Type", "application/json")
    headers.set("X-Requested-With", "XMLHttpRequest") // Helps prevent CSRF
    headers.set("X-Content-Type-Options", "nosniff")

    return headers
  },
  credentials: "include", // Include cookies for CSRF protection
})

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const state = api.getState() as RootState
  const token = state.auth.token

  // Check token expiration before making request
  if (token && isTokenExpired(token)) {
    api.dispatch(logout())
    return {
      error: {
        status: 401,
        data: { message: "Session expirée. Veuillez vous reconnecter." },
      },
    }
  }

  // Sanitize request body if present
  if (typeof args === "object" && "body" in args && args.body) {
    args = {
      ...args,
      body: sanitizeObject(args.body as Record<string, any>),
    }
  }

  // Make the request
  const result = await rawBaseQuery(args, api, extraOptions)

  // Handle 401 Unauthorized - auto logout
  if (result.error && result.error.status === 401) {
    api.dispatch(logout())
  }

  // Handle 403 Forbidden
  if (result.error && result.error.status === 403) {
    console.error("[Security] Access forbidden - possible CSRF or permission issue")
  }

  // Handle rate limiting (429)
  if (result.error && result.error.status === 429) {
    console.warn("[Security] Rate limited - too many requests")
  }

  return result
}

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Service",
    "Request",
    "Message",
    "Payment",
    "Review",
    "Document",
    "Company",
    "AdminStats",
    "Users",
    "Services",
    "Transactions",
  ],
  endpoints: () => ({}),
})

export const api = baseApi
