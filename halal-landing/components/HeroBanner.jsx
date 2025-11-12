// components/HeroBanner.jsx
"use client";
import Link from 'next/link';


export default function HeroBanner() {

  const handleFreeTrial = () => {
    window.open("https://halal-in-the-city-merchant.netlify.app/", "_blank");
  }


  return (
    <>
      {/* Top Banner */}
      <div className="top-banner">
        <span>
          🎉 Launch Special: <strong>FREE</strong> for the first 3 months – Limited spots available!
        </span>
        <Link href="#pricing" className="learn-more-link">
          Claim Offer →
        </Link>
      </div>

      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <img src="/logo.png" alt="TestSprite" />
            <span></span>
          </div>

          <nav className="nav">

            <Link href="#faqs">Faqs</Link>
            <Link href="#testimonials">Testimonials</Link>
            <Link href="#pricing">Pricing</Link>
            <Link href="#contact">Contact Us</Link>
          </nav>

          <div className="auth-buttons">
            <button onClick={handleFreeTrial} className="try-free">Try Free Trial</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="background-pattern"></div>

        <div className="container">
          {/* Notice Badge */}
          <div className="notice">
            <span className="notice-badge">New</span>
            <span className="notice-text">
              Join <span className="highlight">500+ halal restaurants</span> already using our platform to{' '}
              <span className="highlight">boost customer engagement</span> and drive more foot traffic.
            </span>
            <Link href="#pricing" className="notice-link">
              Get Started →
            </Link>
          </div>

          {/* Main Heading */}
          <h1 className="heading">
            Connect with your customers through{' '}
            <span className="accent">exclusive deals</span> and{' '}
            <span className="accent">digital coupons</span> on their{' '}
            <span className="accent">mobile devices</span>.
          </h1>

          {/* Subheading */}
          <p className="subheading">
            Halal in the City helps halal restaurants create, manage, and distribute 
            mobile coupons that customers can easily discover and redeem in-store.
          </p>

          {/* CTA Buttons */}
          <div className="cta-buttons">
            <button onClick={handleFreeTrial} className="try-mcp">
              <span className="new-badge">Free Trial</span>
              Start Now
            </button>
            <a href="#contact" className="join-community">Contact Us</a>
          </div>
        </div>
      </section>
    </>
  );
}