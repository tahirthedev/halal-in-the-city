import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiService from '../services/api'
import '../styles/dashboard.css'


function AddDeals() {
  const navigate = useNavigate()
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeEmail, setUpgradeEmail] = useState('')
  const [upgradingPlan, setUpgradingPlan] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [form, setForm] = useState({
    restaurantId: '',
    title: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderAmount: '',
    maxUses: '5',
    perUserLimit: '1',
    terms: '',
    startsAt: '',
    expiresAt: '',
  })

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    try {
      const response = await apiService.getMyRestaurants()
      if (response.success && response.data) {
        // Show all active restaurants (merchants can create deals even while pending approval)
        const allRestaurants = response.data.restaurants || []
        const activeRestaurants = allRestaurants.filter(r => r.isActive)
        setRestaurants(activeRestaurants)
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err)
      setError('Failed to load restaurants')
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  function removeImage() {
    setImageFile(null)
    setImagePreview(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const dealData = {
        restaurantId: form.restaurantId,
        title: form.title,
        description: form.description,
        discountType: form.discountType,
        discountValue: parseFloat(form.discountValue),
        minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : 0,
        maxUses: parseInt(form.maxUses) || 5,
        perUserLimit: parseInt(form.perUserLimit) || 1,
        terms: form.terms || null,
        startsAt: form.startsAt || new Date().toISOString(),
        expiresAt: form.expiresAt,
      }

      // If image is selected, convert to base64 and add to dealData
      if (imageFile) {
        dealData.images = [imagePreview] // Send as array since backend expects String[]
      }

      const response = await apiService.createDeal(dealData)
      
      if (response.success) {
        alert('Deal created successfully! It is now live.')
        navigate('/dashboard/deals')
      } else {
        setError(response.error?.message || response.message || 'Failed to create deal')
      }
    } catch (err) {
      console.error('Error creating deal:', err)
      // Show the actual error message from backend (includes subscription limits)
      const errorMessage = err.message || 'Failed to create deal'
      setError(errorMessage)
      
      // If it's a subscription limit error, show upgrade modal
      if (errorMessage.includes('subscription') || errorMessage.includes('maximum') || errorMessage.includes('STARTER')) {
        setShowUpgradeModal(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (e) => {
    e.preventDefault()
    
    if (!upgradeEmail || !upgradeEmail.includes('@')) {
      alert('Please enter a valid email address.')
      return
    }

    setUpgradingPlan(true)
    
    try {
      const response = await apiService.createUpgradeCheckout(upgradeEmail, 'GROWTH')
      
      if (response.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.url
      } else {
        alert('Failed to initiate upgrade. Please try again.')
      }
    } catch (err) {
      console.error('Error creating checkout:', err)
      alert('Failed to initiate upgrade. Please try again.')
    } finally {
      setUpgradingPlan(false)
    }
  }

  return (
    <div className="white-backdrop">
      <div className="page-header-2">
        <div>
          <h2 className="page-title">Add New Deal</h2>
          <p className="page-subtitle">Create a new deal for your restaurant and select where it will be live.</p>
        </div>
      </div>

      <div className="form-wrapper" style={{ maxWidth: '100%', margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 6px 24px rgba(198,154,26,0.08)', padding: 32 }}>
        {error && (
          <div style={{ padding: '12px', background: '#fee', color: '#c00', borderRadius: '8px', marginBottom: '16px' }}>
            {error}
          </div>
        )}
        
        {restaurants.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#666' }}>
            <p>You don't have any restaurants yet.</p>
            <p>Please add a restaurant before creating deals.</p>
          </div>
        ) : (
          <form className="professional-form" onSubmit={handleSubmit}>
            <div className="form-sections" style={{ flexDirection: 'column', gap: 24 }}>
              <div className="form-section">
                <h3 className="section-title">Deal Information</h3>
                <div className="form-grid" style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                  <div className="form-group">
                    <label className="form-label">Select Restaurant *</label>
                    <select name="restaurantId" className="form-select" value={form.restaurantId} onChange={handleChange} required>
                      <option value="">Select restaurant</option>
                      {restaurants.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Deal Title *</label>
                    <input type="text" name="title" className="form-input" placeholder="e.g. 20% Off All Items" value={form.title} onChange={handleChange} required />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Description *</label>
                    <textarea name="description" className="form-textarea" placeholder="Describe the deal in detail" rows={3} value={form.description} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Discount Type *</label>
                    <select name="discountType" className="form-select" value={form.discountType} onChange={handleChange} required>
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Fixed Amount ($)</option>
                      <option value="BOGO">Buy One Get One</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Discount Value *</label>
                    <input type="number" name="discountValue" className="form-input" placeholder={form.discountType === 'PERCENTAGE' ? 'e.g. 20' : 'e.g. 10.00'} value={form.discountValue} onChange={handleChange} required min={0} step="0.01" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Minimum Order Amount</label>
                    <input type="number" name="minOrderAmount" className="form-input" placeholder="e.g. 25.00" value={form.minOrderAmount} onChange={handleChange} min={0} step="0.01" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Max Users (1-5) *</label>
                    <input type="number" name="maxUses" className="form-input" placeholder="5" value={form.maxUses} onChange={handleChange} required min={1} max={5} />
                    <small style={{ color: '#666', fontSize: '12px' }}>Maximum number of unique users who can claim this deal</small>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Terms & Conditions</label>
                    <textarea name="terms" className="form-textarea" placeholder="Optional terms and conditions" rows={2} value={form.terms} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">Deal Image</h3>
                <div className="form-group">
                  <label className="form-label">Upload Deal Image</label>
                  <div style={{ marginTop: '12px' }}>
                    {!imagePreview ? (
                      <div 
                        style={{
                          border: '2px dashed #d1d5db',
                          borderRadius: '12px',
                          padding: '32px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          background: '#f9fafb',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = '#c69a1a'
                          e.currentTarget.style.background = '#fffbf0'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor = '#d1d5db'
                          e.currentTarget.style.background = '#f9fafb'
                        }}
                        onClick={() => document.getElementById('dealImageInput').click()}
                      >
                        <svg 
                          width="48" 
                          height="48" 
                          fill="none" 
                          stroke="#c69a1a" 
                          viewBox="0 0 24 24"
                          style={{ margin: '0 auto 12px' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                          Click to upload deal image
                        </p>
                        <p style={{ fontSize: '12px', color: '#6b7280' }}>
                          PNG, JPG, WEBP up to 5MB
                        </p>
                      </div>
                    ) : (
                      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '2px solid #c69a1a' }}>
                        <img 
                          src={imagePreview} 
                          alt="Deal preview" 
                          style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', display: 'block' }}
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    <input
                      id="dealImageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                  <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '8px' }}>
                    Recommended: 800x600px or 4:3 ratio for best display
                  </small>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">Validity Period</h3>
                <div className="form-grid" style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input type="datetime-local" name="startsAt" className="form-input" value={form.startsAt} onChange={handleChange} />
                    <small style={{ color: '#666', fontSize: '12px' }}>Leave empty to start immediately</small>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Expiry Date *</label>
                    <input type="datetime-local" name="expiresAt" className="form-input" value={form.expiresAt} onChange={handleChange} required />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-actions" style={{ marginTop: 32, display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard/deals')} disabled={loading}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {loading ? 'Creating...' : 'Create Deal'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Upgrade Plan Modal */}
      {showUpgradeModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowUpgradeModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div 
                style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#B8860B',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <svg width="32" height="32" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#1a1a1a' }}>
                Upgrade to Growth Plan
              </h3>
              <p style={{ color: '#666', fontSize: '14px' }}>
                You've reached your plan limit. Upgrade to create unlimited deals!
              </p>
            </div>

            <div 
              style={{
                backgroundColor: '#f9f9f9',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '24px',
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Current Plan</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>STARTER - $49/month</div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>1 active deal limit</div>
              </div>
              
              <div 
                style={{
                  height: '1px',
                  backgroundColor: '#ddd',
                  margin: '16px 0',
                }}
              />
              
              <div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Upgrade To</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#B8860B' }}>GROWTH - $99/month</div>
                <div style={{ fontSize: '14px', color: '#333', marginTop: '8px', fontWeight: '500' }}>
                  ✓ Unlimited active deals<br />
                  ✓ Advanced analytics<br />
                  ✓ Priority support<br />
                  ✓ Featured placement
                </div>
              </div>
            </div>

            {error && (
              <div 
                style={{
                  padding: '12px',
                  backgroundColor: '#fee',
                  color: '#c00',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '14px',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleUpgrade}>
              <div style={{ marginBottom: '20px' }}>
                <label 
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px',
                    color: '#333',
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={upgradeEmail}
                  onChange={(e) => setUpgradeEmail(e.target.value)}
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  We'll send your receipt and subscription details here
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(false)}
                  disabled={upgradingPlan}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    backgroundColor: 'white',
                    color: '#666',
                  }}
                >
                  Maybe Later
                </button>
                <button
                  type="submit"
                  disabled={upgradingPlan}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: upgradingPlan ? 'not-allowed' : 'pointer',
                    backgroundColor: '#B8860B',
                    color: 'white',
                    opacity: upgradingPlan ? 0.7 : 1,
                  }}
                >
                  {upgradingPlan ? 'Processing...' : 'Upgrade Now - $99/mo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddDeals