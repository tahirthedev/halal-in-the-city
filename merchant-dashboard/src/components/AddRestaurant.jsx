"use client"

import { useState } from 'react'
import "../styles/dashboard.css"

function AddRestaurant() {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    cuisine: '',
    ownerName: '',
    contactNumber: '',
    email: '',
    description: '',
    website: '',
    logo: null
  })
  const [logoPreview, setLogoPreview] = useState(null)

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
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
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setFormData(prev => ({
      ...prev,
      logo: null
    }))
    setLogoPreview(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission here
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
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">Restaurant Logo</h3>
                  <div className="form-group">
                    <label className="form-label">Upload Logo</label>
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
                            Click to upload restaurant logo
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
                            onClick={removeLogo}
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
                </div>

                <div className="form-section">
                  <h3 className="section-title">Halal Certification</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Upload Halal Certification</label>
                      <input 
                        type="file" 
                        name="halalCertification"
                        className="form-file" 
                        accept="image/*"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Restaurant
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