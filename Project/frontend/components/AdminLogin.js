import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api";
import "../components/CSS/AdminLogin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

const [loading, setLoading] = useState(false);

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
    setError(data.message || "Login failed");
  }

  } catch (err) {
    setError("Login failed");
  }
  setLoading(false);
}


  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
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
        <button className="submit-button" type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
