import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./CSS/SignUp.css";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [errors]);

  const validate = (data) => {
    const err = {};

    if (!data.username || data.username.trim().length < 3) {
      err.username = "Username must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      err.email = "Enter a valid email address";
    } else if (!/@gmail\.com$/.test(data.email)) {
      err.email = "Only Gmail addresses are allowed";
    }

    const phoneRegex = /^((\+92)|(0092)|(92)|0)?3[0-9]{9}$/;
    if (!phoneRegex.test(data.phone)) {
      err.phone = "Enter a valid Pakistani phone number";
    }

    if (!data.address || !/pakistan/i.test(data.address)) {
      err.address = "Address must include 'Pakistan'";
    }

    if (!["male", "female", "other"].includes(data.gender)) {
      err.gender = "Please select a valid gender";
    }

    if (!data.password || data.password.length < 6) {
      err.password = "Password must be at least 6 characters";
    }

    return err;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        setLoading(false);

        if (res.status === 409) {
          // Email already exists
          setErrors((prev) => ({ ...prev, email: data.message }));
          return;
        }

        if (res.ok && data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          alert("Signup successful!");
          navigate("/");
        } else {
          alert(data.message || "Signup failed!");
        }
      } catch (err) {
        console.error("Signup failed:", err);
        setLoading(false);
        alert("Signup failed! Check console for errors.");
      }
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Sign Up</h2>

        <div className="container d-flex flex-column align-items-center">
          <p>Create Your Account on Roamify</p>
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

        {["username", "email", "phone", "password"].map((field) => (
          <div key={field} className="form-group">
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type={field === "password" ? "password" : "text"}
              value={formData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={`Enter ${field}`}
              required
            />
            {errors[field] && <small className="error">{errors[field]}</small>}
          </div>
        ))}

        <div className="form-group">
          <label>Gender:</label>
          <select
            value={formData.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <small className="error">{errors.gender}</small>}
        </div>

        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Include 'Pakistan' in your address"
            required
          />
          {errors.address && <small className="error">{errors.address}</small>}
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p style={{ marginTop: "10px" }}>
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
