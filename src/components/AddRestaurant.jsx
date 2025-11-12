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

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }))
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