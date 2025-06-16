import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./CSS/SignUp.css";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      if (res.data && res.data.user && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/Homepage");
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      const backendError = err.response?.data?.error || "Login failed.";
      setError(backendError);
    }
  };

  const isEmailError = error.toLowerCase().includes("email");
  const isPasswordError = error.toLowerCase().includes("password");

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Log In</h2>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <div className="error">{isEmailError ? error : ""}</div>
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="error">{isPasswordError ? error : ""}</div>
        </div>

        {!isEmailError && !isPasswordError && error && (
          <div className="error">{error}</div>
        )}

        <button type="submit" className="submit-button">
          Log In
        </button>

        <div className="signup-redirect">
          <span>Don't have an account? </span>
          <Link to="/SignUp" className="signup-link">Sign Up</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
