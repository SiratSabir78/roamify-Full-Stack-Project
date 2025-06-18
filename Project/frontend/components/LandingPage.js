import React from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/SignUp.css";

function HomeOptions() {
  const navigate = useNavigate();

  return (
    <div className="signup-container">
      <h2>Welcome</h2>
      <div className="form-group">
        <button
          className="submit-button"
          onClick={() => navigate("/login")}
        >
          Log in as User
        </button>
      </div>
      <div className="form-group">
        <button
          className="submit-button"
          onClick={() => navigate("/admin-login")}
        >
          Log in as Admin
        </button>
      </div>
      <div className="form-group">
        <button
          className="submit-button"
          onClick={() => navigate("/SignUp")}
        >
          Sign up for User
        </button>
      </div>
    </div>
  );
}

export default HomeOptions;
