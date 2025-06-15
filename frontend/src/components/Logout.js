// src/components/Logout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the user from localStorage
    localStorage.removeItem("user");

    // Optional: Show a logout confirmation
    alert("You have been logged out.");

    // Redirect to login
    navigate("/Login");
  }, [navigate]);

  return null; // No UI needed
};

export default Logout;
