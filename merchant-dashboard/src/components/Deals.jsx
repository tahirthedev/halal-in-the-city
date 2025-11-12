"use client"

import { useState, useEffect } from "react"
import "../styles/deals.css"
import "../styles/modal.css"
import { Link } from "react-router-dom"
import apiService from "../services/api"


function Deals() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingImage, setEditingImage] = useState(false)
  const [dealImageFile, setDealImageFile] = useState(null)
  const [dealImagePreview, setDealImagePreview] = useState(null)
  const [savingImage, setSavingImage] = useState(false)

  // Default images to use as fallback
  const defaultImages = [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe'
  ]

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    try {
      setLoading(true)
      const response = await apiService.getMyDeals()
      
      if (response.success && response.data.deals) {
        // Transform API data to component format
        const transformedDeals = response.data.deals.map((deal, index) => ({
          id: deal.id,
          title: deal.title,
          restaurant: deal.restaurant?.name || 'Unknown Restaurant',
          description: deal.description,
          discountType: deal.discountType,
          discountValue: deal.discountValue,
          discount: formatDiscount(deal.discountType, deal.discountValue),
          status: getStatus(deal),
          image: defaultImages[index % defaultImages.length],
          validUntil: deal.expiresAt,
          timesAvailed: deal.usedCount || 0,
          maxUses: deal.maxUses || 5,
          minOrderAmount: deal.minOrderAmount || 0,
          terms: deal.terms,
          isActive: deal.isActive,
          approvalStatus: deal.approvalStatus
        }))
        
        setDeals(transformedDeals)
      }
    } catch (err) {
      console.error('Error fetching deals:', err)
      setError('Failed to load deals')
    } finally {
      setLoading(false)
    }
  }

  const formatDiscount = (type, value) => {
    if (type === 'PERCENTAGE') return `${value}%`
    if (type === 'FIXED') return `$${value}`
    if (type === 'BOGO') return 'BOGO'
    return `${value}%`
  }

  const getStatus = (deal) => {
    if (!deal.isActive) return 'inactive'
    if (deal.approvalStatus === 'PENDING') return 'pending'
    if (deal.approvalStatus === 'REJECTED') return 'rejected'
    if (new Date(deal.expiresAt) < new Date()) return 'expired'
    if (deal.usedCount >= deal.maxUses) return 'expired'
    return 'active'
  }

  const handleApprove = async (id) => {
    try {
      await apiService.toggleDealStatus(id, true)
      fetchDeals() // Refresh deals
      setSelectedDeal(null) // Close modal
    } catch (err) {
      console.error('Error activating deal:', err)
      alert(err.message || 'Failed to activate deal')
    }
  }

  const handleReject = async (id) => {
    try {
      await apiService.toggleDealStatus(id, false)
      fetchDeals() // Refresh deals
      setSelectedDeal(null) // Close modal
    } catch (err) {
      console.error('Error deactivating deal:', err)
      alert(err.message || 'Failed to deactivate deal')
    }
  }

  const handleViewDetails = (deal) => {
    setSelectedDeal(deal)
    setEditingImage(false)
    setDealImageFile(null)
    setDealImagePreview(null)
  }

  const handleDealImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      setDealImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setDealImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveDealImage = async () => {
    if (!dealImagePreview || !selectedDeal) return

    setSavingImage(true)
    try {
      const updateData = {
        images: [dealImagePreview]
      }
      
      const response = await apiService.updateDeal(selectedDeal.id, updateData)
      
      if (response.success) {
        alert('Deal image updated successfully!')
        // Update the deal in the list
        setDeals(prevDeals => 
          prevDeals.map(d => 
            d.id === selectedDeal.id 
              ? { ...d, image: dealImagePreview }
              : d
          )
        )
        setSelectedDeal({ ...selectedDeal, image: dealImagePreview })
        setEditingImage(false)
        setDealImageFile(null)
        setDealImagePreview(null)
        fetchDeals() // Refresh the list
      } else {
        alert('Failed to update deal image')
      }
    } catch (err) {
      console.error('Error updating deal image:', err)
      alert('Failed to update deal image: ' + (err.message || 'Unknown error'))
    } finally {
      setSavingImage(false)
    }
  }

  const handleCancelImageEdit = () => {
    setEditingImage(false)
    setDealImageFile(null)
    setDealImagePreview(null)
  }


  const filteredDeals = activeTab === "all" ? deals : deals.filter((d) => d.status === activeTab)

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return "success"
      case "pending":
        return "warning"
      case "rejected":
      case "inactive":
        return "danger"
      case "expired":
        return "danger"
      default:
        return "info"
    }
  }

  if (loading) {
    return (
      <div className="deals-page">
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <p>Loading deals...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="deals-page">
        <div style={{ padding: '24px', textAlign: 'center', color: '#c00' }}>
          <p>{error}</p>
          <button onClick={fetchDeals} className="btn btn-primary" style={{ marginTop: '16px' }}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="deals-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Deals Management</h1>
          <p className="page-subtitle">Manage all deals and offers from restaurants</p>
        </div>
        <div className="header-actions">
         <Link to={"/dashboard/addDeals"} style={{textDecoration: "none"}}>
          <button className="btn-primary prominent-btn">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Deal
          </button></Link>
        </div>
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
                        <span className="deal-price">{deal.discount} Discount</span>
                        {deal.minOrderAmount > 0 && (
                          <span className="deal-original-price">Min ${deal.minOrderAmount}</span>
                        )}
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
                          {deal.timesAvailed}/{deal.maxUses} claimed
                        </span>
                      </div>
                    </div>
                    <div className="deal-actions">
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                <div style={{ position: 'relative' }}>
                  <img
                    src={dealImagePreview || selectedDeal.image || "/placeholder.svg"}
                    alt={selectedDeal.title}
                    className="deal-details-image"
                  />
                  {editingImage && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.7)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => document.getElementById('dealImageInput').click()}
                    >
                      <svg width="48" height="48" fill="none" stroke="white" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
                        {dealImagePreview ? 'Change Image' : 'Upload New Image'}
                      </p>
                    </div>
                  )}
                  <input
                    id="dealImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleDealImageChange}
                    style={{ display: 'none' }}
                  />
                  {!editingImage && (
                    <button
                      onClick={() => setEditingImage(true)}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }}
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Image
                    </button>
                  )}
                  {editingImage && dealImagePreview && (
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                      <button
                        onClick={handleSaveDealImage}
                        disabled={savingImage}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          background: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: savingImage ? 'not-allowed' : 'pointer',
                          opacity: savingImage ? 0.6 : 1,
                        }}
                      >
                        {savingImage ? 'Saving...' : 'Save Image'}
                      </button>
                      <button
                        onClick={handleCancelImageEdit}
                        disabled={savingImage}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          background: '#6c757d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: savingImage ? 'not-allowed' : 'pointer',
                          opacity: savingImage ? 0.6 : 1,
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
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


                  <div className="deal-modal-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    {selectedDeal.status === 'active' && (
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => handleReject(selectedDeal.id)} 
                        style={{ padding: "12px 24px", flex: 1 }}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Deactivate Deal
                      </button>
                    )}
                    
                    {(selectedDeal.status === 'inactive' || selectedDeal.status === 'pending') && (
                      <button 
                        className="btn btn-sm btn-success" 
                        onClick={() => handleApprove(selectedDeal.id)} 
                        style={{ padding: "12px 24px", flex: 1 }}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Activate Deal
                      </button>
                    )}
                    
                    {selectedDeal.status === 'expired' && (
                      <div style={{ padding: '12px', textAlign: 'center', color: '#6b7280', flex: 1 }}>
                        This deal has expired and cannot be modified
                      </div>
                    )}
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

export default Deals
