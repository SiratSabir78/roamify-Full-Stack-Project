import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./components/CSS/App.css";
import Homepage from "./components/Homepage";
import Navbar from "./components/Navbar";
import Communityforum from "./components/Communityforum";
import SignUp from "./components/SignUp";
import LogIn from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import CityManager from "./components/CityManager";
import BookingManager from "./components/BookingManagement";
import Logout from "./components/Logout";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />{" "}
        {/* ✅ Show Homepage on root */}
        <Route path="/Homepage" element={<Homepage />} />
        <Route path="/Communityforum" element={<Communityforum />} />
        <Route path="/Login" element={<LogIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/city-manager" element={<CityManager />} />
        <Route path="/booking-manager" element={<BookingManager />} />
        <Route path="/Logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
