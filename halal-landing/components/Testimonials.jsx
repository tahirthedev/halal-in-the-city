"use client"
import React, { useEffect } from 'react'
import { useState } from 'react';

const testimonials = [
  {
    id: 1,
    company: 'TASTY BITES',
    logo: '🍔',
    text: "Since joining Halal in the City, we've seen a 40% increase in new customers. The digital coupons bring people through our doors, and the platform is so easy to manage.",
    author: 'Ahmed K.',
    position: 'Owner - Tasty Bites Restaurant',
    avatar: '👨‍💼'
  },
  {
    id: 2,
    company: 'SPICE HOUSE',
    logo: '🌶️',
    text: "The mobile app has helped us reach customers we never could have reached before. Our weekday lunch traffic has doubled since we started offering exclusive deals through the platform.",
    author: 'Fatima M.',
    position: 'Manager - Spice House Grill',
    avatar: '�‍�'
  },
  {
    id: 3,
    company: 'HALAL KITCHEN',
    logo: '�',
    text: "The setup was incredibly simple. Within hours, we had our first coupons live and customers were already redeeming them. The analytics help us understand what deals work best.",
    author: 'Omar R.',
    position: 'Owner - Halal Kitchen',
    avatar: '👨‍�'
  },
  {
    id: 4,
    company: 'FRESH EATS',
    logo: '🥗',
    text: "Best investment we've made for our restaurant! The platform pays for itself with just a few new customers each month. Highly recommend to any halal restaurant owner.",
    author: 'Zainab A.',
    position: 'Owner - Fresh Eats Cafe',
    avatar: '👩‍🍳'
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const getVisibleCards = () => {
    const cards = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      cards.push(testimonials[index]);
    }
    return cards;
  };

  return (
    <section id="testimonials" className="section-testi">
      <div className="container-testi">
        <h2 className="title-testi">
          Trusted by<br />
          Halal Restaurants Everywhere.
        </h2>

        <div className="carousel-testi">
          <button 
            className="nav-button-testi prev-testi"
            onClick={handlePrev}
            aria-label="Previous testimonial"
          >
            ←
          </button>

          <div className="cards-wrapper-testi">
            <div 
              className="cards-container-testi"
              style={{
                transform: `translateX(-${(currentIndex % testimonials.length) * (100 / 3)}%)`,
              }}
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div key={`${testimonial.id}-${index}`} className="card-testi">
                  <div className="card-header-testi">
                    <div className="company-logo-testi">
                      <span className="logo-icon-testi">{testimonial.logo}</span>
                      <span className="company-name-testi">{testimonial.company}</span>
                    </div>
                  </div>

                  <p className="testimonial-text-testi">
                    {testimonial.text}
                  </p>

                  <div className="author-section-testi">
                    <div className="author-info-testi">
                      <div className="avatar-testi">{testimonial.avatar}</div>
                      <div className="author-details-testi">
                        <div className="author-name-testi">{testimonial.author}</div>
                        <div className="author-position-testi">{testimonial.position}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pattern-testi"></div>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="nav-button-testi next-testi"
            onClick={handleNext}
            aria-label="Next testimonial"
          >
            →
          </button>
        </div>

        <div className="dots-testi">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`dot-testi ${index === currentIndex ? 'active-testi' : ''}`}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(index);
              }}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}