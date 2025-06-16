import React from "react";
import { NavLink } from "react-router-dom";
import "./CSS/BottomNav.css";

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/bookings" className="nav-item" activeclassname="active">
        Bookings
      </NavLink>
      <NavLink to="/Reviews" className="nav-item" activeclassname="active">
        Reviews
      </NavLink>
      <NavLink to="/favorites" className="nav-item" activeclassname="active">
        Favorites
      </NavLink>
      <NavLink to="/user-profile" className="nav-item" activeclassname="active">
        Profile
      </NavLink>
    </nav>
  );
}

export default BottomNav;
