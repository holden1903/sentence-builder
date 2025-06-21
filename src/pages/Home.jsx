import React from "react";
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg, #3b82f6, #10b981)'}}>
      <div style={{maxWidth:'1024px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem', padding:'2rem', color:'#fff'}}>
        <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
          <img src="/logo.svg" alt="Logo" style={{height:'64px'}} />
          <h1 style={{fontSize:'3rem', margin:'1rem 0'}}>Build the Sentence</h1>
          <p style={{fontSize:'1.25rem', lineHeight:'1.5'}}>Improve your English sentence-building skills with step-by-step guidance and interactive practice.</p>
          <Link to="/builder">
            <button style={{marginTop:'1.5rem', padding:'0.75rem 1.5rem', fontSize:'1rem', background:'#fff', color:'#2563EB', border:'none', borderRadius:'0.375rem', cursor:'pointer'}}>
              Start Practicing →
            </button>
          </Link>
        </div>
        <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{width:'300px', height:'600px', background:'#e5e7eb', borderRadius:'1rem', boxShadow:'0 10px 15px rgba(0,0,0,0.1)'}} />
        </div>
      </div>
    </div>
  );
}