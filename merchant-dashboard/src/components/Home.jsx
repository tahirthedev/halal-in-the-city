import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiService from '../services/api'
import res1 from '../assets/images/res1.jpg'
import res2 from '../assets/images/res2.jpg'
import res3 from '../assets/images/res3.jpg'
import res4 from '../assets/images/res4.jpg'
import res5 from '../assets/images/res5.jpg'
import res6 from '../assets/images/res6.jpg'
import res7 from '../assets/images/res7.png'
import res8 from '../assets/images/res8.jpg'

// Default images array for restaurants
const defaultImages = [res1, res2, res3, res4, res5, res6, res7, res8]

function Home() {
  const [restaurants, setRestaurants] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [restaurantsRes, dealsRes] = await Promise.all([
        apiService.getMyRestaurants(),
        apiService.getMyDeals()
      ])

      setRestaurants(restaurantsRes.data?.restaurants || [])
      setDeals(dealsRes.data?.deals || [])
      setError(null)
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const getDiscountPercentage = (deal) => {
    if (deal.discountType === 'PERCENTAGE') {
      return `${deal.discountValue}% OFF`
    } else if (deal.discountType === 'FIXED_AMOUNT') {
      return `$${deal.discountValue} OFF`
    }
    return ''
  }

  const getDealStatus = (deal) => {
    const now = new Date()
    const expiresAt = new Date(deal.expiresAt)
    if (!deal.isActive) return 'inactive'
    if (expiresAt < now) return 'expired'
    return 'success'
  }

  const getDealStatusText = (deal) => {
    const now = new Date()
    const expiresAt = new Date(deal.expiresAt)
    if (!deal.isActive) return 'Inactive'
    if (expiresAt < now) return 'Expired'
    return 'Active'
  }
  return (
    <div>
      {loading && <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>}
      {error && <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>{error}</div>}
      
      <div className='white-backdrop'>
        <div className="page-header-2">
          <div>
            <h2 className="page-title">Welcome Home</h2>
            <p className="page-subtitle">Track your deals performance and customer engagement in real-time.</p>
          </div>
          <div className="header-actions">
            <Link to="add-restaurants" style={{ textDecoration: "none" }}><button className="btn-primary">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Deal
            </button></Link>
          </div>
        </div>

        {/* <div className='types-restaurants-main'>
          <div className='types-restaurants-main'>
            <h2 className="section-title">Explore Cuisines</h2>
            <div className="restaurant-types-grid">
              <div className="type-card">
                <div className="type-icon"></div>
                <h3>Italian</h3>
              </div>
              <div className="type-card">
                <div className="type-icon"></div>
                <h3>Chinese</h3>
              </div>
              <div className="type-card">
                <div className="type-icon"></div>
                <h3>Japanese</h3>
              </div>
              <div className="type-card">
                <div className="type-icon"></div>
                <h3>Thai</h3>
              </div>
              <div className="type-card">
                <div className="type-icon"></div>
                <h3>American</h3>
              </div>
              <div className="type-card">
                <div className="type-icon"></div>
                <h3>Mexican</h3>
              </div>
            </div>
          </div>
        </div> */}

        <div className="my-restaurants-home-main">
          <h2 className="section-title">My Restaurants</h2>
          {restaurants.length === 0 && !loading ? (
            <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              No restaurants yet. <Link to="add-restaurants">Add your first restaurant</Link>
            </p>
          ) : (
            <div className="my-restaurants-row">
              {restaurants.map((restaurant, index) => (
                <Link key={restaurant.id} to={`/dashboard/restaurantDetailPage/${restaurant.id}`}>
                  <div className="deal-card-2">
                    <div className="deal-image-container">
                      <img 
                        src={restaurant.image || defaultImages[index % defaultImages.length]} 
                        className="deal-image" 
                        alt={restaurant.name}
                      />
                      <span className={`deal-badge ${restaurant.approvalStatus === 'APPROVED' ? 'success' : 'warning'}`}>
                        {restaurant.approvalStatus === 'APPROVED' ? 'Active' : restaurant.approvalStatus}
                      </span>
                    </div>
                    <div className="deal-content">
                      <h3 className="deal-title">{restaurant.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>



        <div className="my-restaurants-home-main">
          <h2 className="section-title">My Deals</h2>
          {deals.length === 0 && !loading ? (
            <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              No deals yet. <Link to="add-deals">Create your first deal</Link>
            </p>
          ) : (
            <div className="my-restaurants-row">
              {deals.map((deal, index) => (
                <div key={deal.id} className="deal-card">
                  <div className="deal-image-container">
                    <img 
                      src={deal.restaurant?.image || defaultImages[index % defaultImages.length]} 
                      className="deal-image" 
                      alt={deal.title}
                    />
                    <span className={`deal-badge ${getDealStatus(deal)}`}>
                      {getDealStatusText(deal)}
                    </span>
                    <div className="deal-discount">{getDiscountPercentage(deal)}</div>
                  </div>
                  <div className="deal-content">
                    <div className="deal-restaurant">{deal.restaurant?.name || 'Restaurant'}</div>
                    <h3 className="deal-title">{deal.title}</h3>
                    <p className="deal-description">{deal.description}</p>
                    <div className="deal-footer">
                      <div className="deal-pricing">
                        {deal.discountType === 'FIXED_AMOUNT' && (
                          <>
                            <span className="deal-price">${deal.discountValue} OFF</span>
                            {deal.minOrderAmount && (
                              <span className="deal-original-price">Min: ${deal.minOrderAmount}</span>
                            )}
                          </>
                        )}
                        {deal.discountType === 'PERCENTAGE' && (
                          <>
                            <span className="deal-price">{deal.discountValue}% OFF</span>
                            {deal.minOrderAmount && (
                              <span className="deal-original-price">Min: ${deal.minOrderAmount}</span>
                            )}
                          </>
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
                          {deal.usedCount || 0} times availed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home