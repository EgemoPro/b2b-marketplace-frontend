"use client"

import { useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "./hooks"
import { addMessage, setConnectionStatus } from "./slices/chat"
import { addNotification } from "./slices/notifications"

export function useWebSocket() {
  const dispatch = useAppDispatch()
  const { token, isAuthenticated } = useAppSelector((state) => state.auth)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const connect = () => {
    if (!isAuthenticated || !token) return

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000"
    wsRef.current = new WebSocket(`${wsUrl}?token=${token}`)

    wsRef.current.onopen = () => {
      console.log("[v0] WebSocket connected")
      dispatch(setConnectionStatus(true))
      reconnectAttempts.current = 0
    }

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log("[v0] WebSocket message received:", data)

        switch (data.type) {
          case "new_message":
            dispatch(addMessage(data.message))
            dispatch(
              addNotification({
                type: "info",
                title: "Nouveau message",
                message: `${data.message.senderName}: ${data.message.content.substring(0, 50)}...`,
              }),
            )
            break
          case "user_online":
            // Handle user online status
            break
          case "user_offline":
            // Handle user offline status
            break
          case "notification":
            dispatch(addNotification(data.notification))
            break
          default:
            console.log("[v0] Unknown WebSocket message type:", data.type)
        }
      } catch (error) {
        console.error("[v0] Error parsing WebSocket message:", error)
      }
    }

    wsRef.current.onclose = () => {
      console.log("[v0] WebSocket disconnected")
      dispatch(setConnectionStatus(false))

      // Attempt to reconnect
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)
        console.log(`[v0] Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current})`)

        reconnectTimeoutRef.current = setTimeout(() => {
          connect()
        }, delay)
      }
    }

    wsRef.current.onerror = (error) => {
      console.error("[v0] WebSocket error:", error)
    }
  }

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    dispatch(setConnectionStatus(false))
  }

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    }
  }

  useEffect(() => {
    if (isAuthenticated && token) {
      connect()
    } else {
      disconnect()
    }

    return () => {
      disconnect()
    }
  }, [isAuthenticated, token])

  return { sendMessage, isConnected: wsRef.current?.readyState === WebSocket.OPEN }
}
