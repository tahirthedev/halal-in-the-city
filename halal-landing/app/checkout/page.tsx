"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [planName, setPlanName] = useState("");
  const [priceId, setPriceId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const plan = searchParams.get("plan");
    const price = searchParams.get("priceId");
    if (plan) setPlanName(plan);
    if (price) setPriceId(price);
  }, [searchParams]);

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Here you would integrate with Stripe
    // For now, just showing a message
    alert(
      `Redirecting to Stripe checkout for ${planName} plan...\nPrice ID: ${priceId}`
    );

    // Example Stripe integration (you'll need to implement this):
    // const response = await fetch('/api/create-checkout-session', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ priceId })
    // });
    // const { url } = await response.json();
    // window.location.href = url;

    setLoading(false);
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-card">
          <div className="checkout-header">
            <h1 className="checkout-title">Complete Your Purchase</h1>
            <p className="checkout-subtitle">
              You've selected the <strong>{planName}</strong> plan
            </p>
          </div>

          <form onSubmit={handleCheckout} className="checkout-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                placeholder="John Doe"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="john@example.com"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">Company Name (Optional)</label>
              <input
                type="text"
                id="company"
                placeholder="Your Company"
                className="form-input"
              />
            </div>

            <div className="checkout-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Plan:</span>
                <span className="summary-value">{planName}</span>
              </div>
              <div className="summary-row">
                <span>Billing:</span>
                <span className="summary-value">Monthly</span>
              </div>
              <div className="summary-row summary-total">
                <span>Total:</span>
                <span className="summary-value">
                  ${planName === "Professional" ? "99" : "29"}/month
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="checkout-btn"
              disabled={loading}
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </button>

            <p className="checkout-note">
              🔒 Secure payment powered by Stripe
            </p>
          </form>

          <button
            className="back-btn"
            onClick={() => window.history.back()}
          >
            ← Back to Pricing
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-card">
            <p style={{textAlign: 'center', color: '#fff'}}>Loading...</p>
          </div>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
