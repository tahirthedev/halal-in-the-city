import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import apiService from '../services/api'
import img1 from '../assets/images/res1.jpg'
import img2 from '../assets/images/res2.jpg'
import img3 from '../assets/images/res3.jpg'
import img4 from '../assets/images/res4.jpg'
import img5 from '../assets/images/res5.jpg'
import img6 from '../assets/images/res6.jpg'
import img7 from '../assets/images/res7.png'

import '../styles/restaurant-detail.css'

function RestaurantDetailPage() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [saving, setSaving] = useState(false)

  // Default images array
  const defaultImages = [img1, img2, img3, img4, img5, img6, img7]

  useEffect(() => {
    fetchRestaurantData()
  }, [id])

  const fetchRestaurantData = async () => {
    try {
      setLoading(true)
      
      // Fetch restaurant details and its deals
      const [restaurantRes, dealsRes] = await Promise.all([
        apiService.getRestaurantById(id),
        apiService.getRestaurantDeals(id)
      ])

      if (restaurantRes.success && restaurantRes.data) {
        setRestaurant(restaurantRes.data.restaurant)
      }

      if (dealsRes.success && dealsRes.data) {
        setDeals(dealsRes.data.deals || [])
      }

      setError(null)
    } catch (err) {
      console.error('Failed to fetch restaurant:', err)
      setError('Failed to load restaurant details')
    } finally {
      setLoading(false)
    }
  }

  const handleLogoChange = (e) => {
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
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveLogo = async () => {
    if (!logoPreview) return

    setSaving(true)
    try {
      const updateData = {
        logo: logoPreview
      }
      
      const response = await apiService.updateRestaurant(id, updateData)
      
      if (response.success) {
        alert('Restaurant logo updated successfully!')
        setRestaurant(prev => ({ ...prev, logo: logoPreview }))
        setEditMode(false)
        setLogoFile(null)
        setLogoPreview(null)
      } else {
        alert('Failed to update logo')
      }
    } catch (err) {
      console.error('Error updating logo:', err)
      alert('Failed to update logo: ' + (err.message || 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditMode(false)
    setLogoFile(null)
    setLogoPreview(null)
  }

  if (loading) {
    return (
      <div className="rd-page-wrapper">
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Loading restaurant details...</p>
        </div>
      </div>
    )
  }

  if (error || !restaurant) {
    return (
      <div className="rd-page-wrapper">
        <div className="rd-header">
          <div className="rd-header-content">
            <h1 className="rd-header-title">Restaurant Not Found</h1>
            <p className="rd-header-subtitle">{error || 'The restaurant you are looking for does not exist.'}</p>
          </div>
          <div className="rd-header-actions">
            <Link to="/dashboard/my-restaurants" className="rd-btn rd-btn-primary">
              Back to My Restaurants
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const activeDeals = deals.filter(d => d.isActive && new Date(d.expiresAt) > new Date()).length

  return (
    <div className="rd-page-wrapper">
      <div className="rd-header">
        <div className="rd-header-content">
          <h1 className="rd-header-title">{restaurant.name}</h1>
          <p className="rd-header-subtitle">Detailed overview of your restaurant's performance and presence</p>
        </div>
        <div className="rd-header-actions">
          <Link to="/dashboard/my-restaurants" className="rd-btn rd-btn-back">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>
          {!editMode && (
            <button onClick={() => setEditMode(true)} className="rd-btn rd-btn-secondary">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Logo
            </button>
          )}
          <Link to="/dashboard/addDeals" className="rd-btn rd-btn-primary">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Deal
          </Link>
        </div>
      </div>

      {/* Restaurant Overview Card */}
      <div className="rd-overview-card">
        <div className="rd-overview-left">
          <div className="rd-restaurant-image" style={{ position: 'relative' }}>
            <img 
              src={logoPreview || restaurant.logo || restaurant.image || defaultImages[0]} 
              alt={restaurant.name} 
            />
            {editMode && (
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
              onClick={() => document.getElementById('restaurantLogoInput').click()}
              >
                <svg width="48" height="48" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
                  {logoPreview ? 'Change Logo' : 'Upload New Logo'}
                </p>
              </div>
            )}
            <input
              id="restaurantLogoInput"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              style={{ display: 'none' }}
            />
          </div>
          {editMode && logoPreview && (
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                onClick={handleSaveLogo}
                disabled={saving}
                className="rd-btn rd-btn-success"
                style={{ flex: 1 }}
              >
                {saving ? 'Saving...' : 'Save Logo'}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="rd-btn rd-btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className="rd-overview-right">
          <div className="rd-restaurant-header">
            <h2 className="rd-restaurant-name">{restaurant.name}</h2>
            <div className="rd-restaurant-badges">
              <span className="rd-badge rd-badge-category">{restaurant.cuisineType || restaurant.cuisine || 'Restaurant'}</span>
              <span className={`rd-badge rd-badge-status rd-badge-${restaurant.approvalStatus === 'APPROVED' ? 'active' : 'pending'}`}>
                {restaurant.approvalStatus}
              </span>
            </div>
          </div>
          <p className="rd-restaurant-owner">Subscription: {restaurant.subscriptionTier}</p>
          <p className="rd-restaurant-description">{restaurant.description || 'No description available'}</p>
          
          <div className="rd-stats-row">
            <div className="rd-stat-item">
              <div className="rd-stat-icon rd-stat-icon-rating">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="rd-stat-content">
                <span className="rd-stat-value">{restaurant.averageRating || '0.0'}</span>
                <span className="rd-stat-label">Rating</span>
              </div>
            </div>
            <div className="rd-stat-item">
              <div className="rd-stat-icon rd-stat-icon-orders">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="rd-stat-content">
                <span className="rd-stat-value">{activeDeals}</span>
                <span className="rd-stat-label">Active Deals</span>
              </div>
            </div>
            <div className="rd-stat-item">
              <div className="rd-stat-icon rd-stat-icon-reviews">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="rd-stat-content">
                <span className="rd-stat-value">{restaurant.totalReviews || 0}</span>
                <span className="rd-stat-label">Reviews</span>
              </div>
            </div>
          </div>

          <div className="rd-contact-grid">
            <div className="rd-contact-item">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{restaurant.email}</span>
            </div>
            <div className="rd-contact-item">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{restaurant.phone}</span>
            </div>
            <div className="rd-contact-item">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0-9C7.163 3 3 7.163 3 12s4.163 9 9 9" />
              </svg>
              <span>{restaurant.website || 'N/A'}</span>
            </div>
            <div className="rd-contact-item">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Joined {new Date(restaurant.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="rd-section">
        <div className="rd-section-header">
          <h3 className="rd-section-title">Location</h3>
        </div>
        <div className="rd-branches-grid">
          <div className="rd-branch-card">
            <div className="rd-branch-header">
              <div className="rd-branch-info">
                <h4 className="rd-branch-name">{restaurant.address}</h4>
                <p className="rd-branch-address">{restaurant.city}, {restaurant.province || ''} {restaurant.postalCode}</p>
              </div>
              <span className={`rd-badge rd-badge-success`}>
                Active
              </span>
            </div>
            <div className="rd-branch-actions">
              <button
                className="rd-btn rd-btn-sm rd-btn-outline"
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`, '_blank')}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                View Location
              </button>
              <button
                className="rd-btn rd-btn-sm rd-btn-outline"
                onClick={() => navigator.clipboard.writeText(restaurant.address)}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Deals Section */}
      <div className="rd-section">
        <div className="rd-section-header">
          <h3 className="rd-section-title">Deals</h3>
          <div className="rd-section-badge">
            <span className="rd-badge-count rd-badge-success">{activeDeals} Active</span>
            <span className="rd-badge-count">Total {deals.length}</span>
          </div>
        </div>
        {deals.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            No deals yet. <Link to="/dashboard/addDeals">Create your first deal</Link>
          </p>
        ) : (
          <div className="rd-deals-grid">
            {deals.map((deal) => (
              <div key={deal.id} className="rd-deal-card">
                <div className="rd-deal-image-wrapper">
                  <img src={(deal.images && deal.images.length > 0) ? deal.images[0] : defaultImages[0]} alt={deal.title} className="rd-deal-image" />
                  <span className={`rd-deal-badge rd-badge-${deal.isActive && new Date(deal.expiresAt) > new Date() ? 'success' : 'warning'}`}>
                    {deal.isActive && new Date(deal.expiresAt) > new Date() ? 'Active' : 'Inactive'}
                  </span>
                  <div className="rd-deal-discount">
                    {deal.discountType === 'PERCENTAGE' ? `${deal.discountValue}% OFF` : `$${deal.discountValue} OFF`}
                  </div>
                </div>
                <div className="rd-deal-content">
                  <span className="rd-deal-restaurant">{restaurant.name}</span>
                  <h4 className="rd-deal-title">{deal.title}</h4>
                  <p className="rd-deal-locations">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {deal.usedCount || 0}/{deal.maxUses} claimed
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RestaurantDetailPage