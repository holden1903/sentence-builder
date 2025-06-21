import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/builder");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Log In</h2>
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
        <button type="submit" style={{marginTop:"1rem", padding:"0.5rem 1rem"}}>Log In</button>
      </form>
      <p style={{marginTop:"1rem"}}>
        Need an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
);
}
