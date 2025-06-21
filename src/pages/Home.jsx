import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #3b82f6, #10b981)'
    }}>
      <div style={{
        maxWidth: '1024px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        padding: '2rem',
        color: '#fff'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>Build the Sentence</h1>
          <p style={{ fontSize: '1.25rem', lineHeight: '1.5' }}>
            Improve your English sentence-building skills with step-by-step guidance and interactive practice.
          </p>
          <Link to="/builder">
            <button style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              background: '#fff',
              color: '#2563EB',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}>
              Start Practicing →
            </button>
          </Link>
        <div style={{ marginTop: "1rem" }}>
          <Link to="/signup" style={{ marginRight: "1rem", color:"#fff" }}>Sign Up</Link>
          <Link to="/login" style={{ color:"#fff" }}>Log In</Link>
        </div>
        </div>
        <div style={{
          padding: '1rem',
          background: 'rgba(255,255,255,0.8)',
          borderRadius: '0.5rem',
          textAlign: 'center',
          fontSize: '1rem',
          color: '#333'
        }}>
          Advertisement<br/>Your Ad Here
        </div>
      </div>
    </div>
  );
}