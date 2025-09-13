"use client"

import { useState, useEffect } from "react"
import { useGetConversationsQuery } from "@/lib/api/messages"
import { useAppSelector } from "@/lib/hooks"
import { useWebSocket } from "@/lib/websocket"
import { ConversationList } from "./conversation-list"
import { ChatWindow } from "./chat-window"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, Plus } from "lucide-react"
import { motion } from "framer-motion"

export function ChatInterface() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const { data: conversations, isLoading } = useGetConversationsQuery()
  const { isConnected } = useWebSocket()
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // Auto-select first conversation if none selected
    if (conversations && conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id)
    }
  }, [conversations, selectedConversationId])

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement des conversations...</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center">
            <MessageSquare className="w-6 h-6 mr-2" />
            Messages
          </h1>
          <p className="text-muted-foreground">Communiquez avec vos partenaires commerciaux</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
          <span className="text-sm text-muted-foreground">{isConnected ? "En ligne" : "Hors ligne"}</span>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle conversation
          </Button>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <ConversationList
              conversations={conversations || []}
              selectedId={selectedConversationId}
              onSelect={setSelectedConversationId}
            />
          </Card>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            {selectedConversationId ? (
              <ChatWindow conversationId={selectedConversationId} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <MessageSquare className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Sélectionnez une conversation</h3>
                    <p className="text-muted-foreground">
                      Choisissez une conversation dans la liste pour commencer à discuter
                    </p>
                  </div>
                  {(!conversations || conversations.length === 0) && (
                    <div className="mt-6">
                      <p className="text-sm text-muted-foreground mb-4">Vous n'avez pas encore de conversations</p>
                      <Button>
                        <Users className="w-4 h-4 mr-2" />
                        Commencer une conversation
                      </Button>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
