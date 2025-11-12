"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import iconarrow from "../assets/images/Vector.png"
import lock from "../assets/images/lock.svg"


function DashboardHome() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="dashboard-home">
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
              <h2>Good Morning, Admin!</h2>
              <p>Here's what's happening with Halal in the City today. You have 12 pending approvals and 3 new restaurants waiting for review.</p>
            </div>
            <div className="welcome-stats">
              <div className="welcome-stat">
                <div className="welcome-stat-value">98%</div>
                <div className="welcome-stat-label">System Health</div>
              </div>
              <div className="welcome-stat">
                <div className="welcome-stat-value">$2.4K</div>
                <div className="welcome-stat-label">Today's Revenue</div>
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
            <div className="stat-value-2">7,265</div>
            <div className="stat-change-2 positive">
              <span>+11.01% </span><img src={iconarrow} />
            </div>
          </div>
        </div>
        <div className="stat-card-2-light">
          <div className="stat-header-2">
            <span className="stat-title-2">Visits</span>
          </div>
          <div className="stat-cards-sub-headings">
            <div className="stat-value-2">3,671</div>
            <div className="stat-change-2 positive">
              <span>-0.03% </span><img src={iconarrow} />
            </div>
          </div>
        </div>
        <div className="stat-card-2">
          <div className="stat-header-2">
            <span className="stat-title-2">New Users</span>
          </div>
          <div className="stat-cards-sub-headings">
            <div className="stat-value-2">15</div>
            <div className="stat-change-2 positive">
              <span>+15.03% </span><img src={iconarrow} />
            </div>
          </div>
        </div>
        <div className="stat-card-2-light">
          <div className="stat-header-2">
            <span className="stat-title-2">Active Users</span>
          </div>
          <div className="stat-cards-sub-headings">
            <div className="stat-value-2">2,318</div>
            <div className="stat-change-2 positive">
              <span>+06.08% </span><img src={iconarrow} />
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
                <select className="chart-select">
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 3 months</option>
                </select>
              </div>
            </div>
            <div className="lock-this-body">

              <div className="card-body">
                <div className="chart-container">
                  <div className="chart-wrapper">
                    {/* <svg viewBox="0 0 800 300" className="revenue-chart" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#D4AC30', stopOpacity: 0.3 }} />
                          <stop offset="100%" style={{ stopColor: '#C69A1A', stopOpacity: 0 }} />
                        </linearGradient>
                      </defs>

                      <g className="grid-lines">
                        <line x1="60" y1="40" x2="60" y2="240" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="60" y1="240" x2="740" y2="240" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="60" y1="190" x2="740" y2="190" stroke="#f3f4f6" strokeWidth="1" />
                        <line x1="60" y1="140" x2="740" y2="140" stroke="#f3f4f6" strokeWidth="1" />
                        <line x1="60" y1="90" x2="740" y2="90" stroke="#f3f4f6" strokeWidth="1" />
                      </g>

                      <path
                        d="M80,180 L160,160 L240,120 L320,100 L400,140 L480,90 L560,110 L640,70 L640,240 L80,240 Z"
                        fill="url(#lineGradient)"
                      />

                      <path
                        d="M80,180 L160,160 L240,120 L320,100 L400,140 L480,90 L560,110 L640,70"
                        stroke="#D4AC30"
                        strokeWidth="3"
                        fill="none"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />

                      <g fill="#D4AC30" stroke="#fff" strokeWidth="2">
                        <circle cx="80" cy="180" r="5" />
                        <circle cx="160" cy="160" r="5" />
                        <circle cx="240" cy="120" r="5" />
                        <circle cx="320" cy="100" r="5" />
                        <circle cx="400" cy="140" r="5" />
                        <circle cx="480" cy="90" r="5" />
                        <circle cx="560" cy="110" r="5" />
                        <circle cx="640" cy="70" r="5" />
                      </g>

                      <g className="labels" fontSize="12" fill="#6b7280">
                        <text x="110" y="260" textAnchor="middle">Mon</text>
                        <text x="190" y="260" textAnchor="middle">Tue</text>
                        <text x="270" y="260" textAnchor="middle">Wed</text>
                        <text x="350" y="260" textAnchor="middle">Thu</text>
                        <text x="430" y="260" textAnchor="middle">Fri</text>
                        <text x="510" y="260" textAnchor="middle">Sat</text>
                        <text x="590" y="260" textAnchor="middle">Sun</text>
                        <text x="670" y="260" textAnchor="middle">Today</text>
                      </g>

                      <g className="y-labels" fontSize="10" fill="#9ca3af">
                        <text x="50" y="245" textAnchor="end">$0</text>
                        <text x="50" y="195" textAnchor="end">$1K</text>
                        <text x="50" y="145" textAnchor="end">$2K</text>
                        <text x="50" y="95" textAnchor="end">$3K</text>
                        <text x="50" y="45" textAnchor="end">$4K</text>
                      </g>

                      <g className="values" fontSize="11" fill="#374151" fontWeight="600">
                        <text x="80" y="165" textAnchor="middle">$1.2K</text>
                        <text x="160" y="145" textAnchor="middle">$1.6K</text>
                        <text x="240" y="105" textAnchor="middle">$2.4K</text>
                        <text x="320" y="85" textAnchor="middle">$2.8K</text>
                        <text x="400" y="125" textAnchor="middle">$2.0K</text>
                        <text x="480" y="75" textAnchor="middle">$3.0K</text>
                        <text x="560" y="95" textAnchor="middle">$2.6K</text>
                        <text x="640" y="55" textAnchor="middle">$3.4K</text>
                      </g>
                    </svg> */}

                    <img src={lock} />
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Revenue Analytics</h2>
              <div className="chart-controls">
                <select className="chart-select">
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 3 months</option>
                </select>
              </div>
            </div>

            <div className="lock-this-body">
              <div className="card-body" >
                <div className="chart-container">
                  <div className="chart-wrapper">
                    {/* <svg viewBox="0 0 800 300" className="revenue-chart">
                      <defs>
                        <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#D4AC30', stopOpacity: 0.8 }} />
                          <stop offset="100%" style={{ stopColor: '#C69A1A', stopOpacity: 0.9 }} />
                        </linearGradient>
                      </defs>

                      <g className="grid-lines">
                        <line x1="60" y1="40" x2="60" y2="240" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="60" y1="240" x2="740" y2="240" stroke="#e5e7eb" strokeWidth="1" />
                        <line x1="60" y1="190" x2="740" y2="190" stroke="#f3f4f6" strokeWidth="1" />
                        <line x1="60" y1="140" x2="740" y2="140" stroke="#f3f4f6" strokeWidth="1" />
                        <line x1="60" y1="90" x2="740" y2="90" stroke="#f3f4f6" strokeWidth="1" />
                      </g>

                      <g className="bars">
                        <rect x="80" y="180" width="60" height="60" fill="url(#barGradient)" rx="4" />
                        <rect x="160" y="160" width="60" height="80" fill="url(#barGradient)" rx="4" />
                        <rect x="240" y="120" width="60" height="120" fill="url(#barGradient)" rx="4" />
                        <rect x="320" y="100" width="60" height="140" fill="url(#barGradient)" rx="4" />
                        <rect x="400" y="140" width="60" height="100" fill="url(#barGradient)" rx="4" />
                        <rect x="480" y="90" width="60" height="150" fill="url(#barGradient)" rx="4" />
                        <rect x="560" y="110" width="60" height="130" fill="url(#barGradient)" rx="4" />
                        <rect x="640" y="70" width="60" height="170" fill="url(#barGradient)" rx="4" />
                      </g>

                      <g className="labels" fontSize="12" fill="#6b7280">
                        <text x="110" y="260" textAnchor="middle">Mon</text>
                        <text x="190" y="260" textAnchor="middle">Tue</text>
                        <text x="270" y="260" textAnchor="middle">Wed</text>
                        <text x="350" y="260" textAnchor="middle">Thu</text>
                        <text x="430" y="260" textAnchor="middle">Fri</text>
                        <text x="510" y="260" textAnchor="middle">Sat</text>
                        <text x="590" y="260" textAnchor="middle">Sun</text>
                        <text x="670" y="260" textAnchor="middle">Today</text>
                      </g>

                      <g className="values" fontSize="11" fill="#374151" fontWeight="600">
                        <text x="110" y="175" textAnchor="middle">$1.2K</text>
                        <text x="190" y="155" textAnchor="middle">$1.6K</text>
                        <text x="270" y="115" textAnchor="middle">$2.4K</text>
                        <text x="350" y="95" textAnchor="middle">$2.8K</text>
                        <text x="430" y="135" textAnchor="middle">$2.0K</text>
                        <text x="510" y="85" textAnchor="middle">$3.0K</text>
                        <text x="590" y="105" textAnchor="middle">$2.6K</text>
                        <text x="670" y="65" textAnchor="middle">$3.4K</text>
                      </g>

                      <g className="y-labels" fontSize="10" fill="#9ca3af">
                        <text x="50" y="245" textAnchor="end">$0</text>
                        <text x="50" y="195" textAnchor="end">$1K</text>
                        <text x="50" y="145" textAnchor="end">$2K</text>
                        <text x="50" y="95" textAnchor="end">$3K</text>
                        <text x="50" y="45" textAnchor="end">$4K</text>
                      </g>
                    </svg> */}

                                        <img src={lock} />
                  </div>
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
                    <div className="notification-title">New Restaurant Approved</div>
                    <div className="notification-text">Olive Garden has been approved and is now live</div>
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
                    <div className="notification-title">New User Signup</div>
                    <div className="notification-text">Sarah Johnson joined the platform</div>
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
                    <div className="notification-title">New User Signup</div>
                    <div className="notification-text">Sarah Johnson joined the platform</div>
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
                    <div className="notification-title">New User Signup</div>
                    <div className="notification-text">Sarah Johnson joined the platform</div>
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
                    <div className="notification-title">New User Signup</div>
                    <div className="notification-text">Sarah Johnson joined the platform</div>
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
                    <div className="notification-title">New User Signup</div>
                    <div className="notification-text">Sarah Johnson joined the platform</div>
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
                    <div className="notification-title">New User Signup</div>
                    <div className="notification-text">Sarah Johnson joined the platform</div>
                    <div className="notification-time">8 min ago</div>
                  </div>
                </div>

                <div className="notification-item">
                  <div className="notification-avatar danger">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">Payment Failed</div>
                    <div className="notification-text">Restaurant payment requires attention</div>
                    <div className="notification-time">15 min ago</div>
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
                    <div className="notification-time">22 min ago</div>
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
          {/* <div className="tabs">
            <button
              className={`tab ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`tab ${activeTab === "restaurants" ? "active" : ""}`}
              onClick={() => setActiveTab("restaurants")}
            >
              Restaurants
            </button>
            <button className={`tab ${activeTab === "deals" ? "active" : ""}`} onClick={() => setActiveTab("deals")}>
              Deals
            </button>
            <button className={`tab ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
              Users
            </button>
          </div> */}
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
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>New restaurant registration - Olive Garden</td>
                  <td>Restaurant</td>
                  <td>
                    <span className="badge warning">Pending</span>
                  </td>
                  <td>2 hours ago</td>
                  {/* <td>
                    <div className="action-buttons">
                      <button className="action-btn edit">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button className="action-btn delete">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </td> */}
                </tr>
                <tr>
                  <td>Deal activated - Burger Feast Deal</td>
                  <td>Deal</td>
                  <td>
                    <span className="badge success">Active</span>
                  </td>
                  <td>5 hours ago</td>
                  {/* <td>
                    <div className="action-buttons">
                      <button className="action-btn edit">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button className="action-btn delete">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                    </div>
                  </td> */}
                </tr>
                <tr>
                  <td>New user registration - John Smith</td>
                  <td>User</td>
                  <td>
                    <span className="badge success">Approved</span>
                  </td>
                  <td>1 day ago</td>
                  {/* <td>
                    <div className="action-buttons">
                      <button className="action-btn edit">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button className="action-btn delete">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td> */}
                </tr>
                <tr>
                  <td>Branch added - Red Lobster Downtown</td>
                  <td>Branch</td>
                  <td>
                    <span className="badge success">Active</span>
                  </td>
                  <td>2 days ago</td>
                  {/* <td>
                    <div className="action-buttons">
                      <button className="action-btn edit">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button className="action-btn delete">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                    </div>
                  </td> */}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHome
