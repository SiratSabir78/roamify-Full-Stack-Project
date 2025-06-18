import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./components/CSS/App.css";
import Homepage from "./components/Homepage";
import Communityforum from "./components/Communityforum";
import SignUp from "./components/SignUp";
import LogIn from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import CityManager from "./components/CityManager";
import BookingManager from "./components/BookingManagement";
import Logout from "./components/Logout";
import UserProfile from "./components/UserProfile";
import HomeOptions from "./components/LandingPage";
import Favourites from "./components/Favourites";
import CityDetails from "./components/CityDetails";
import Reviews from "./components/Reviews";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeOptions />} />{" "}
        <Route path="/Homepage" element={<Homepage />} />
        <Route path="/Communityforum" element={<Communityforum />} />
        <Route path="/Login" element={<LogIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/city-manager" element={<CityManager />} />
        <Route path="/booking-manager" element={<BookingManager />} />
        <Route path="/Logout" element={<Logout />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/city/:id" element={<CityDetails />} />
        <Route path="/Reviews" element={<Reviews />} />{" "}
      </Routes>
    </Router>
  );
}

export default App;
