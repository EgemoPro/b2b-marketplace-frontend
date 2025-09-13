"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useGetConversationQuery, useSendMessageMutation, useMarkAsReadMutation } from "@/lib/api/messages"
import { useAppSelector } from "@/lib/hooks"
import { useWebSocket } from "@/lib/websocket"
import { CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Paperclip, ImageIcon, Circle, Phone, Video, MoreVertical } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Message } from "@/lib/api/messages"

interface ChatWindowProps {
  conversationId: string
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const [messageText, setMessageText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAppSelector((state) => state.auth)
  const { isConnected } = useWebSocket()

  const { data, isLoading } = useGetConversationQuery(conversationId)
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation()
  const [markAsRead] = useMarkAsReadMutation()

  const conversation = data?.conversation
  const messages = data?.messages || []
  const otherParticipant = conversation?.participants.find((p) => p.id !== user?.id)

  useEffect(() => {
    // Mark conversation as read when opened
    if (conversationId) {
      markAsRead(conversationId)
    }
  }, [conversationId, markAsRead])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || isSending) return

    try {
      await sendMessage({
        conversationId,
        content: messageText.trim(),
        type: "text",
      }).unwrap()
      setMessageText("")
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}

    messages.forEach((message) => {
      const date = new Date(message.timestamp).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })

    return groups
  }

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier"
    } else {
      return date.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement de la conversation...</div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-muted-foreground">Conversation non trouvée</div>
      </div>
    )
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
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
            <div>
              <h3 className="font-semibold text-foreground">{otherParticipant?.name || "Utilisateur inconnu"}</h3>
              <p className="text-sm text-muted-foreground">{otherParticipant?.isOnline ? "En ligne" : "Hors ligne"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[calc(100vh-20rem)] p-4">
          <div className="space-y-4">
            {Object.entries(messageGroups).map(([dateString, dayMessages]) => (
              <div key={dateString}>
                {/* Date Header */}
                <div className="flex justify-center my-4">
                  <Badge variant="secondary" className="text-xs">
                    {formatDateHeader(dateString)}
                  </Badge>
                </div>

                {/* Messages for this date */}
                <AnimatePresence>
                  {dayMessages.map((message, index) => {
                    const isOwn = message.senderId === user?.id
                    const showAvatar = index === 0 || dayMessages[index - 1].senderId !== message.senderId

                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}
                      >
                        <div
                          className={`flex items-end space-x-2 max-w-[70%] ${isOwn ? "flex-row-reverse space-x-reverse" : ""}`}
                        >
                          {!isOwn && showAvatar && (
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {message.senderName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          {!isOwn && !showAvatar && <div className="w-6" />}

                          <div
                            className={`
                              px-3 py-2 rounded-2xl max-w-full break-words
                              ${
                                isOwn
                                  ? "bg-primary text-primary-foreground rounded-br-md"
                                  : "bg-muted text-foreground rounded-bl-md"
                              }
                            `}
                          >
                            {message.type === "text" ? (
                              <p className="text-sm">{message.content}</p>
                            ) : message.type === "image" ? (
                              <div className="space-y-2">
                                <div className="w-48 h-32 bg-muted rounded-lg flex items-center justify-center">
                                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                </div>
                                {message.content && <p className="text-sm">{message.content}</p>}
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Paperclip className="w-4 h-4" />
                                <span className="text-sm">{message.content}</span>
                              </div>
                            )}

                            <div
                              className={`text-xs mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                            >
                              {formatMessageTime(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2"
              >
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {otherParticipant?.name.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted px-3 py-2 rounded-2xl rounded-bl-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      {/* Message Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Button type="button" variant="ghost" size="sm">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm">
            <ImageIcon className="w-4 h-4" />
          </Button>
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Tapez votre message..."
            className="flex-1"
            disabled={!isConnected}
          />
          <Button type="submit" size="sm" disabled={!messageText.trim() || isSending || !isConnected}>
            <Send className="w-4 h-4" />
          </Button>
        </form>

        {!isConnected && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Connexion perdue. Tentative de reconnexion...
          </p>
        )}
      </div>
    </div>
  )
}
