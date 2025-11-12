"use client";
import React, { useState, useEffect } from 'react';

export default function Mockups() {
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    {
      title: "Discover Halal Food",
      subtitle: "Your Gateway to Authentic Halal Dining",
      description: "Find verified halal restaurants and food options in your city. Browse through curated selections and exclusive offers tailored just for you.",
      highlight: "500+ Restaurants",
      mockup: "./1.png" // Splash screen
    },
    {
      title: "Browse & Order",
      subtitle: "Everything You Crave, All in One Place",
      description: "Explore featured deals, search by cuisine type, and discover popular meals from top-rated restaurants. Quick access to burgers, pizza, sandwiches and more.",
      highlight: "Multiple Cuisines",
      mockup: "./2.png" // Home screen
    },
    {
      title: "Exclusive Deals",
      subtitle: "Save More on Every Order",
      description: "Get access to special offers and limited-time deals. Share amazing discounts with family and friends across all social platforms.",
      highlight: "Up to 50% Off",
      mockup: "./3.png" // Detail screen
    },
    {
      title: "Scan & Explore",
      subtitle: "Instant Access to Offers",
      description: "Simply scan QR codes at participating restaurants to unlock exclusive deals and stay updated with the latest offerings in your area.",
      highlight: "QR Code Support",
      mockup: "./4.png" // Thank you screen
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="showcase-section">
      <style jsx>{`
        .showcase-section {
          background: linear-gradient(180deg, #000000 0%, #0a0a0a 100%);
          padding: 120px 20px;
          position: relative;
          overflow: hidden;
        }

        .showcase-section::before {
          content: '';
          position: absolute;
          top: -200px;
          right: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(184, 134, 11, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .showcase-section::after {
          content: '';
          position: absolute;
          bottom: -150px;
          left: -150px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(184, 134, 11, 0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .container {
          max-width: 1280px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .showcase-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .content-side {
          padding-right: 40px;
        }

        .section-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          background: rgba(184, 134, 11, 0.1);
          border: 1px solid rgba(184, 134, 11, 0.2);
          border-radius: 24px;
          color: #B8860B;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 24px;
        }

        .section-label::before {
          content: '';
          width: 8px;
          height: 8px;
          background: #B8860B;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .main-title {
          font-size: 56px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
          margin-bottom: 16px;
          opacity: 0;
          animation: fadeInUp 0.8s ease forwards;
        }

        .main-subtitle {
          font-size: 24px;
          font-weight: 600;
          background: linear-gradient(135deg, #B8860B 0%, #DAA520 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 24px;
          opacity: 0;
          animation: fadeInUp 0.8s ease 0.2s forwards;
        }

        .main-description {
          font-size: 17px;
          color: #9ca3af;
          line-height: 1.8;
          margin-bottom: 32px;
          opacity: 0;
          animation: fadeInUp 0.8s ease 0.4s forwards;
        }

        .highlight-badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 28px;
          background: linear-gradient(135deg, rgba(184, 134, 11, 0.15) 0%, rgba(218, 165, 32, 0.15) 100%);
          border: 1px solid rgba(184, 134, 11, 0.3);
          border-radius: 12px;
          margin-bottom: 40px;
          opacity: 0;
          animation: fadeInUp 0.8s ease 0.6s forwards;
        }

        .highlight-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #B8860B 0%, #DAA520 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000000;
          font-weight: 700;
          font-size: 18px;
        }

        .highlight-text {
          color: #ffffff;
          font-weight: 600;
          font-size: 16px;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .feature-nav {
          display: flex;
          gap: 12px;
          margin-top: 48px;
        }

        .nav-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
        }

        .nav-dot.active {
          background: #B8860B;
          width: 32px;
          border-radius: 6px;
        }

        .nav-dot.active::after {
          content: '';
          position: absolute;
          inset: -4px;
          border: 1px solid rgba(184, 134, 11, 0.3);
          border-radius: 8px;
        }

        .mockup-side {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 1000px;
        }

        .mockup-container {
          position: relative;
          width: 340px;
          height: 700px;
        }

        .phone-frame {
          position: absolute;
          inset: 0;
          background: transparent;
          border-radius: 45px;
          border: none;
          box-shadow: 
            0 40px 80px rgba(0, 0, 0, 0.3),
            0 0 100px rgba(184, 134, 11, 0.15);
          overflow: hidden;
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotateY(-5deg); }
          50% { transform: translateY(-20px) rotateY(-5deg); }
        }

        .phone-notch {
          display: none;
        }

        .screen-content {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: transparent;
        }

        .mockup-screen-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          animation: fadeIn 0.6s ease;
          border-radius: 45px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 1024px) {
          .showcase-grid {
            grid-template-columns: 1fr;
            gap: 60px;
          }

          .content-side {
            padding-right: 0;
            text-align: center;
          }

          .mockup-side {
            order: -1;
          }

          .main-title {
            font-size: 42px;
          }

          .main-subtitle {
            font-size: 20px;
          }
        }

        @media (max-width: 768px) {
          .showcase-section {
            padding: 80px 20px;
          }

          .main-title {
            font-size: 36px;
          }

          .mockup-container {
            width: 280px;
            height: 580px;
          }
        }
      `}</style>

      <div className="container">
        <div className="showcase-grid">
          <div className="content-side">
            <div className="section-label">Mobile Experience</div>
            
            <h2 className="main-title">{features[activeIndex].title}</h2>
            <h3 className="main-subtitle">{features[activeIndex].subtitle}</h3>
            <p className="main-description">{features[activeIndex].description}</p>
            
            <div className="highlight-badge">
              <div className="highlight-icon">✓</div>
              <span className="highlight-text">{features[activeIndex].highlight}</span>
            </div>

            <div className="feature-nav">
              {features.map((_, index) => (
                <div
                  key={index}
                  className={`nav-dot ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </div>

          <div className="mockup-side">
            <div className="mockup-container">
              <div className="phone-frame">
                <div className="phone-notch" />
                <div className="screen-content">
                  <img 
                    src={features[activeIndex].mockup} 
                    alt={features[activeIndex].title}
                    className="mockup-screen-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}