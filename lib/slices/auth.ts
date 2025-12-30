import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "../api/auth"
import { secureStorage, isTokenExpired } from "../security"

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  sessionId: string | null
  lastActivity: number | null
}

const SESSION_TIMEOUT = 30 * 60 * 1000

const getInitialState = (): AuthState => {
  if (typeof window === "undefined") {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      sessionId: null,
      lastActivity: null,
    }
  }

  try {
    const token = secureStorage.get("auth_token", true)
    const userStr = secureStorage.get("auth_user", true)
    const sessionId = secureStorage.get("session_id")
    const lastActivity = secureStorage.get("last_activity")

    if (token && userStr && !isTokenExpired(token)) {
      const lastActivityTime = lastActivity ? Number.parseInt(lastActivity, 10) : 0

      // Check session timeout
      if (Date.now() - lastActivityTime < SESSION_TIMEOUT) {
        return {
          user: JSON.parse(userStr),
          token,
          isAuthenticated: true,
          sessionId,
          lastActivity: lastActivityTime,
        }
      }
    }
  } catch (e) {
    console.error("[Auth] Failed to restore session:", e)
  }

  // Clear any stale data
  secureStorage.remove("auth_token")
  secureStorage.remove("auth_user")
  secureStorage.remove("session_id")
  secureStorage.remove("last_activity")

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    sessionId: null,
    lastActivity: null,
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload

      // Validate token before storing
      if (isTokenExpired(token)) {
        console.error("[Auth] Received expired token")
        return
      }

      state.user = user
      state.token = token
      state.isAuthenticated = true
      state.sessionId = crypto.randomUUID()
      state.lastActivity = Date.now()

      // Store in secure storage
      secureStorage.set("auth_token", token, true)
      secureStorage.set("auth_user", JSON.stringify(user), true)
      secureStorage.set("session_id", state.sessionId)
      secureStorage.set("last_activity", state.lastActivity.toString())
    },

    updateActivity: (state) => {
      if (state.isAuthenticated) {
        state.lastActivity = Date.now()
        secureStorage.set("last_activity", state.lastActivity.toString())
      }
    },

    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.sessionId = null
      state.lastActivity = null

      // Clear all secure storage
      secureStorage.clear()
    },

    checkSession: (state) => {
      if (state.isAuthenticated && state.lastActivity) {
        if (Date.now() - state.lastActivity > SESSION_TIMEOUT) {
          state.user = null
          state.token = null
          state.isAuthenticated = false
          state.sessionId = null
          state.lastActivity = null
          secureStorage.clear()
        }
      }
    },
  },
})

export const { setCredentials, logout, updateActivity, checkSession } = authSlice.actions
export default authSlice.reducer
