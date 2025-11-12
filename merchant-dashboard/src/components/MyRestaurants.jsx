import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiService from '../services/api'

// Images used on Home 'My Restaurants' section for visual consistency
import res1 from '../assets/images/res1.jpg'
import res2 from '../assets/images/res2.jpg'
import res3 from '../assets/images/res3.jpg'
import res4 from '../assets/images/res4.jpg'

// Default images array
const defaultImages = [res1, res2, res3, res4]

function MyRestaurants() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      const response = await apiService.getMyRestaurants()
      setRestaurants(response.data?.restaurants || [])
      setError(null)
    } catch (err) {
      console.error('Failed to fetch restaurants:', err)
      setError('Failed to load restaurants')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="white-backdrop">
      {loading && <div style={{ padding: '20px', textAlign: 'center' }}>Loading restaurants...</div>}
      {error && <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>{error}</div>}
      
      <div className="page-header-2">
        <div>
          <h2 className="page-title">My Restaurants</h2>
          <p className="page-subtitle">View and manage the restaurants you own</p>
        </div>
      </div>

      <div className="my-restaurants-home-main">
        <h2 className="section-title">My Restaurants</h2>

        {restaurants.length === 0 && !loading ? (
          <div className="no-results" style={{ marginTop: 16 }}>
            <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <h3>No restaurants yet</h3>
            <p>Your restaurant will appear here once it's registered and approved.</p>
          </div>
        ) : (
          <div className="my-restaurants-row">
            {restaurants.map((restaurant, index) => (
              <Link
                to={`/dashboard/restaurantDetailPage/${restaurant.id}`}
                key={restaurant.id}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="deal-card-2">
                  <div className="deal-image-container">
                    <img 
                      src={restaurant.image || defaultImages[index % defaultImages.length]} 
                      alt={restaurant.name} 
                      className="deal-image" 
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
    </div>
  )
}

export default MyRestaurants