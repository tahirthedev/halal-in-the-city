"use client"

import { useState, useEffect } from "react"
import "../styles/deals.css"
import "../styles/modal.css"
import img1 from "../assets/images/res5.jpg"
import img2 from "../assets/images/res6.jpg"
import img3 from "../assets/images/res7.png"
import img4 from "../assets/images/res8.jpg"
import apiService from "../services/api"


function Deals() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    try {
      setLoading(true)
      const response = await apiService.getAllDeals()
      
      if (response.success && response.data) {
        // Transform API data to match component structure
        const transformedDeals = response.data.map(deal => ({
          id: deal.id,
          title: deal.title,
          franchise: deal.restaurant?.address || 'N/A',
          restaurant: deal.restaurant?.name || 'Unknown Restaurant',
          description: deal.description,
          price: deal.discountType === 'FIXED' ? `$${deal.discountValue} off` :
                 deal.discountType === 'PERCENTAGE' ? `${deal.discountValue}% off` :
                 'BOGO',
          originalPrice: deal.originalPrice ? `$${deal.originalPrice}` : 'N/A',
          discount: deal.discountType === 'PERCENTAGE' ? `${deal.discountValue}%` :
                    deal.discountType === 'FIXED' ? `$${deal.discountValue}` : 'BOGO',
          status: deal.isActive && new Date(deal.expiresAt) > new Date() ? 'active' : 'expired',
          image: deal.image || img1, // Use default image if no image
          validUntil: new Date(deal.expiresAt).toLocaleDateString(),
          timesAvailed: deal.usedCount || 0,
          maxUses: deal.maxUses,
          code: deal.code,
          discountType: deal.discountType,
          restaurantLogo: deal.restaurant?.logo
        }))
        
        setDeals(transformedDeals)
      }
      setError(null)
    } catch (err) {
      console.error('Error fetching deals:', err)
      setError('Failed to load deals')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = (id) => {
    setDeals(prevDeals => 
      prevDeals.map(deal => 
        deal.id === id ? { ...deal, status: "active" } : deal
      )
    )
    console.log("Approved deal:", id)
  }

  const handleReject = (id) => {
    setDeals(prevDeals => 
      prevDeals.map(deal => 
        deal.id === id ? { ...deal, status: "rejected" } : deal
      )
    )
    console.log("Rejected deal:", id)
  }

  const handleViewDetails = (deal) => {
    setSelectedDeal(deal)
  }


  const filteredDeals = activeTab === "all" ? deals : deals.filter((d) => d.status === activeTab)

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return "success"
      case "pending":
        return "warning"
      case "rejected":
        return "danger"
      case "Expired":
        return "danger"
      default:
        return "info"
    }
  }

  return (
    <div className="deals-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Deals Management</h1>
          <p className="page-subtitle">Manage all deals and offers from restaurants</p>
        </div>
        {/* <div className="header-actions">
          <button className="btn-primary prominent-btn">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Deal
          </button>
        </div> */}
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Deals</span>
            <div className="stat-icon primary">
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
          <div className="stat-value">{deals.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Active Deals</span>
            <div className="stat-icon success">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{deals.filter((d) => d.status === "active").length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Pending Approval</span>
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
          <div className="stat-value">{deals.filter((d) => d.status === "pending").length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Availed</span>
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
          <div className="stat-value">{deals.reduce((sum, d) => sum + d.timesAvailed, 0)}</div>
        </div>
      </div>

      {/* Deals Section */}
      <div className="deals-table-section">
        <div className="modern-table-container">
          <div className="modern-table-header">
            <h2 className="table-title">All Deals</h2>
            <div className="users-tabs">
              <button className={`users-tab ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
                All Deals
              </button>
              <button className={`users-tab ${activeTab === "active" ? "active" : ""}`} onClick={() => setActiveTab("active")}>
                Active
              </button>
              <button
                className={`users-tab ${activeTab === "pending" ? "active" : ""}`}
                onClick={() => setActiveTab("pending")}
              >
                Pending
              </button>
              <button
                className={`users-tab ${activeTab === "expired" ? "active" : ""}`}
                onClick={() => setActiveTab("Expired")}
              >
                Expired
              </button>
            </div>
          </div>

          <div className="modern-table-wrapper">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                Loading deals...
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
                {error}
              </div>
            ) : filteredDeals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                No deals found
              </div>
            ) : (
              <div className="deals-grid">
                {filteredDeals.map((deal) => (
                <div key={deal.id} 
                className={"deal-card"}>
                  <div className="deal-image-container">
                    <img src={deal.image || "/placeholder.svg"} alt={deal.title} className="deal-image" />
                    <span className={`deal-badge badge ${getStatusBadge(deal.status)}`}>{deal.status}</span>
                    <div className="deal-discount">{deal.discount} OFF</div>
                  </div>
                  <div className="deal-content">
                    <div className="deal-restaurant">{deal.restaurant}</div>
                    <h3 className="deal-title">{deal.title}</h3>
                    <p className="deal-description">{deal.description}</p>
                    <div className="deal-footer">
                      <div className="deal-pricing">
                        <span className="deal-price">{deal.price}</span>
                        <span className="deal-original-price">{deal.originalPrice}</span>
                      </div>
                      <div className="deal-stats">
                        <span className="deal-stat">
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                          {deal.timesAvailed} availed
                        </span>
                      </div>
                    </div>
                    <div className="deal-actions">
                      {deal.status === "pending" ? (
                        <>
                          <button className="btn btn-sm btn-success" onClick={() => handleApprove(deal.id)}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Approve
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleReject(deal.id)}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Reject
                          </button>
                        </>
                      ) : deal.status === "active" ? (
                        <>
                          <button className="btn btn-sm btn-secondary" onClick={() => handleViewDetails(deal)}>
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
                            View
                          </button>
                          <span className="status-indicator active">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Approved
                          </span>
                        </>
                      ) : deal.status === "rejected" ? (
                        <>
                          <button className="btn btn-sm btn-secondary" onClick={() => handleViewDetails(deal)}>
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
                            View
                          </button>
                          <span className="status-indicator rejected">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Rejected
                          </span>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-sm btn-secondary" onClick={() => handleViewDetails(deal)}>
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
                            View
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deal Details Modal */}
      {selectedDeal && (
        <div className="modal-overlay" onClick={() => setSelectedDeal(null)}>
          <div className="modal-content deal-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Deal Details</h2>
              <button className="modal-close" onClick={() => setSelectedDeal(null)}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="deal-details">
                <img
                  src={selectedDeal.image || "/placeholder.svg"}
                  alt={selectedDeal.title}
                  className="deal-details-image"
                />
                <div className="deal-details-content">
                  <span className={`badge-inner ${getStatusBadge(selectedDeal.status)}`}>{selectedDeal.status}</span>
                  <h3>{selectedDeal.title}</h3>
                  <p className="deal-details-restaurant">{selectedDeal.restaurant} - (<span className="deal-details-restaurant">{selectedDeal.franchise}</span>)</p>
                                    

                  <p className="deal-details-description">{selectedDeal.description}</p>

                  <div className="deal-details-info">
                    <div className="info-item">
                      <span className="info-label">Price:</span>
                      <span className="info-value">
                        {selectedDeal.price}{" "}
                        <span style={{ textDecoration: "line-through", color: "var(--gray-400)" }}>
                          {selectedDeal.originalPrice}
                        </span>
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Discount:</span>
                      <span className="info-value">{selectedDeal.discount}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Valid Until:</span>
                      <span className="info-value">{new Date(selectedDeal.validUntil).toLocaleDateString()}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Times Availed:</span>
                      <span className="info-value">{selectedDeal.timesAvailed}</span>
                    </div>
                  </div>


                  {selectedDeal?.status === "Expired" ? "" :
                    (
                      <button className="btn btn-sm btn-danger" onClick={() => handleReject(deal.id)} style={{ padding: "20px" }}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        In Active
                      </button>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}



 


    </div>
  )
}

export default Deals
