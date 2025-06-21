import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  // Only allow access if user is logged in; adjust logic for admin email if needed
  return currentUser ? children : <Navigate to="/" />;
}
