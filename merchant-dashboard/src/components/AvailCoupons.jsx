import React, { useState, useEffect } from 'react'
import apiService from '../services/api'
import '../styles/deals.css'

function AvailCoupons() {
  const [activeTab, setActiveTab] = useState('my-coupons')
  const [redemptions, setRedemptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [verifyingCode, setVerifyingCode] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [orderAmount, setOrderAmount] = useState('')

  useEffect(() => {
    fetchRedemptions()
  }, [])

  const fetchRedemptions = async () => {
    try {
      setLoading(true)
      const response = await apiService.getMyRedemptions()
      
      if (response.success && response.data.redemptions) {
        setRedemptions(response.data.redemptions)
      }
    } catch (err) {
      console.error('Error fetching redemptions:', err)
      setError('Failed to load coupons')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    
    if (!verificationCode || verificationCode.length !== 6) {
      alert('Please enter a valid 6-digit code')
      return
    }

    if (!orderAmount || parseFloat(orderAmount) <= 0) {
      alert('Please enter a valid order amount')
      return
    }

    try {
      setVerifyingCode(true)
      
      // Call backend API to verify code
      const response = await apiService.verifyCode(verificationCode, parseFloat(orderAmount))
      
      if (response.success && response.data.redemption) {
        setSelectedDeal(response.data.redemption)
        setVerificationCode('')
        setOrderAmount('')
        alert(`Deal redeemed successfully! Customer saved $${response.data.savings}`)
        
        // Refresh redemptions list
        fetchRedemptions()
      } else {
        alert('Invalid verification code')
      }
    } catch (err) {
      console.error('Error verifying code:', err)
      alert(err.message || 'Failed to verify code. Please check the code and try again.')
    } finally {
      setVerifyingCode(false)
    }
  }

  const handleCodeChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
    setVerificationCode(val)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDiscountText = (type, value) => {
    if (type === 'PERCENTAGE') return `${value}% OFF`
    if (type === 'FIXED') return `$${value} OFF`
    if (type === 'BOGO') return 'BUY 1 GET 1'
    return ''
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning'
      case 'COMPLETED':
        return 'success'
      case 'CANCELLED':
      case 'EXPIRED':
        return 'danger'
      default:
        return 'info'
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p>Loading your coupons...</p>
      </div>
    )
  }

  return (
    <div className="deals-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Available Coupons</h1>
          <p className="page-subtitle">View and verify your claimed deal coupons</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Coupons</span>
            <div className="stat-icon primary">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{redemptions.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Active Coupons</span>
            <div className="stat-icon success">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{redemptions.filter(r => r.status === 'PENDING').length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Used Coupons</span>
            <div className="stat-icon info">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{redemptions.filter(r => r.status === 'COMPLETED').length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Savings</span>
            <div className="stat-icon warning">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="stat-value">${redemptions.reduce((sum, r) => sum + (r.discountAmount || 0), 0).toFixed(2)}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="deals-table-section">
        <div className="modern-table-container">
          <div className="modern-table-header">
            <h2 className="table-title">My Coupons</h2>
            <div className="users-tabs">
              <button
                className={`users-tab ${activeTab === 'my-coupons' ? 'active' : ''}`}
                onClick={() => setActiveTab('my-coupons')}
              >
                My Coupons
              </button>
              <button
                className={`users-tab ${activeTab === 'verify' ? 'active' : ''}`}
                onClick={() => setActiveTab('verify')}
              >
                Verify Code
              </button>
            </div>
          </div>

          {activeTab === 'my-coupons' ? (
            <div className="modern-table-wrapper">
              {error && (
                <div style={{ padding: '12px', background: '#fee', color: '#c00', borderRadius: '8px', margin: '16px' }}>
                  {error}
                </div>
              )}

              {redemptions.length === 0 ? (
                <div style={{ padding: '48px', textAlign: 'center', color: '#666' }}>
                  <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ margin: '0 auto 16px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <p style={{ fontSize: '18px', marginBottom: '8px' }}>No coupons yet</p>
                  <p>Your claimed deals will appear here</p>
                </div>
              ) : (
                <div className="deals-grid">
                  {redemptions.map((redemption) => (
                    <div key={redemption.id} className="deal-card">
                      <div className="deal-image-container" style={{ background: 'linear-gradient(135deg, #C69A1A 0%, #E8C547 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                        <div style={{ textAlign: 'center', color: 'white' }}>
                          <h2 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '8px' }}>{redemption.verificationCode}</h2>
                          <p style={{ fontSize: '14px', opacity: 0.9 }}>Verification Code</p>
                        </div>
                        <span className={`deal-badge badge ${getStatusBadge(redemption.status)}`}>
                          {redemption.status}
                        </span>
                      </div>
                      <div className="deal-content">
                        <div className="deal-restaurant">{redemption.deal?.title || 'Deal'}</div>
                        <h3 className="deal-title">{redemption.deal?.description || 'No description'}</h3>
                        <p className="deal-description">
                          Discount: {getDiscountText(redemption.deal?.discountType, redemption.deal?.discountValue)}
                        </p>
                        <div className="deal-footer">
                          <div className="deal-stats">
                            <span className="deal-stat">
                              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Claimed: {formatDate(redemption.redeemedAt || redemption.createdAt)}
                            </span>
                          </div>
                          {redemption.deal?.expiresAt && (
                            <div className="deal-stats">
                              <span className="deal-stat">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Expires: {formatDate(redemption.deal.expiresAt)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ marginBottom: 32, textAlign: 'center' }}>
                <svg width="80" height="80" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ margin: '0 auto 16px', color: '#C69A1A' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Verify Coupon Code</h2>
                <p style={{ color: '#666' }}>Enter the 6-digit verification code to view deal details</p>
              </div>

              <form onSubmit={handleVerifyCode} style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label htmlFor="code" style={{ display: 'block', fontWeight: 600, fontSize: '16px', marginBottom: '12px', textAlign: 'center' }}>
                    Enter 6-Digit Code
                  </label>
                  <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={verificationCode}
                    onChange={handleCodeChange}
                    placeholder="------"
                    style={{
                      fontSize: '36px',
                      textAlign: 'center',
                      letterSpacing: '16px',
                      padding: '16px 0',
                      borderRadius: '12px',
                      border: '2px solid #C69A1A',
                      width: '100%',
                      background: '#F8F8F8',
                      fontWeight: 'bold'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="orderAmount" style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
                    Order Amount ($)
                  </label>
                  <input
                    id="orderAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={orderAmount}
                    onChange={(e) => setOrderAmount(e.target.value)}
                    placeholder="0.00"
                    style={{
                      fontSize: '18px',
                      textAlign: 'center',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      width: '100%',
                      background: '#fff'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={verifyingCode || verificationCode.length !== 6 || !orderAmount || parseFloat(orderAmount) <= 0}
                  style={{
                    width: '100%',
                    padding: '14px 0',
                    fontSize: '18px',
                    borderRadius: '12px',
                    opacity: (verificationCode.length === 6 && orderAmount && parseFloat(orderAmount) > 0) ? 1 : 0.5
                  }}
                >
                  {verifyingCode ? 'Verifying...' : 'Verify Code'}
                </button>
              </form>

              {selectedDeal && (
                <div style={{ marginTop: '48px', width: '100%', maxWidth: '500px', background: '#fff', border: '2px solid #C69A1A', borderRadius: '16px', padding: '32px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#C69A1A' }}>
                    ✓ Valid Coupon
                  </h3>
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                      {selectedDeal.deal?.title}
                    </p>
                    <p style={{ color: '#666', marginBottom: '12px' }}>
                      {selectedDeal.deal?.description}
                    </p>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#C69A1A' }}>
                      {getDiscountText(selectedDeal.deal?.discountType, selectedDeal.deal?.discountValue)}
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid #eee', paddingTop: '16px', fontSize: '14px', color: '#666' }}>
                    <p>Status: <strong>{selectedDeal.status}</strong></p>
                    <p>Claimed: {formatDate(selectedDeal.redeemedAt || selectedDeal.createdAt)}</p>
                    {selectedDeal.deal?.expiresAt && (
                      <p>Expires: {formatDate(selectedDeal.deal.expiresAt)}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AvailCoupons