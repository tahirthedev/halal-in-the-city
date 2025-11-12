import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import apiService from "../services/api"
import "../styles/dashboard.css"

const DashboardHome = () => {
  const [stats, setStats] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await apiService.getAdminStats()
      if (res && res.success) setStats(res.data)
      const noteRes = await apiService.getNotifications()
      if (noteRes && noteRes.success) setNotifications(noteRes.data || [])
    } catch (err) {
      console.error("Failed to load dashboard data", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-home">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="header-actions">
          <Link to="/dashboard/add-restaurants" style={{ textDecoration: "none" }}>
            <button className="btn-primary">Add Restaurant</button>
          </Link>
        </div>
      </div>

      <div className="my-analytics-cards">
        <div className="stat-card-2">
          <div className="stat-header-2">
            <span className="stat-title-2">Views</span>
          </div>
          <div className="stat-cards-sub-headings">
            <div className="stat-value-2">{stats?.metrics?.views ?? "-"}</div>
            <div className="stat-change-2 positive">
              <span>Live</span>
            </div>
          </div>
        </div>

        <div className="stat-card-2-light">
          <div className="stat-header-2">
            <span className="stat-title-2">Visits</span>
          </div>
          <div className="stat-cards-sub-headings">
            <div className="stat-value-2">{stats?.metrics?.visits ?? "-"}</div>
            <div className="stat-change-2 positive">
              <span>Live</span>
            </div>
          </div>
        </div>

        <div className="stat-card-2">
          <div className="stat-header-2">
            <span className="stat-title-2">New Users (7d)</span>
          </div>
          <div className="stat-cards-sub-headings">
            <div className="stat-value-2">{stats?.users?.newLast7Days ?? 0}</div>
            <div className="stat-change-2 positive">
              <span>7d</span>
            </div>
          </div>
        </div>

        <div className="stat-card-2-light">
          <div className="stat-header-2">
            <span className="stat-title-2">Active Users</span>
          </div>
          <div className="stat-cards-sub-headings">
            <div className="stat-value-2">{stats?.users?.active ?? 0}</div>
            <div className="stat-change-2 positive">
              <span>Live</span>
            </div>
          </div>
        </div>
      </div>

      <div className="layout-grid">
        <div className="analytics-section">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Revenue Analytics</h2>
            </div>
            <div className="card-body">
              <div style={{ padding: 40, color: "#9ca3af" }}>Revenue charts are disabled in dev.</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Activity</h2>
            </div>
            <div className="card-body">
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Activity</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>System ready</td>
                      <td>Info</td>
                      <td><span className="badge success">OK</span></td>
                      <td>Just now</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="notifications-sidebar">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Live Notifications</h3>
              <div className="notification-indicator">
                <span className="notification-dot"></span>
                <span className="notification-count">{notifications.length}</span>
              </div>
            </div>
            <div className="card-body">
              <div className="notifications-list">
                {loading ? (
                  <div style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>Loading...</div>
                ) : notifications.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#9ca3af', padding: '20px' }}>No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div className={`notification-item ${n.read ? '' : 'new'}`} key={n.id}>
                      <div className={`notification-avatar ${n.type === 'ERROR' ? 'danger' : n.type === 'WARNING' ? 'warning' : 'info'}`}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v8" />
                          <circle cx="12" cy="16" r="1" />
                        </svg>
                      </div>
                      <div className="notification-content">
                        <div className="notification-title">{n.title}</div>
                        <div className="notification-text">{n.message}</div>
                        <div className="notification-time">{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="notifications-footer">
                <Link to="notifications" style={{ textDecoration: "none", color: "gray" }}><button className="btn-view-all">View All Notifications</button></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHome
