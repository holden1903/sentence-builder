import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password);
      navigate("/builder");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Sign Up</h2>
      {error && <p style={{color: "red"}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label><br/>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={{width:"100%", padding:"0.5rem"}}/>
        </div>
        <div style={{marginTop:"1rem"}}>
          <label>Password</label><br/>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{width:"100%", padding:"0.5rem"}}/>
        </div>
        <button type="submit" style={{marginTop:"1rem", padding:"0.5rem 1rem"}}>Sign Up</button>
      </form>
      <p style={{marginTop:"1rem"}}>
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </div>
);
}
