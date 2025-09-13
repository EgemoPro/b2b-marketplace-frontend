"use client"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Circle } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import type { Conversation } from "@/lib/api/messages"

interface ConversationListProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredConversations = conversations.filter((conv) =>
    conv.participants.some((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}min`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`
    } else {
      return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
    }
  }

  return (
    <>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Conversations</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-1 p-3">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? "Aucune conversation trouvée" : "Aucune conversation"}
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation, index) => {
                const otherParticipant = conversation.participants.find((p) => p.id !== "current-user-id")
                const isSelected = conversation.id === selectedId

                return (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`
                      p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50
                      ${isSelected ? "bg-primary/10 border border-primary/20" : ""}
                    `}
                    onClick={() => onSelect(conversation.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {otherParticipant?.name.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        {otherParticipant?.isOnline && (
                          <Circle className="absolute -bottom-1 -right-1 w-3 h-3 fill-green-500 text-green-500" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-foreground truncate">
                            {otherParticipant?.name || "Utilisateur inconnu"}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {conversation.lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {formatTime(conversation.lastMessage.timestamp)}
                              </span>
                            )}
                            {conversation.unreadCount > 0 && (
                              <Badge className="w-5 h-5 flex items-center justify-center p-0 text-xs">
                                {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {conversation.lastMessage && (
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.lastMessage.type === "text"
                              ? conversation.lastMessage.content
                              : conversation.lastMessage.type === "image"
                                ? "📷 Image"
                                : "📎 Fichier"}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </>
  )
}
