import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Practice from "./pages/Practice";
import AdminPanel from "./pages/AdminPanel";
import PrivateRoute from "./components/PrivateRoute";
import Practice from "./pages/Practice";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<Practice />} />
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminPanel />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}