import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./components/CSS/App.css";
import Homepage from "./components/Homepage";
import Navbar from "./components/Navbar";
import Communityforum from "./components/Communityforum";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import CityManager from "./components/CityManager";
import BookingManager from "./components/BookingManagement";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
  <Route path="/" element={<AdminLogin />} />
  <Route path="/HomePage" element={<Homepage />} />
  <Route path="/Communityforum" element={<Communityforum />} />

  <Route path="/admin-login" element={<AdminLogin />} />
  <Route path="/admin-dashboard" element={<AdminDashboard />} />
  <Route path="/city-manager" element={<CityManager />} />
  <Route path="/booking-manager" element={<BookingManager />} />
</Routes>
    </Router>
  );
}

export default App;
