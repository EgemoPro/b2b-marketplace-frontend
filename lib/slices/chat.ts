import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  timestamp: string
  type: "text" | "file" | "image"
}

interface Conversation {
  id: string
  participants: string[]
  lastMessage?: Message
  unreadCount: number
  updatedAt: string
}

interface ChatState {
  conversations: Conversation[]
  activeConversation: string | null
  messages: Record<string, Message[]>
  isConnected: boolean
}

const initialState: ChatState = {
  conversations: [],
  activeConversation: null,
  messages: {},
  isConnected: false,
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload
    },
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversation = action.payload
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload
      if (!state.messages[message.conversationId]) {
        state.messages[message.conversationId] = []
      }
      state.messages[message.conversationId].push(message)
    },
    setMessages: (state, action: PayloadAction<{ conversationId: string; messages: Message[] }>) => {
      const { conversationId, messages } = action.payload
      state.messages[conversationId] = messages
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload
    },
  },
})

export const { setConversations, setActiveConversation, addMessage, setMessages, setConnectionStatus } =
  chatSlice.actions
export default chatSlice.reducer
