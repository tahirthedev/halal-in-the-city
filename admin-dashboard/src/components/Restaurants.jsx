import React, { useState, useEffect } from "react"
import img1 from "../assets/images/res1.jpg"
import img2 from "../assets/images/res2.jpg"
import img3 from "../assets/images/res3.jpg"
import img4 from "../assets/images/res4.jpg"
import { Link } from "react-router-dom"
import "../styles/users.css"
import "../styles/modal.css"
import apiService from "../services/api"

const Restaurants = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showBranchesModal, setShowBranchesModal] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const itemsPerPage = 6

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      const response = await apiService.getAllRestaurants()
      
      if (response.success && response.data) {
        // Transform API data to match component structure
        const transformedRestaurants = response.data.map(restaurant => ({
          id: restaurant.id,
          name: restaurant.name,
          category: restaurant.cuisineType || 'Not specified',
          plan: restaurant.subscriptionTier || 'STARTER',
          email: restaurant.email || 'N/A',
          website: restaurant.website || 'N/A',
          phone: restaurant.phone,
          description: restaurant.description || 'No description available',
          image: restaurant.logo || img1, // Use default image if no logo
          rating: restaurant.averageRating || 0,
          totalCoupons: restaurant._count?.deals || 0, // Count of deals from _count
          branches: [], // Would need separate endpoint for branches
          status: restaurant.approvalStatus === 'APPROVED' ? 'active' : 
                  restaurant.approvalStatus === 'REJECTED' ? 'rejected' : 'pending',
          joinedDate: new Date(restaurant.createdAt).toLocaleDateString(),
          certificateUrl: restaurant.halalCertificate || null,
          address: restaurant.address,
          city: restaurant.city,
          subscriptionTier: restaurant.subscriptionTier
        }))
        
        setRestaurants(transformedRestaurants)
      }
      setError(null)
    } catch (err) {
      console.error('Error fetching restaurants:', err)
      setError('Failed to load restaurants')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (restaurantId) => {
    try {
      await apiService.approveRestaurant(restaurantId)
      await fetchRestaurants() // Refresh the list
    } catch (err) {
      console.error('Error approving restaurant:', err)
      alert('Failed to approve restaurant')
    }
  }

  const handleReject = async (restaurantId) => {
    const reason = prompt('Please provide a reason for rejection:')
    if (!reason) return

    try {
      await apiService.rejectRestaurant(restaurantId, reason)
      await fetchRestaurants() // Refresh the list
    } catch (err) {
      console.error('Error rejecting restaurant:', err)
      alert('Failed to reject restaurant')
    }
  }

  // Filter restaurants
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.plan.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || restaurant.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredRestaurants.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage)

  const handleViewRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant)
    setShowViewModal(true)
  }

  const handleViewBranches = (restaurant) => {
    setSelectedRestaurant(restaurant)
    setShowBranchesModal(true)
  }

  const handleDeleteRestaurant = (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      console.log("Delete restaurant:", id)
      // Add deletion logic here
    }
  }

  const handleViewCertificate = (certificateUrl) => {
    if (certificateUrl) {
      // Open PDF in a new window/tab
      window.open(certificateUrl, '_blank', 'width=800,height=600')
    } else {
      alert('Certificate not available for this restaurant.')
    }
  }

  return (
    <div className="restaurants-page">
      {/* Header Section */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Restaurant Management</h1>
          <p className="page-subtitle">Manage restaurants, branches, and monitor their performance</p>
        </div>
        <div className="header-actions">
         <Link to="/dashboard/add-restaurants" style={{textDecoration:"none"}}><button className="btn-primary prominent-btn" onClick={() => setShowAddModal(true)}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Restaurant
          </button></Link> 
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search restaurants, categories, or owners..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="filter-container">
          <select 
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
          </select>
          
          <div className="results-info">
            Showing {currentItems.length} of {filteredRestaurants.length} restaurants
          </div>
        </div>
      </div>

      {/* Restaurant List */}
      <div className="restaurants-table-section">
        <div className="modern-table-container">
          <div className="modern-table-header">
            <h2 className="table-title">Restaurants</h2>
            <br></br>
          </div>
          
          <div className="modern-table-wrapper">
            {currentItems.length === 0 ? (
              <div className="no-results">
                <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <h3>No restaurants found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <>
                <div className="professional-table-container">
                  <table className="professional-table">
                    <thead>
                      <tr>
                        <th>Restaurant</th>
                        <th>Category</th>
                        <th>Plan</th>
                        <th>Status</th>
                        <th>Rating</th>
                        <th>Branches</th>
                        <th>Total Coupons</th>
                        <th>Joined Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                            Loading restaurants...
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                            {error}
                          </td>
                        </tr>
                      ) : currentItems.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                            No restaurants found
                          </td>
                        </tr>
                      ) : (
                        currentItems.map((restaurant) => (
                        <tr key={restaurant.id}>
                          <td>
                            <div className="user-info">
                              <div className="restaurant-avatar">
                                <img
                                  src={restaurant.image || "/placeholder.svg"}
                                  alt={restaurant.name}
                                  onError={(e) => {
                                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNMTkgMjFWNWEyIDIgMCAwMC0yLTJIN2EyIDIgMCAwMC0yIDJ2MTZtMTQgMGgyTS0yIDBoNW05LTExaDFtLTEgNGgxbTQtNGgxbS0xIDRoMW0tNSAxMHYtNWExIDEgMCAwMTEtMWgyYTEgMSAwIDAxMSAxdjVtLTQgMGg0Ii8+PC9zdmc+"
                                  }}
                                />
                              </div>
                              <div>
                                <div className="user-name">{restaurant.name}</div>
                                <div className="user-email">{restaurant.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge info">{restaurant.category}</span>
                          </td>
                          <td>
                            <span className={`badge ${restaurant.plan === 'GROWTH' ? 'success' : 'info'}`}>
                              {restaurant.plan}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${restaurant.status === 'active' ? 'success' : 'warning'}`}>
                              {restaurant.status.charAt(0).toUpperCase() + restaurant.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <div className="rating-display">
                              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                              {restaurant.rating}
                            </div>
                          </td>
                          <td>{restaurant.branches.length}</td>
                          <td>{restaurant.totalCoupons}</td>
                          <td>{new Date(restaurant.joinedDate).toLocaleDateString()}</td>
                          <td>
                            <div className="table-actions">
                              <button 
                                className="btn btn-sm btn-secondary"
                                onClick={() => handleViewRestaurant(restaurant)}
                                title="View Details"
                              >
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button 
                                className="btn btn-sm btn-secondary"
                                onClick={() => handleViewBranches(restaurant)}
                                title="View Branches"
                              >
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </button>
                              {restaurant.status === "pending" ? (
                                <>
                                  <button 
                                    className="btn btn-sm btn-success"
                                    onClick={() => handleApprove(restaurant.id)}
                                    title="Approve Restaurant"
                                  >
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleReject(restaurant.id)}
                                    title="Reject Restaurant"
                                  >
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button 
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDeleteRestaurant(restaurant.id)}
                                    title="Delete Restaurant"
                                  >
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination-container">
                    <div className="pagination">
                      <button 
                        className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </button>
                      
                      <div className="page-numbers">
                        {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            className={`page-number ${currentPage === page ? 'active' : ''}`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      
                      <button 
                        className={`page-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* View Restaurant Modal */}
      {showViewModal && selectedRestaurant && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Restaurant Details</h2>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="restaurant-details">
                <div className="restaurant-header">
                  <div className="restaurant-logo-large">
                    <img 
                      src={selectedRestaurant.image || "/placeholder.svg"} 
                      alt={selectedRestaurant.name}
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNMTkgMjFWNWEyIDIgMCAwMC0yLTJIN2EyIDIgMCAwMC0yIDJ2MTZtMTQgMGgyTS0yIDBoNW05LTExaDFtLTEgNGgxbTQtNGgxbS0xIDRoMW0tNSAxMHYtNWExIDEgMCAwMTEtMWgyYTEgMSAwIDAxMSAxdjVtLTQgMGg0Ii8+PC9zdmc+"
                      }}
                    />
                  </div>
                  <div className="restaurant-info-detailed">
                    <h3>{selectedRestaurant.name}</h3>
                    <div className="restaurant-meta-detailed">
                      <span className="category-badge">{selectedRestaurant.category}</span>
                      <span className={`status-badge ${selectedRestaurant.status}`}>
                        {selectedRestaurant.status.charAt(0).toUpperCase() + selectedRestaurant.status.slice(1)}
                      </span>
                      <span className={`badge ${selectedRestaurant.plan === 'GROWTH' ? 'success' : 'info'}`}>
                        {selectedRestaurant.plan} Plan
                      </span>
                    </div>
                  </div>
                </div>

                <div className="restaurant-stats-detailed">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <div className="stat-info">
                      <span className="stat-number">{selectedRestaurant.rating}</span>
                      <span className="stat-text">Rating</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    <div className="stat-info">
                      <span className="stat-number">{selectedRestaurant.branches.length}</span>
                      <span className="stat-text">Branches</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div className="stat-info">
                      <span className="stat-number">{selectedRestaurant.totalCoupons}</span>
                      <span className="stat-text">Total Coupons</span>
                    </div>
                  </div>
                </div>

                <div className="restaurant-description-detailed">
                  <h4>About</h4>
                  <p>{selectedRestaurant.description}</p>
                </div>

                <div className="restaurant-contact-detailed">
                  <h4>Contact Information</h4>
                  <div className="contact-grid">
                    <div className="contact-detail">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{selectedRestaurant.email}</span>
                    </div>
                    <div className="contact-detail">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{selectedRestaurant.phone}</span>
                    </div>
                    <div className="contact-detail">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0-9C7.163 3 3 7.163 3 12s4.163 9 9 9" />
                      </svg>
                      <span>{selectedRestaurant.website}</span>
                    </div>
                    <div className="contact-detail">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Joined {new Date(selectedRestaurant.joinedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowViewModal(false)}>
                Close
              </button>
              <button 
                className="btn-primary"
                onClick={() => handleViewCertificate(selectedRestaurant.certificateUrl)}
              >
                 <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m5 7a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 
           2 0 012-2h7l5 5v9z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 18l-1.5 2.5L12 18l-1.5 2.5L9 18"
      />
    </svg>
                View Halal Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Branches Location Modal */}
      {showBranchesModal && selectedRestaurant && (
        <div className="modal-overlay" onClick={() => setShowBranchesModal(false)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {selectedRestaurant.name} - Branch Locations
              </h2>
              <button className="modal-close" onClick={() => setShowBranchesModal(false)}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="branches-content">
                <div className="branches-header">
                  <div className="branches-stats">
                    <div className="stat-item">
                      <span className="stat-number">{selectedRestaurant.branches.length}</span>
                      <span className="stat-label">Total Branches</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{selectedRestaurant.branches.filter(b => b.status === 'active').length}</span>
                      <span className="stat-label">Active</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{selectedRestaurant.branches.filter(b => b.status === 'pending').length}</span>
                      <span className="stat-label">Pending</span>
                    </div>
                  </div>
                </div>

                <div className="branches-list">
                  <h4>Branch Details</h4>
                  <div className="branches-grid">
                    {selectedRestaurant.branches.map((branch) => (
                      <div key={branch.id} className="branch-card">
                        <div className="branch-header">
                          <div className="branch-info">
                            <h5 className="branch-name">{branch.name}</h5>
                            <p className="branch-address">{branch.address}</p>
                          </div>
                          <span className={`badge ${branch.status === 'active' ? 'success' : 'warning'}`}>
                            {branch.status}
                          </span>
                        </div>
                        <div className="branch-actions">
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`, '_blank')}
                            title="View on Google Maps"
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            View Location
                          </button>
                          <button 
                            className="btn btn-sm btn-secondary"
                            onClick={() => navigator.clipboard.writeText(branch.address)}
                            title="Copy Address"
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy Address
                          </button>
                        </div>
                        <div className="branch-map-container">
                          <div className="map-placeholder">
                            <iframe
                              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgkk&q=${encodeURIComponent(branch.address)}`}
                              width="100%"
                              height="200"
                              style={{ border: 0, borderRadius: '8px' }}
                              allowFullScreen=""
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            ></iframe>
                            <div className="map-fallback" style={{ display: 'none' }}>
                              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <p>Map unavailable</p>
                              <button 
                                className="btn btn-sm btn-primary"
                                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`, '_blank')}
                              >
                                Open in Google Maps
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Restaurants