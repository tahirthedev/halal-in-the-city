import React from 'react'
import img1 from "../assets/images/res1.jpg"

function RestaurantDetailPage() {
  return (
    <div>
        <div className="modal-overlay" >
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h2 className="modal-title">Restaurant Details</h2>
            </div>
            <div className="modal-body">
              <div className="restaurant-details">
                <div className="restaurant-header">
                  <div className="restaurant-logo-large">
                    <img 
                      src={img1} 
                    />
                  </div>
                  <div className="restaurant-info-detailed">
                    <h3>Al-Baik</h3>
                    <div className="restaurant-meta-detailed">
                      <span className="category-badge">Fast Food</span>
                      <span className={`status-badge active`}>
                        Active
                      </span>
                    </div>
                    <p className="owner-info">Owned by Ahmed Hassan</p>
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
                      <span className="stat-number">5+</span>
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
                      <span className="stat-number">2</span>
                      <span className="stat-text">Branches</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div className="stat-info">
                      <span className="stat-number">2543</span>
                      <span className="stat-text">Total Orders</span>
                    </div>
                  </div>
                </div>

                <div className="restaurant-description-detailed">
                  <h4>About</h4>
                  <p>Short Description</p>
                </div>

                <div className="restaurant-contact-detailed">
                  <h4>Contact Information</h4>
                  <div className="contact-grid">
                    <div className="contact-detail">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>restaurant@gmail.com</span>
                    </div>
                    <div className="contact-detail">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>+940 458 1234</span>
                    </div>
                    <div className="contact-detail">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0-9C7.163 3 3 7.163 3 12s4.163 9 9 9" />
                      </svg>
                      <span>www.restaurant.com</span>
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
              {/* <button className="btn-secondary">
                Close
              </button> */}
              <button className="btn-primary">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Restaurant
              </button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default RestaurantDetailPage