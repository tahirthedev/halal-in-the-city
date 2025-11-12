"use client"

import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import "../styles/dashboard.css"
import DashboardHome from "../components/DashboardHome"
import Restaurants from "../components/Restaurants"
import Deals from "../components/Deals"
import Users from "../components/Users"
import Notifications from "../components/Notifications"
import logo from "../assets/images/logo.png"
import AddRestaurant from "../components/AddRestaurant"
import RestaurantDetailPage from "../components/RestaurantDetailPage"
import Home from "../components/Home"
import MyRestaurants from "../components/MyRestaurants"
import AvailCoupons from "../components/AvailCoupons"
import AddDeals from "../components/AddDeals"

function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuth()
  const [notificationCount] = useState(5)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/")
  }

  const handleNavigation = (path) => {
    navigate(path)
    setMobileMenuOpen(false) // Close mobile menu after navigation
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <div className="dashboard-container">
      {/* Hamburger Menu Button */}
      <button className="hamburger-btn" onClick={toggleMobileMenu} aria-label="Toggle menu">
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Sidebar Backdrop */}
      {mobileMenuOpen && <div className="sidebar-backdrop" onClick={closeMobileMenu}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-overlay">
        </div>
        <div className="sidebar-content">

          <div className="sidebar-logo">
            <div className="sidebar-logo-circle">
              <img src={logo} alt="Logo" className="sidebar-logo-image" />
            </div>
          </div>

          <nav className="sidebar-nav">

            <button
              className={`nav-item ${isActive("/dashboard") && location.pathname === "/dashboard" ? "active" : ""}`}
              onClick={() => handleNavigation("/dashboard")}
            >
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Analytics
            </button>
            <button
              className={`nav-item ${isActive("/dashboard/home") && location.pathname === "active" ? "active" : ""}`}
              onClick={() => handleNavigation("/dashboard/home")}
            >
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </button>

            <button
              className={`nav-item ${isActive("/dashboard/my-restaurants") ? "active" : ""}`}
              onClick={() => handleNavigation("/dashboard/my-restaurants")}
            >
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              My Restaurants
            </button>

            {/* <button
              className={`nav-item ${isActive("/dashboard/add-restaurants") ? "active" : ""}`}
              onClick={() => handleNavigation("/dashboard/add-restaurants")}
            >
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 2v7c0 1.1.9 2 2 2h0c1.1 0 2-.9 2-2V2M5 11v11M15 2v20M19 7V2m0 5v15"
                />
                <circle cx="17" cy="17" r="5" fill="white" stroke="currentColor" strokeWidth={2} />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  stroke="#c9a961"
                  d="M17 15v4m-2-2h4"
                />
              </svg>
              Add Restaurant
            </button> */}

            <button
              className={`nav-item ${isActive("/dashboard/deals") ? "active" : ""}`}
              onClick={() => handleNavigation("/dashboard/deals")}
            >
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              Deals
            </button>
            {/* <button
              className={`nav-item ${isActive("/dashboard/addDeals") ? "active" : ""}`}
              onClick={() => handleNavigation("/dashboard/addDeals")}
            >
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6m13-3h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              Add Deals
            </button> */}
            <button
              className={`nav-item ${isActive("/dashboard/availCoupons") ? "active" : ""}`}
              onClick={() => handleNavigation("/dashboard/availCoupons")}
            >
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              Avail Coupons
            </button>

            <button
              className={`nav-item ${isActive("/dashboard/notifications") ? "active" : ""}`}
              onClick={() => handleNavigation("/dashboard/notifications")}
            >
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              Notifications
            </button>
          </nav>

          <div className="sidebar-user">
            <div className="user-avatar">{user?.firstName?.[0] || "M"}</div>
            <div className="user-info">
              <div className="user-name">{user?.firstName || "Merchant"}</div>
              <div className="user-role">Restaurant Owner</div>
            </div>
          </div>

        </div>

      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="top-bar-left">
            <div className="search-bar">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input type="text" placeholder="Search..." />
            </div>
          </div>

          <div className="top-bar-right">
            <button className="icon-button" onClick={() => handleNavigation("/dashboard/notifications")}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {notificationCount > 0 && <span className="notification-badge">{notificationCount}</span>}
            </button>

            <div className="user-menu">
              <div className="user-menu-avatar">{user?.firstName?.[0] || "M"}</div>
              <span className="user-menu-name">{user?.firstName || "Merchant"}</span>
            </div>

            <button className="btn btn-sm btn-danger" onClick={logout}>
              Log Out
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/home" element={<Home />} />
            <Route path="/my-restaurants" element={<MyRestaurants />} />
            <Route path="/add-restaurants" element={<AddRestaurant />} />
            <Route path="/restaurantDetailPage/:id" element={<RestaurantDetailPage />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/addDeals" element={<AddDeals />} />
            <Route path="/availCoupons" element={<AvailCoupons />} />
            <Route path="/users" element={<Users />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
