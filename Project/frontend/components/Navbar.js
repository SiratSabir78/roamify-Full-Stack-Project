import React from "react";
import "./CSS/Navbar.css";
import "./CSS/App.css";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container-fluid">
        <Link to="/Homepage" className="navbar-brand">
          <img
            src="/Roamify.png"
            alt="Logo"
            width="60"
            height="60"
            className="d-inline-block align-text-top"
          />
          <strong> Roamify</strong>
        </Link>
        <ul className="nav justify-content-end">
          <li className="nav-item">
            <Link to="/Homepage" className="nav-link active">
              <strong> Home</strong>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/user-profile" className="nav-link">
              <strong> Profile</strong>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/Communityforum" className="nav-link">
              <strong> Community Forum</strong>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/LogOut" className="nav-link">
              <strong> Logout</strong>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
