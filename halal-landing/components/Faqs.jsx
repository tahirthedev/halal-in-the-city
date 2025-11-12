"use client"
import React from 'react'
import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { question: "What is Halal in the City?", answer: "Halal in the City is a mobile platform that connects halal restaurants with customers through digital coupons and exclusive deals. Restaurants create offers, and customers discover and redeem them via our mobile app." },
    { question: "How does the coupon system work?", answer: "Restaurant owners create digital coupons through our merchant dashboard. These coupons are displayed in the mobile app for customers to browse. When customers visit your restaurant, they can show the coupon on their phone to redeem the offer." },
    { question: "Who is this platform designed for?", answer: "This platform is designed for halal restaurant owners, managers, and food service businesses who want to attract more customers and increase foot traffic through digital promotions." },
    { question: "How do customers find my restaurant's coupons?", answer: "Customers browse available deals through our mobile app, which shows all active coupons from participating halal restaurants in their area. They can search by cuisine type, location, or discount percentage." },
    { question: "What types of deals can I create?", answer: "You can create various types of offers including percentage discounts, buy-one-get-one deals, fixed amount off, free items with purchase, and special combo deals. The choice is yours!" },
    { question: "Is there a mobile app for customers?", answer: "Yes! We have a user-friendly mobile app available for both iOS and Android where customers can browse, save, and redeem coupons at participating halal restaurants." },
    { question: "What support is available for restaurant owners?", answer: "We provide comprehensive support including onboarding assistance, a detailed merchant dashboard tutorial, email support, and ongoing help to ensure your success on the platform." },
    { question: "How secure is the platform?", answer: "We use industry-standard encryption and security practices to protect your business information and customer data. All transactions and coupon redemptions are tracked securely." },
    { question: "How much does it cost?", answer: "We offer flexible pricing plans starting with a free trial period. Check our pricing section below for detailed information on our subscription options tailored for different business sizes." },
    { question: "How many coupons can I create?", answer: "Depending on your subscription plan, you can create multiple active coupons simultaneously. This allows you to run various promotions for different menu items or time periods." }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="faqs" style={{
      minHeight: '100vh',
      backgroundColor: '#000000',
      padding: '80px 40px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        maxWidth: '1400px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: '80px',
        alignItems: 'start'
      }}>
        <h1 style={{
          fontSize: '80px',
          fontWeight: '700',
          color: '#ffffff',
          lineHeight: '1.05',
          margin: '0',
          paddingTop: '20px'
        }}>
          Frequently Asked Questions
        </h1>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0'
        }}>
          {faqs.map((faq, index) => (
            <div key={index} style={{
              borderBottom: '1px solid #2a2a2a',
              paddingTop: index === 0 ? '0' : '0'
            }}>
              <button 
                onClick={() => toggleFAQ(index)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px',
                  padding: '28px 0',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '20px',
                  fontWeight: '500',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <svg 
                    style={{
                      width: '18px',
                      height: '18px',
                      color: '#C99E1F',
                      flexShrink: '0'
                    }}
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{faq.question}</span>
                </div>
                <svg 
                  style={{
                    width: '24px',
                    height: '24px',
                    color: '#666666',
                    flexShrink: '0',
                    transition: 'transform 0.3s',
                    transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {openIndex === index && (
                <div style={{
                  paddingBottom: '28px',
                  paddingLeft: '34px',
                  color: '#999999',
                  fontSize: '17px',
                  lineHeight: '1.6',
                  animation: 'slideDown 0.3s ease-out'
                }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 1024px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
            gap: 50px !important;
          }
          h1 {
            font-size: 56px !important;
          }
        }
        
        @media (max-width: 768px) {
          h1 {
            font-size: 42px !important;
          }
        }
      `}</style>
    </div>
  );
}