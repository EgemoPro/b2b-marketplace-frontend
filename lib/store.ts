import { configureStore } from "@reduxjs/toolkit"
import { authApi } from "./api/auth"
import { servicesApi } from "./api/services"
import { requestsApi } from "./api/requests"
import { messagesApi } from "./api/messages"
import { paymentsApi } from "./api/payments"
import { adminApi } from "./api/admin"
import { documentsApi } from "./api/documents"
import { companiesApi } from "./api/companies"
import authReducer from "./slices/auth"
import chatReducer from "./slices/chat"
import notificationsReducer from "./slices/notifications"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    notifications: notificationsReducer,
    [authApi.reducerPath]: authApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    [requestsApi.reducerPath]: requestsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [documentsApi.reducerPath]: documentsApi.reducer,
    [companiesApi.reducerPath]: companiesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(
      authApi.middleware,
      servicesApi.middleware,
      requestsApi.middleware,
      messagesApi.middleware,
      paymentsApi.middleware,
      adminApi.middleware,
      documentsApi.middleware,
      companiesApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
