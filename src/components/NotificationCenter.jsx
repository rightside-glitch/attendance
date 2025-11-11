import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { subscribeToUserNotifications, markNotificationRead } from '../firebase/firestoreHelpers'

export default function NotificationCenter() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    if (!user) return

    const unsubscribe = subscribeToUserNotifications(user.uid, (notifs) => {
      setNotifications(notifs.sort((a, b) => b.createdAt - a.createdAt))
      setUnreadCount(notifs.filter((n) => !n.read).length)
    })

    return unsubscribe
  }, [user])

  const handleMarkAsRead = async (notificationId) => {
    await markNotificationRead(notificationId)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded shadow-lg z-50 border border-gray-200">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-600">
                No notifications yet
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                    notif.read ? 'opacity-60' : 'bg-blue-50'
                  }`}
                  onClick={() => handleMarkAsRead(notif.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{notif.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notif.createdAt
                          ? new Date(notif.createdAt.toDate?.() || notif.createdAt).toLocaleString()
                          : 'Just now'}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-1 ml-2" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t text-center">
            <button
              onClick={() => setShowDropdown(false)}
              className="text-xs text-blue-600 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
