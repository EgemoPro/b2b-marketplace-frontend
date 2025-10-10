import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  timestamp: string
  read: boolean
}

interface NotificationsState {
  items: Notification[]
  unreadCount: number
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, "id" | "timestamp" | "read">>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
      }
      state.items.unshift(notification)
      state.unreadCount += 1
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find((n) => n.id === action.payload)
      if (notification && !notification.read) {
        notification.read = true
        state.unreadCount -= 1
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((n) => (n.read = true))
      state.unreadCount = 0
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex((n) => n.id === action.payload)
      if (index !== -1) {
        const notification = state.items[index]
        if (!notification.read) {
          state.unreadCount -= 1
        }
        state.items.splice(index, 1)
      }
    },
  },
})

export const { addNotification, markAsRead, markAllAsRead, removeNotification } = notificationsSlice.actions
export const deleteNotification = removeNotification
export default notificationsSlice.reducer
