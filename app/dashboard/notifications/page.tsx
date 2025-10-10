"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  MessageCircle,
  DollarSign,
  FileText,
  UserPlus,
  AlertCircle,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { markAsRead, markAllAsRead, deleteNotification } from "@/lib/slices/notifications"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "message":
      return MessageCircle
    case "payment":
      return DollarSign
    case "document":
      return FileText
    case "request":
      return Package
    case "user":
      return UserPlus
    case "alert":
      return AlertCircle
    default:
      return Bell
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case "message":
      return "text-blue-500"
    case "payment":
      return "text-green-500"
    case "document":
      return "text-purple-500"
    case "request":
      return "text-orange-500"
    case "user":
      return "text-pink-500"
    case "alert":
      return "text-red-500"
    default:
      return "text-gray-500"
  }
}

export default function NotificationsPage() {
  const dispatch = useAppDispatch()
  const notifications = useAppSelector((state) => state.notifications.items)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const filteredNotifications = filter === "unread" ? notifications.filter((n) => !n.read) : notifications

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id))
  }

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead())
  }

  const handleDelete = (id: string) => {
    dispatch(deleteNotification(id))
  }

  const groupedNotifications = filteredNotifications.reduce(
    (acc, notification) => {
      const date = new Date(notification.timestamp)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let group = "Plus ancien"
      if (date.toDateString() === today.toDateString()) {
        group = "Aujourd'hui"
      } else if (date.toDateString() === yesterday.toDateString()) {
        group = "Hier"
      } else if (date > new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
        group = "Cette semaine"
      }

      if (!acc[group]) {
        acc[group] = []
      }
      acc[group].push(notification)
      return acc
    },
    {} as Record<string, typeof notifications>,
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0
              ? `${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}`
              : "Aucune notification non lue"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Tout marquer comme lu
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "unread")} className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            Toutes
            <Badge variant="secondary" className="ml-2">
              {notifications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Non lues
            {unreadCount > 0 && (
              <Badge variant="default" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {filteredNotifications.length === 0 ? (
            <Card className="p-12 text-center">
              <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Aucune notification</h3>
              <p className="text-muted-foreground">
                {filter === "unread"
                  ? "Vous avez lu toutes vos notifications"
                  : "Vous n'avez pas encore de notifications"}
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedNotifications).map(([group, groupNotifications]) => (
                <div key={group}>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">{group}</h3>
                  <div className="space-y-2">
                    {groupNotifications.map((notification, index) => {
                      const Icon = getNotificationIcon(notification.type)
                      const iconColor = getNotificationColor(notification.type)

                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card
                            className={`p-4 transition-all hover:shadow-md ${!notification.read ? "bg-primary/5 border-primary/20" : ""}`}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={`flex-shrink-0 h-10 w-10 rounded-full bg-background flex items-center justify-center ${iconColor}`}
                              >
                                <Icon className="h-5 w-5" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h4 className="font-semibold text-sm">{notification.title}</h4>
                                  {!notification.read && (
                                    <Badge variant="default" className="flex-shrink-0">
                                      Nouveau
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(notification.timestamp), {
                                    addSuffix: true,
                                    locale: fr,
                                  })}
                                </p>
                              </div>

                              <div className="flex items-center gap-1 flex-shrink-0">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    title="Marquer comme lu"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(notification.id)}
                                  title="Supprimer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
