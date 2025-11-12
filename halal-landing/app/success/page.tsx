"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const id = searchParams.get("session_id");
    if (id) setSessionId(id);
  }, [searchParams]);

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h1 className="success-title">Payment Successful!</h1>
          <p className="success-message">
            Thank you for your purchase. Your subscription has been activated.
          </p>
          
          {sessionId && (
            <div className="session-info">
              <p className="session-text">Session ID:</p>
              <code className="session-id">{sessionId}</code>
            </div>
          )}

          <div className="success-actions">
            <Link href="/" className="success-btn-primary">
              Go to Homepage
            </Link>
            <a href="/dashboard" className="success-btn-secondary">
              Go to Dashboard
            </a>
          </div>

          <p className="success-note">
            A confirmation email has been sent to your email address.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="success-page">
        <div className="success-container">
          <div className="success-card">
            <p style={{textAlign: 'center', color: '#fff'}}>Loading...</p>
          </div>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
