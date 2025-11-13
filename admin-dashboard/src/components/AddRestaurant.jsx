import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "../styles/dashboard.css"
import apiService from "../services/api"

function AddRestaurant() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    cuisine: [], // Changed to array for multiple selection
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
  const [logoPreview, setLogoPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }))
  }

  const handleCuisineToggle = (cuisineValue) => {
    setFormData(prev => ({
      ...prev,
      cuisine: prev.cuisine.includes(cuisineValue)
        ? prev.cuisine.filter(c => c !== cuisineValue)
        : [...prev.cuisine, cuisineValue]
    }))
  }

  const handleLogoChange = (e) => {
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

      setFormData(prev => ({
        ...prev,
        logo: file
      }))
      
      // Create preview and base64
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result) // Store base64 for both preview and submission
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate cuisine selection
      if (formData.cuisine.length === 0) {
        setError('Please select at least one cuisine category')
        setLoading(false)
        return
      }

      // Prepare the data to send
      const restaurantData = {
        restaurantName: formData.name,
        cuisine: formData.cuisine.join(', '), // Join array to comma-separated string
        description: formData.description,
        website: formData.website,
        phone: formData.contactNumber,
        address: formData.address || 'N/A',
        city: formData.city || 'N/A',
        postalCode: formData.postalCode || '00000',
        province: formData.province || '',
        ownerName: formData.ownerName,
        ownerEmail: formData.email,
      }

      // Add logo if uploaded (as base64)
      if (logoPreview) {
        restaurantData.logo = logoPreview
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
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Cuisine Categories * (Select multiple)</label>
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '12px',
                        padding: '12px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0'
                      }}>
                        {[
                          { value: 'Middle Eastern', label: 'Middle Eastern' },
                          { value: 'Pakistani', label: 'Pakistani' },
                          { value: 'Indian', label: 'Indian' },
                          { value: 'Turkish', label: 'Turkish' },
                          { value: 'International', label: 'International' }
                        ].map(cuisine => (
                          <label 
                            key={cuisine.value}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 16px',
                              backgroundColor: formData.cuisine.includes(cuisine.value) ? '#4CAF50' : 'white',
                              color: formData.cuisine.includes(cuisine.value) ? 'white' : '#333',
                              border: '2px solid',
                              borderColor: formData.cuisine.includes(cuisine.value) ? '#4CAF50' : '#ddd',
                              borderRadius: '20px',
                              cursor: 'pointer',
                              fontWeight: '500',
                              transition: 'all 0.3s ease',
                              userSelect: 'none'
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={formData.cuisine.includes(cuisine.value)}
                              onChange={() => handleCuisineToggle(cuisine.value)}
                              style={{ display: 'none' }}
                            />
                            {cuisine.label}
                          </label>
                        ))}
                      </div>
                      {formData.cuisine.length === 0 && (
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                          Please select at least one cuisine category
                        </p>
                      )}
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
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Restaurant Logo</label>
                      <div style={{ marginTop: '12px' }}>
                        {!logoPreview ? (
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
                            onClick={() => document.getElementById('logoInput').click()}
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
                              Click to upload logo
                            </p>
                            <p style={{ fontSize: '12px', color: '#6b7280' }}>
                              PNG, JPG, WEBP up to 5MB
                            </p>
                          </div>
                        ) : (
                          <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '2px solid #c69a1a', maxWidth: '300px', margin: '0 auto' }}>
                            <img 
                              src={logoPreview} 
                              alt="Logo preview" 
                              style={{ width: '100%', height: '300px', objectFit: 'contain', display: 'block', background: '#f9fafb', padding: '16px' }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setLogoPreview(null)
                                setFormData(prev => ({ ...prev, logo: null }))
                              }}
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
                          id="logoInput"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          style={{ display: 'none' }}
                        />
                      </div>
                      <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '8px', textAlign: 'center' }}>
                        Recommended: Square image (500x500px) for best display
                      </small>
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