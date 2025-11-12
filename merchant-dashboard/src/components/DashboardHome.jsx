"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import iconarrow from "../assets/images/Vector.png"
import apiService from '../services/api'

function DashboardHome() {
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState({
    restaurants: { total: 0, approved: 0 },
    deals: { total: 0, active: 0 },
    redemptions: { total: 0, availed: 0 },
    views: 0,
    visits: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Format date to relative time (e.g., "2 hours ago", "1 day ago")
  const formatRelativeTime = (date) => {
    const now = new Date()
    const diffInMs = now - date
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  // Get badge class for status
  const getStatusBadgeClass = (status) => {
    switch(status.toLowerCase()) {
      case 'active':
      case 'availed':
        return 'badge success'
      case 'expired':
      case 'cancelled':
        return 'badge danger'
      case 'pending':
      case 'inactive':
        return 'badge warning'
      default:
        return 'badge'
    }
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch restaurants, deals, and redemptions
      const [restaurantsRes, dealsRes, redemptionsRes] = await Promise.all([
        apiService.getMyRestaurants(),
        apiService.getMyDeals(),
        apiService.getMyRedemptions().catch(() => ({ data: { redemptions: [] } }))
      ])

      const restaurants = restaurantsRes.data?.restaurants || []
      const deals = dealsRes.data?.deals || []
      const redemptions = redemptionsRes.data?.redemptions || []

      // Calculate stats
      const approvedRestaurants = restaurants.filter(r => r.approvalStatus === 'APPROVED')
      const activeDeals = deals.filter(d => d.isActive && new Date(d.expiresAt) > new Date())
      const availedRedemptions = redemptions.filter(r => r.status === 'APPROVED' || r.status === 'USED')
      
      // Calculate total views/visits from all deals
      const totalViews = deals.reduce((sum, deal) => sum + (deal.viewCount || 0), 0)
      const totalVisits = deals.reduce((sum, deal) => sum + (deal.usedCount || 0), 0)

      setStats({
        restaurants: {
          total: restaurants.length,
          approved: approvedRestaurants.length
        },
        deals: {
          total: deals.length,
          active: activeDeals.length
        },
        redemptions: {
          total: redemptions.length,
          availed: availedRedemptions.length
        },
        views: totalViews,
        visits: totalVisits
      })

      // Build recent activity from deals and redemptions
      const activities = []
      
      // Add deal creation activities
      deals.forEach(deal => {
        activities.push({
          id: `deal-${deal.id}`,
          activity: `Deal created - ${deal.title}`,
          type: deal.discountType === 'BOGO' ? 'BOGO Deal' : deal.discountType === 'PERCENTAGE' ? 'Discount Deal' : 'Fixed Deal',
          status: deal.isActive && new Date(deal.expiresAt) > new Date() ? 'Active' : 
                  new Date(deal.expiresAt) <= new Date() ? 'Expired' : 'Inactive',
          date: new Date(deal.createdAt),
          timestamp: deal.createdAt
        })
      })
      
      // Add redemption activities
      redemptions.forEach(redemption => {
        const dealTitle = redemption.deal?.title || 'Deal'
        activities.push({
          id: `redemption-${redemption.id}`,
          activity: `Deal availed - ${dealTitle}`,
          type: redemption.deal?.discountType === 'BOGO' ? 'BOGO Deal' : 'Deal',
          status: redemption.status === 'APPROVED' || redemption.status === 'USED' ? 'Availed' : 
                  redemption.status === 'PENDING' ? 'Pending' : 'Cancelled',
          date: new Date(redemption.claimedAt || redemption.createdAt),
          timestamp: redemption.claimedAt || redemption.createdAt
        })
      })
      
      // Sort by date (most recent first) and take top 10
      activities.sort((a, b) => b.date - a.date)
      setRecentActivity(activities.slice(0, 10))
      
      setError(null)
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-home">
      {loading && <div style={{ padding: '20px', textAlign: 'center' }}>Loading dashboard data...</div>}
      {error && <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>{error}</div>}
      
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening with your restaurants today.</p>
        </div>
        <div className="header-actions">
          <Link to="add-restaurants" style={{ textDecoration: "none" }}><button className="btn-primary">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Restaurant
          </button></Link>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-card">
          <div className="welcome-content">
            <div className="welcome-text">
              <h2>Hello User!</h2>
              <p>Here's what's happening with your restaurants today. You have {stats.deals.active} active deals and your restaurants have been viewed {stats.views} times.</p>
            </div>
            <div className="welcome-stats">
              <div className="welcome-stat">
                <div className="welcome-stat-value">{stats.restaurants.total}</div>
                <div className="welcome-stat-label">Total Restaurants</div>
              </div>
              <div className="welcome-stat">
                <div className="welcome-stat-value">{stats.redemptions.availed}</div>
                <div className="welcome-stat-label">Deals Availed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      {/* <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Restaurants</span>
            <div className="stat-icon primary">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
          <div className="stat-value">55</div>
          <div className="stat-change positive">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>12% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Active Deals</span>
            <div className="stat-icon success">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
          </div>
          <div className="stat-value">156</div>
          <div className="stat-change positive">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>8% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Users</span>
            <div className="stat-icon info">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <div className="stat-value">2,847</div>
          <div className="stat-change positive">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>23% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Pending Approvals</span>
            <div className="stat-icon warning">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="stat-value">12</div>
          <div className="stat-change negative">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span>3 from yesterday</span>
          </div>
        </div>
      </div> */}

      {/* my analytics */}


      <div className="my-analytics-cards">
        <div className="stat-card-2">
          <div className="stat-header-2">
            <span className="stat-title-2">Views</span>
          </div>
          <div className="stat-cards-sub-headings">
            <div className="stat-value-2">{stats.views.toLocaleString()}</div>
            <div className="stat-change-2 positive">
              <span>Live Data</span>
            </div>
          </div>
        </div>
        <div className="stat-card-2-light">
          <div className="stat-header-2">
            <span className="stat-title-2">Visits</span>
          </div>
          <div className="stat-cards-sub-headings">
            <div className="stat-value-2">{stats.visits.toLocaleString()}</div>
            <div className="stat-change-2 positive">
              <span>Live Data</span>
            </div>
          </div>
        </div>
        <div className="stat-card-2">
          <div className="stat-header-2">
            <span className="stat-title-2">Total Deals</span>
          </div>
          <div className="stat-cards-sub-headings">
            <div className="stat-value-2">{stats.deals.total}</div>
            <div className="stat-change-2 positive">
              <span>Live Data</span>
            </div>
          </div>
        </div>
        <div className="stat-card-2-light">
          <div className="stat-header-2">
            <span className="stat-title-2">Deals Availed</span>
          </div>
          <div className="stat-cards-sub-headings">
            <div className="stat-value-2">{stats.redemptions.availed}</div>
            <div className="stat-change-2 positive">
              <span>Live Data</span>
            </div>
          </div>
        </div>


      </div>







      {/* Analytics Section */}
      <div className="analytics-section">
        <div className="analytics-main">

          {/* <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Total Restaurants</span>
                <div className="stat-icon primary">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
              <div className="stat-value">55</div>
              <div className="stat-change positive">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>12% from last month</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Active Deals</span>
                <div className="stat-icon success">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
              </div>
              <div className="stat-value">156</div>
              <div className="stat-change positive">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>8% from last month</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Pending Deals</span>
                <div className="stat-icon warning">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="stat-value">4</div>
              <div className="stat-change positive">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>23 from last 3 days</span>
              </div>
            </div>


            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Expired Deals</span>
                <div className="stat-icon expired">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                    <circle cx="12" cy="12" r="9" strokeWidth={2} />
                  </svg>
                </div>
              </div>
              <div className="stat-value">12</div>
              <div className="stat-change negative">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span>3 from yesterday</span>
              </div>
            </div>


            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Total Users</span>
                <div className="stat-icon info">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="stat-value">2,847</div>
              <div className="stat-change positive">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>23% from last month</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Active Users</span>
                <div className="stat-icon active">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                    <circle cx="17" cy="17" r="3" fill="green" stroke="none" />
                  </svg>
                </div>
              </div>
              <div className="stat-value">50+</div>
              <div className="stat-change positive">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>89% from last month</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">In Active Users</span>
                <div className="stat-icon inactive">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      opacity="0.4"
                    />
                  </svg>
                </div>
              </div>
              <div className="stat-value">50+</div>
              <div className="stat-change negative">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span>6 from yesterday</span>
              </div>
            </div>

          </div> */}

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Revenue Analytics</h2>
              <div className="chart-controls">
                <span className="coming-soon-badge">Coming Soon</span>
              </div>
            </div>

            <div className="card-body">
              <div className="chart-container" style={{ position: 'relative', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <svg width="64" height="64" fill="none" stroke="#9ca3af" viewBox="0 0 24 24" style={{ margin: '0 auto 16px' }}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h3 style={{ color: '#6b7280', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Future Feature</h3>
                  <p style={{ color: '#9ca3af', fontSize: '14px' }}>Revenue analytics will be available in the next update</p>
                </div>
              </div>
            </div>
          </div>


          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Revenue Analytics - Bar Chart</h2>
              <div className="chart-controls">
                <span className="coming-soon-badge">Coming Soon</span>
              </div>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ position: 'relative', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <svg width="64" height="64" fill="none" stroke="#9ca3af" viewBox="0 0 24 24" style={{ margin: '0 auto 16px' }}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h3 style={{ color: '#6b7280', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Future Feature</h3>
                  <p style={{ color: '#9ca3af', fontSize: '14px' }}>Revenue analytics will be available in the next update</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Sidebar */}
        <div className="notifications-sidebar">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Live Notifications</h3>
              <div className="notification-indicator">
                <span className="notification-dot"></span>
                <span className="notification-count">5</span>
              </div>
            </div>
            <div className="card-body">
              <div className="notifications-list">
                <div className="notification-item new">
                  <div className="notification-avatar success">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">Your Restaurant's Franchise Approved</div>
                    <div className="notification-text">New Town Franchise for Olive Garden has been approved and is now live</div>
                    <div className="notification-time">2 min ago</div>
                  </div>
                </div>

                <div className="notification-item">
                  <div className="notification-avatar warning">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">Deal Expiring Soon</div>
                    <div className="notification-text">Summer Special expires in 2 hours</div>
                    <div className="notification-time">5 min ago</div>
                  </div>
                </div>

                <div className="notification-item">
                  <div className="notification-avatar info">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">Deal Expiring Soon</div>
                    <div className="notification-text">Family Pack Deal 02 expires in 5 hours</div>
                    <div className="notification-time">8 min ago</div>
                  </div>
                </div>
                
                
                <div className="notification-item">
                  <div className="notification-avatar info">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">Deal Expired</div>
                    <div className="notification-text">Weekend Special has expired</div>
                    <div className="notification-time">4 days ago</div>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-avatar info">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">Deal Activated</div>
                    <div className="notification-text">Family pak deal 02 is now active</div>
                    <div className="notification-time">5 days ago</div>
                  </div>
                </div>
               
                <div className="notification-item">
                  <div className="notification-avatar primary">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">Deal Activated</div>
                    <div className="notification-text">Weekend Special is now active</div>
                    <div className="notification-time">6 days ago</div>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-avatar info">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">Your Restaurant Approved</div>
                    <div className="notification-text">Your Restaurant Olive Garden Approved</div>
                    <div className="notification-time">6 days ago</div>
                  </div>
                </div>
              </div>

              <div className="notifications-footer">
                <Link to="notifications" style={{ textDecoration: "none", color: "gray" }}>   <button className="btn-view-all">View All Notifications</button> </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
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
                {loading ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#9ca3af' }}>
                      Loading activity...
                    </td>
                  </tr>
                ) : recentActivity.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#9ca3af' }}>
                      No recent activity
                    </td>
                  </tr>
                ) : (
                  recentActivity.map((activity) => (
                    <tr key={activity.id}>
                      <td>{activity.activity}</td>
                      <td>{activity.type}</td>
                      <td>
                        <span className={getStatusBadgeClass(activity.status)}>{activity.status}</span>
                      </td>
                      <td>{formatRelativeTime(activity.date)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHome
