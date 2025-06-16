import React from "react";
import { NavLink } from "react-router-dom";
import "./CSS/BottomNav.css";

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/bookings" className="nav-item" activeclassname="active">
        Bookings
      </NavLink>
      <NavLink to="/reviews" className="nav-item" activeclassname="active">
        Reviews
      </NavLink>
      <NavLink to="/favourites" className="nav-item" activeclassname="active">
        Favorites
      </NavLink>
    </nav>
  );
}

export default BottomNav;
