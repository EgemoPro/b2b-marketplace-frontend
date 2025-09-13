"use client"

import type React from "react"

import { useWebSocket } from "@/lib/websocket"

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  useWebSocket()
  return <>{children}</>
}
