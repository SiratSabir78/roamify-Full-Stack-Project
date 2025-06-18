import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminLogin } from "../api";
import "../components/CSS/AdminLogin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await adminLogin({ email, password });
      const data = response.data;

      if (data.admin && data.admin.isAdmin) {
        navigate("/admin-dashboard");
      } else {
        setError(data.message || "Not an admin");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      <div className="container d-flex flex-column align-items-center">
        <p>Log In your admin account here.</p>
        <Link to="/" className="navbar-brand">
          <img
            src="/Roamify.png"
            alt="Roamify Logo"
            width="80"
            height="80"
            className="d-inline-block align-text-top"
          />
        </Link>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
