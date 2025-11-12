import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "../styles/dashboard.css"
import apiService from "../services/api"

function AddRestaurant() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    cuisine: '',
    ownerName: '',
    contactNumber: '',
    email: '',
    description: '',
    website: '',
    logo: null,
    halalCertification: null,
    address: '',
    city: '',
    postalCode: '',
    province: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Prepare the data to send
      const restaurantData = {
        restaurantName: formData.name,
        cuisine: formData.cuisine,
        description: formData.description,
        website: formData.website,
        phone: formData.contactNumber,
        address: formData.address || 'N/A',
        city: formData.city || 'N/A',
        postalCode: formData.postalCode || '00000',
        province: formData.province || '',
        ownerName: formData.ownerName,
        ownerEmail: formData.email,
        // Note: Files would need to be handled separately with FormData
        // For now, we'll just send the basic data
      }

      const response = await apiService.createRestaurantWithOwner(restaurantData)

      if (response.success) {
        alert(`Restaurant created successfully! 
        
Owner Email: ${formData.email}
Temporary Password: ${response.data.temporaryPassword || 'Sent via email'}

Login credentials have been sent to the owner's email.`)
        
        // Reset form or navigate
        navigate('/dashboard/restaurants')
      } else {
        setError(response.message || 'Failed to create restaurant')
      }
    } catch (err) {
      console.error('Error creating restaurant:', err)
      setError(err.message || 'Failed to create restaurant. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-restaurant-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Restaurant</h1>
          <p className="page-subtitle">Register a new halal restaurant to the platform</p>
        </div>
      </div>

      <div className="">
        <div className="form-wrapper">
          <div className="form-header">
            <h2 className="form-title">Restaurant Registration</h2>
            <p className="form-subtitle">Fill in all required information to add your restaurant</p>
          </div>
          
          {error && (
            <div style={{ 
              padding: '12px', 
              marginBottom: '20px', 
              backgroundColor: '#fee', 
              color: '#c00', 
              borderRadius: '8px',
              border: '1px solid #fcc'
            }}>
              {error}
            </div>
          )}
          
          <div className="form-content">
            <form className="professional-form" onSubmit={handleSubmit}>
              <div className="form-sections">
                <div className="form-section">
                  <h3 className="section-title">Basic Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Restaurant Name *</label>
                      <input 
                        type="text" 
                        name="name"
                        className="form-input" 
                        placeholder="Enter restaurant name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Type of Restaurant *</label>
                      <select 
                        name="type"
                        className="form-select"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select type</option>
                        <option value="fast-food">Fast Food</option>
                        <option value="casual-dining">Casual Dining</option>
                        <option value="fine-dining">Fine Dining</option>
                        <option value="cafe">Cafe</option>
                        <option value="bakery">Bakery</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Cuisine Category *</label>
                      <select 
                        name="cuisine"
                        className="form-select"
                        value={formData.cuisine}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select cuisine</option>
                        <option value="middle-eastern">Middle Eastern</option>
                        <option value="pakistani">Pakistani</option>
                        <option value="indian">Indian</option>
                        <option value="turkish">Turkish</option>
                        <option value="international">International</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">Owner Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Owner Full Name *</label>
                      <input 
                        type="text" 
                        name="ownerName"
                        className="form-input" 
                        placeholder="Enter owner's full name"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Contact Number *</label>
                      <input 
                        type="tel" 
                        name="contactNumber"
                        className="form-input" 
                        placeholder="+966 XX XXX XXXX"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input 
                        type="email" 
                        name="email"
                        className="form-input" 
                        placeholder="owner@restaurant.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">Restaurant Details</h3>
                  <div className="form-group full-width">
                    <label className="form-label">Description</label>
                    <textarea 
                      name="description"
                      className="form-textarea" 
                      placeholder="Brief description of the restaurant..."
                      rows="4"
                      value={formData.description}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Website</label>
                      <input 
                        type="url" 
                        name="website"
                        className="form-input" 
                        placeholder="https://www.restaurant.com"
                        value={formData.website}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Logo Upload</label>
                      <input 
                        type="file" 
                        name="logo"
                        className="form-file" 
                        accept="image/*"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Upload Halal Certification</label>
                      <input 
                        type="file" 
                        name="halalCertification"
                        className="form-file" 
                        accept="image/*,application/pdf"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Address</label>
                      <input 
                        type="text" 
                        name="address"
                        className="form-input" 
                        placeholder="Restaurant address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input 
                        type="text" 
                        name="city"
                        className="form-input" 
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Postal Code</label>
                      <input 
                        type="text" 
                        name="postalCode"
                        className="form-input" 
                        placeholder="Postal code"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Province/State</label>
                      <input 
                        type="text" 
                        name="province"
                        className="form-input" 
                        placeholder="Province or state"
                        value={formData.province}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => navigate('/dashboard/restaurants')}
                  disabled={loading}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {loading ? 'Creating...' : 'Add Restaurant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddRestaurant