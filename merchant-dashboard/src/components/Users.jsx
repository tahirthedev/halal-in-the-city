"use client"

import { useState } from "react"
import "../styles/users.css"
import "../styles/modal.css"

function Users() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedUser, setSelectedUser] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  const [users] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      role: "customer",
      status: "active",
      joinedDate: "2024-01-15",
      dealsAvailed: 12,
      lastActive: "2024-02-10",
      phone: "+1 234 567 8900",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      role: "customer",
      status: "active",
      joinedDate: "2024-01-20",
      dealsAvailed: 8,
      lastActive: "2024-02-12",
      phone: "+1 234 567 8901",
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike.wilson@example.com",
      role: "restaurant_owner",
      status: "pending",
      joinedDate: "2024-02-08",
      dealsAvailed: 0,
      lastActive: "2024-02-08",
      phone: "+1 234 567 8902",
      restaurantName: "Mike's Diner",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.d@example.com",
      role: "customer",
      status: "active",
      joinedDate: "2023-12-10",
      dealsAvailed: 25,
      lastActive: "2024-02-11",
      phone: "+1 234 567 8903",
    },
    {
      id: 5,
      name: "David Brown",
      email: "david.brown@example.com",
      role: "restaurant_owner",
      status: "active",
      joinedDate: "2024-01-05",
      dealsAvailed: 0,
      lastActive: "2024-02-09",
      phone: "+1 234 567 8904",
      restaurantName: "Brown's Steakhouse",
    },
    {
      id: 6,
      name: "Lisa Anderson",
      email: "lisa.a@example.com",
      role: "customer",
      status: "inactive",
      joinedDate: "2023-11-20",
      dealsAvailed: 5,
      lastActive: "2024-01-15",
      phone: "+1 234 567 8905",
    },
    {
      id: 7,
      name: "James Taylor",
      email: "james.t@example.com",
      role: "customer",
      status: "active",
      joinedDate: "2024-02-01",
      dealsAvailed: 3,
      lastActive: "2024-02-12",
      phone: "+1 234 567 8906",
    },
    {
      id: 8,
      name: "Maria Garcia",
      email: "maria.garcia@example.com",
      role: "restaurant_owner",
      status: "pending",
      joinedDate: "2024-02-10",
      dealsAvailed: 0,
      lastActive: "2024-02-10",
      phone: "+1 234 567 8907",
      restaurantName: "Garcia's Mexican Grill",
    },
  ])

  const handleViewDetails = (user) => {
    setSelectedUser(user)
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setShowEditModal(true)
  }

  const handleStatusChange = (newStatus) => {
    if (editingUser) {
      // Update user status logic here
      console.log(`Changing user ${editingUser.id} status to ${newStatus}`)
      setShowEditModal(false)
      setEditingUser(null)
    }
  }

  const handleNavigateToRestaurants = () => {
    // Navigate to restaurants page - you can implement this with your router
    console.log("Navigate to restaurants page")
  }

  const filteredUsers =
    activeTab === "all"
      ? users
      : users.filter((u) => {
          if (activeTab === "customers") return u.role === "customer"
          if (activeTab === "restaurant_owners") return u.role === "restaurant_owner"
          if (activeTab === "pending") return u.status === "pending"
          return true
        })

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return "success"
      case "pending":
        return "warning"
      case "inactive":
        return "danger"
      default:
        return "info"
    }
  }

  const getRoleBadge = (role) => {
    return role === "restaurant_owner" ? "primary" : "info"
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Users Management</h1>
          <p className="page-subtitle">Manage all users, customers, and restaurant owners</p>
        </div>
      </div>

      {/* Professional Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total-users">
          <div className="stat-icon-wrapper">
            <div className="stat-icon primary">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{users.length}</div>
            <div className="stat-title">Total Users</div>
            <div className="stat-subtitle">Registered members</div>
          </div>
        </div>

        <div className="stat-card active-users">
          <div className="stat-icon-wrapper">
            <div className="stat-icon success">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{users.filter((u) => u.status === "active").length}</div>
            <div className="stat-title">Active Users</div>
            <div className="stat-subtitle">Currently online</div>
          </div>
        </div>

        <div className="stat-card pending-users">
          <div className="stat-icon-wrapper">
            <div className="stat-icon warning">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{users.filter((u) => u.status === "pending").length}</div>
            <div className="stat-title">Pending Approval</div>
            <div className="stat-subtitle">Awaiting review</div>
          </div>
        </div>

        <div className="stat-card restaurant-owners">
          <div className="stat-icon-wrapper">
            <div className="stat-icon info">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{users.filter((u) => u.role === "restaurant_owner").length}</div>
            <div className="stat-title">Restaurant Owners</div>
            <div className="stat-subtitle">Business partners</div>
          </div>
        </div>
      </div>

      {/* Professional Users Table */}
      <div className="users-table-section">
        <div className="modern-table-container">
          <div className="modern-table-header">
            <div className="table-header-content">
              <h2 className="table-title">User Management</h2>
              <p className="table-subtitle">Manage all users, customers, and restaurant owners</p>
            </div>
            <div className="users-tabs">
              <button className={`users-tab ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
                All Users
              </button>
              <button
                className={`users-tab ${activeTab === "customers" ? "active" : ""}`}
                onClick={() => setActiveTab("customers")}
              >
                Customers
              </button>
              <button
                className={`users-tab ${activeTab === "restaurant_owners" ? "active" : ""}`}
                onClick={() => setActiveTab("restaurant_owners")}
              >
                Restaurant Owners
              </button>
              <button
                className={`users-tab ${activeTab === "pending" ? "active" : ""}`}
                onClick={() => setActiveTab("pending")}
              >
                Pending Approval
              </button>
            </div>
          </div>
          <div className="modern-table-wrapper">
            <div className="professional-table-container">
              <table className="professional-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined Date</th>
                  <th>Deals Availed</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getRoleBadge(user.role)}`}>
                        {user.role === "restaurant_owner" ? "Restaurant Owner" : "Customer"}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(user.status)}`}>{user.status}</span>
                    </td>
                    <td>{new Date(user.joinedDate).toLocaleDateString()}</td>
                    <td>{user.dealsAvailed}</td>
                    <td>{new Date(user.lastActive).toLocaleDateString()}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleViewDetails(user)}
                          title="View Details"
                        >
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
                        <button 
                          className="btn btn-sm btn-secondary" 
                          onClick={() => handleEditUser(user)}
                          title="Edit Status"
                        >
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced User Details Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">User Profile Details</h2>
              <button className="modal-close" onClick={() => setSelectedUser(null)}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="user-details-enhanced">
                {/* User Profile Header */}
                <div className="user-profile-header">
                  <div className="user-avatar-enhanced">
                    {selectedUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="user-profile-info">
                    <h3 className="user-profile-name">{selectedUser.name}</h3>
                    <p className="user-profile-email">{selectedUser.email}</p>
                    <div className="user-profile-badges">
                      <span className={`badge ${getStatusBadge(selectedUser.status)}`}>{selectedUser.status}</span>
                      <span className={`badge ${getRoleBadge(selectedUser.role)}`}>
                        {selectedUser.role === "restaurant_owner" ? "Restaurant Owner" : "Customer"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Statistics */}
                <div className="user-stats-section">
                  <h4>User Statistics</h4>
                  <div className="user-stats-grid">
                    <div className="user-stat-card">
                      <div className="stat-icon">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div className="stat-content">
                        <span className="stat-number">{selectedUser.dealsAvailed}</span>
                        <span className="stat-label">Deals Availed</span>
                      </div>
                    </div>
                    <div className="user-stat-card">
                      <div className="stat-icon">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="stat-content">
                        <span className="stat-number">{Math.floor((new Date() - new Date(selectedUser.joinedDate)) / (1000 * 60 * 60 * 24))}</span>
                        <span className="stat-label">Days as Member</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Information */}
                <div className="user-details-section">
                  <h4>Contact & Account Information</h4>
                  <div className="details-grid">
                    <div className="detail-item">
                      <div className="detail-icon">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Phone Number</span>
                        <span className="detail-value">{selectedUser.phone}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-icon">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Joined Date</span>
                        <span className="detail-value">{new Date(selectedUser.joinedDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-icon">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Last Active</span>
                        <span className="detail-value">{new Date(selectedUser.lastActive).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-icon">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="detail-content">
                        <span className="detail-label">Account Status</span>
                        <span className="detail-value">{selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Restaurant Information for Owners */}
                {selectedUser.role === "restaurant_owner" && selectedUser.restaurantName && (
                  <div className="restaurant-info-section">
                    <h4>Restaurant Information</h4>
                    <div className="restaurant-card-info">
                      <div className="restaurant-icon">
                        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="restaurant-details">
                        <h5>{selectedUser.restaurantName}</h5>
                        <p>Restaurant Owner Account</p>
                        <button 
                          className="btn btn-primary restaurant-link-btn"
                          onClick={handleNavigateToRestaurants}
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View in Restaurants
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Status Modal */}
      {showEditModal && editingUser && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit User Status</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="status-edit-content">
                <div className="current-user-info">
                  <div className="user-avatar-small">
                    {editingUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h4>{editingUser.name}</h4>
                    <p className="user-email-small">{editingUser.email}</p>
                    <span className={`badge ${getStatusBadge(editingUser.status)}`}>
                      Current: {editingUser.status}
                    </span>
                  </div>
                </div>

                <div className="status-options">
                  <h5>Change Status To:</h5>
                  <div className="status-buttons">
                    <button 
                      className={`status-btn ${editingUser.status === 'active' ? 'current' : ''}`}
                      onClick={() => handleStatusChange('active')}
                      disabled={editingUser.status === 'active'}
                    >
                      <div className="status-btn-icon success">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="status-btn-content">
                        <span className="status-btn-title">Active</span>
                        <span className="status-btn-desc">User can access all features</span>
                      </div>
                    </button>

                    <button 
                      className={`status-btn ${editingUser.status === 'inactive' ? 'current' : ''}`}
                      onClick={() => handleStatusChange('inactive')}
                      disabled={editingUser.status === 'inactive'}
                    >
                      <div className="status-btn-icon danger">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                        </svg>
                      </div>
                      <div className="status-btn-content">
                        <span className="status-btn-title">Inactive</span>
                        <span className="status-btn-desc">User access is suspended</span>
                      </div>
                    </button>

                    <button 
                      className={`status-btn ${editingUser.status === 'pending' ? 'current' : ''}`}
                      onClick={() => handleStatusChange('pending')}
                      disabled={editingUser.status === 'pending'}
                    >
                      <div className="status-btn-icon warning">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="status-btn-content">
                        <span className="status-btn-title">Pending</span>
                        <span className="status-btn-desc">Awaiting verification</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users
