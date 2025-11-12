"use client"

import { useState } from "react"
import "../styles/notifications.css"

function Notifications() {
  const [activeTab, setActiveTab] = useState("all")

  const [notifications] = useState([
    {
      id: 1,
      type: "restaurant_request",
      title: "New Restaurant Registration",
      message: "Mike's Diner has requested to join the platform",
      user: "Mike Wilson",
      timestamp: "2024-02-12T10:30:00",
      read: false,
      priority: "high",
    },
    {
      id: 2,
      type: "deal_approval",
      title: "Deal Pending Approval",
      message: "Family Feast deal from Texas Roadhouse needs approval",
      user: "Texas Roadhouse",
      timestamp: "2024-02-12T09:15:00",
      read: false,
      priority: "medium",
    },
    {
      id: 3,
      type: "user_signup",
      title: "New User Registration",
      message: "James Taylor has signed up as a customer",
      user: "James Taylor",
      timestamp: "2024-02-12T08:45:00",
      read: true,
      priority: "low",
    },
    {
      id: 4,
      type: "restaurant_request",
      title: "New Restaurant Registration",
      message: "Garcia's Mexican Grill has requested to join the platform",
      user: "Maria Garcia",
      timestamp: "2024-02-11T16:20:00",
      read: false,
      priority: "high",
    },
    {
      id: 5,
      type: "deal_expired",
      title: "Deal Expired",
      message: "Sushi Combo deal from Benihana has expired",
      user: "Benihana",
      timestamp: "2024-02-11T14:00:00",
      read: true,
      priority: "low",
    },
    {
      id: 6,
      type: "deal_popular",
      title: "Popular Deal Alert",
      message: "Burger Feast Deal has been availed 200+ times",
      user: "Olive Garden",
      timestamp: "2024-02-11T12:30:00",
      read: true,
      priority: "medium",
    },
    {
      id: 7,
      type: "user_signup",
      title: "New User Registration",
      message: "Sarah Johnson has signed up as a customer",
      user: "Sarah Johnson",
      timestamp: "2024-02-10T18:15:00",
      read: true,
      priority: "low",
    },
    {
      id: 8,
      type: "restaurant_approved",
      title: "Restaurant Approved",
      message: "Brown's Steakhouse has been approved and is now live",
      user: "David Brown",
      timestamp: "2024-02-10T15:45:00",
      read: true,
      priority: "medium",
    },
  ])

  const handleMarkAsRead = (id) => {
    console.log("Mark as read:", id)
  }

  const handleMarkAllAsRead = () => {
    console.log("Mark all as read")
  }

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : activeTab === "unread"
        ? notifications.filter((n) => !n.read)
        : notifications.filter((n) => n.type === activeTab)

  const getNotificationIcon = (type) => {
    switch (type) {
      case "restaurant_request":
        return (
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        )
      case "deal_approval":
      case "deal_expired":
      case "deal_popular":
        return (
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
        )
      case "user_signup":
        return (
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        )
      case "restaurant_approved":
        return (
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      default:
        return (
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        )
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case "restaurant_request":
        return "primary"
      case "deal_approval":
        return "warning"
      case "deal_expired":
        return "danger"
      case "deal_popular":
        return "success"
      case "user_signup":
        return "info"
      case "restaurant_approved":
        return "success"
      default:
        return "info"
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return "danger"
      case "medium":
        return "warning"
      case "low":
        return "info"
      default:
        return "info"
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMs = now - date
    const diffInMins = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMs / 3600000)
    const diffInDays = Math.floor(diffInMs / 86400000)

    if (diffInMins < 1) return "Just now"
    if (diffInMins < 60) return `${diffInMins}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">View all system notifications {unreadCount > 0 && `(${unreadCount} unread)`}</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-secondary" onClick={handleMarkAllAsRead}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Mark All as Read
          </button>
        )}
      </div>

      {/* Professional Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Notifications</span>
            <div className="stat-icon primary">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
          </div>
          <div className="stat-value">{notifications.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Unread</span>
            <div className="stat-icon warning">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div className="stat-value">{unreadCount}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">High Priority</span>
            <div className="stat-icon danger">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <div className="stat-value">{notifications.filter((n) => n.priority === "high").length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Today</span>
            <div className="stat-icon info">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div className="stat-value">
            {
              notifications.filter((n) => {
                const notifDate = new Date(n.timestamp)
                const today = new Date()
                return notifDate.toDateString() === today.toDateString()
              }).length
            }
          </div>
        </div>
      </div>

      {/* Professional Notifications List */}
      <div className="notifications-table-section">
        <div className="modern-table-container">
          <div className="modern-table-header">
            <div className="table-header-content">
              <h2 className="table-title">Notifications Center</h2>
              <p className="table-subtitle">Stay updated with all platform activities</p>
            </div>
            <div className="notifications-tabs">
              <button className={`notifications-tab ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
                All Notifications
              </button>
              <button className={`notifications-tab ${activeTab === "unread" ? "active" : ""}`} onClick={() => setActiveTab("unread")}>
                Unread
              </button>
              <button
                className={`notifications-tab ${activeTab === "restaurant_request" ? "active" : ""}`}
                onClick={() => setActiveTab("restaurant_request")}
              >
                Restaurant Requests
              </button>
              <button
                className={`notifications-tab ${activeTab === "deal_approval" ? "active" : ""}`}
                onClick={() => setActiveTab("deal_approval")}
              >
                Deal Approvals
              </button>
              <button
                className={`notifications-tab ${activeTab === "user_signup" ? "active" : ""}`}
                onClick={() => setActiveTab("user_signup")}
              >
                User Signups
              </button>
            </div>
          </div>
          <div className="modern-table-wrapper">
            <div className="professional-notifications-list">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.read ? "unread" : ""}`}
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              >
                <div className={`notification-icon ${getNotificationColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-header">
                    <h3 className="notification-title">{notification.title}</h3>
                    <div className="notification-meta">
                      <span className={`badge ${getPriorityBadge(notification.priority)}`}>
                        {notification.priority}
                      </span>
                      <span className="notification-time">{formatTimestamp(notification.timestamp)}</span>
                    </div>
                  </div>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-user">{notification.user}</span>
                </div>
                {!notification.read && <div className="notification-unread-dot"></div>}
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications
