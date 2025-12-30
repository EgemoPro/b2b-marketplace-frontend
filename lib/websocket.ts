"use client"

import { useEffect, useRef, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "./hooks"
import { addMessage, setConnectionStatus } from "./slices/chat"
import { addNotification } from "./slices/notifications"
import { isTokenExpired, generateSecureId } from "./security"
import { logout } from "./slices/auth"

export function useWebSocket() {
  const dispatch = useAppDispatch()
  const { token, isAuthenticated, sessionId } = useAppSelector((state) => state.auth)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5
  const connectionId = useRef<string>(generateSecureId(16))

  const connect = useCallback(() => {
    if (!isAuthenticated || !token) {
      return
    }

    if (isTokenExpired(token)) {
      dispatch(logout())
      return
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000"

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const secureWsUrl = wsUrl.replace(/^ws(s)?:/, protocol)

    // For development, we pass a short-lived connection token
    const connectionToken = generateSecureId(32)
    wsRef.current = new WebSocket(`${secureWsUrl}?cid=${connectionId.current}&ct=${connectionToken}`)

    wsRef.current.onopen = () => {
      dispatch(setConnectionStatus(true))
      reconnectAttempts.current = 0

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "authenticate",
            token,
            sessionId,
            connectionId: connectionId.current,
          }),
        )
      }
    }

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.connectionId && data.connectionId !== connectionId.current) {
          console.warn("[Security] WebSocket message from unknown connection")
          return
        }

        switch (data.type) {
          case "authenticated":
            break
          case "auth_error":
            console.error("[Security] WebSocket authentication failed")
            dispatch(logout())
            break
          case "new_message":
            if (data.message && typeof data.message.content === "string") {
              dispatch(addMessage(data.message))
              dispatch(
                addNotification({
                  type: "info",
                  title: "Nouveau message",
                  message: `${data.message.senderName}: ${data.message.content.substring(0, 50)}...`,
                }),
              )
            }
            break
          case "user_online":
          case "user_offline":
            break
          case "notification":
            if (data.notification) {
              dispatch(addNotification(data.notification))
            }
            break
          case "session_expired":
            dispatch(logout())
            break
          default:
            break
        }
      } catch (error) {
        console.error("[Security] Error parsing WebSocket message:", error)
      }
    }

    wsRef.current.onclose = (event) => {
      dispatch(setConnectionStatus(false))

      if (event.code === 4001) {
        dispatch(logout())
        return
      }

      // Attempt to reconnect with exponential backoff
      if (reconnectAttempts.current < maxReconnectAttempts && isAuthenticated) {
        reconnectAttempts.current++
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)

        reconnectTimeoutRef.current = setTimeout(() => {
          connect()
        }, delay)
      }
    }

    wsRef.current.onerror = () => {
      // Error handling - connection will close automatically
    }
  }, [isAuthenticated, token, sessionId, dispatch])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (wsRef.current) {
      wsRef.current.close(1000, "User disconnect")
      wsRef.current = null
    }
    dispatch(setConnectionStatus(false))
  }, [dispatch])

  const sendMessage = useCallback((message: Record<string, any>) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // Add connection ID for validation
      const secureMessage = {
        ...message,
        connectionId: connectionId.current,
        timestamp: Date.now(),
      }
      wsRef.current.send(JSON.stringify(secureMessage))
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated && token) {
      connect()
    } else {
      disconnect()
    }

    return () => {
      disconnect()
    }
  }, [isAuthenticated, token, connect, disconnect])

  return { sendMessage, isConnected: wsRef.current?.readyState === WebSocket.OPEN }
}
