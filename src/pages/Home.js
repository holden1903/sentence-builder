import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div style={{ maxWidth: '1024px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '2rem', alignItems: 'center' }}>
        <div>
          <img src="/logo.svg" alt="Sentence Builder" style={{ height: '64px' }} />
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#374151', margin: '1rem 0' }}>Build the Sentence</h1>
          <p style={{ color: '#6B7280', fontSize: '1.125rem' }}>
            Improve your English sentence-building skills with step-by-step guidance and interactive practice.
          </p>
          <Link to="/builder">
            <button style={{ marginTop: '1rem', backgroundColor: '#2563EB', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', fontSize: '1rem', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
              Start Practicing →
            </button>
          </Link>
        </div>
        <div style={{ textAlign: 'center' }}>
          <img src="/mockups/landing_wireframe.png" alt="Landing Mockup" style={{ maxWidth: '100%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
        </div>
      </div>
    </div>
);
}
