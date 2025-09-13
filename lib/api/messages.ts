import { baseApi } from "./base"

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  content: string
  type: "text" | "file" | "image"
  timestamp: string
  read: boolean
}

export interface Conversation {
  id: string
  participants: {
    id: string
    name: string
    avatar?: string
    isOnline: boolean
  }[]
  lastMessage?: Message
  unreadCount: number
  updatedAt: string
  type: "direct" | "group"
}

export interface SendMessageRequest {
  conversationId?: string
  recipientId?: string
  content: string
  type: "text" | "file" | "image"
}

export const messagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<Conversation[], void>({
      query: () => "/messages/conversations",
      providesTags: ["Message"],
    }),
    getConversation: builder.query<{ conversation: Conversation; messages: Message[] }, string>({
      query: (id) => `/messages/conversations/${id}`,
      providesTags: (result, error, id) => [{ type: "Message", id }],
    }),
    sendMessage: builder.mutation<Message, SendMessageRequest>({
      query: (message) => ({
        url: "/messages",
        method: "POST",
        body: message,
      }),
      invalidatesTags: ["Message"],
    }),
    markAsRead: builder.mutation<void, string>({
      query: (conversationId) => ({
        url: `/messages/conversations/${conversationId}/read`,
        method: "POST",
      }),
      invalidatesTags: ["Message"],
    }),
    getUnreadCount: builder.query<{ count: number }, void>({
      query: () => "/messages/unread-count",
      providesTags: ["Message"],
    }),
  }),
})

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
  useGetUnreadCountQuery,
} = messagesApi
