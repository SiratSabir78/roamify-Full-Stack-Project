import React, { useState } from "react";
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

  const validate = (data) => {
    const err = {};

    if (!data.username || data.username.length < 3) {
      err.username = "Username must be at least 3 characters";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      err.email = "Please enter a valid email address";
    } else if (!/@gmail\.com$/.test(data.email)) {
      err.email = "Only Gmail addresses are allowed";
    }

    if (!/^((\+92)|(0092)|(92)|0)?3[0-9]{9}$/.test(data.phone)) {
      err.phone = "Enter a valid Pakistani phone number (e.g. 03xxxxxxxxx)";
    }

    if (!data.address || !/pakistan/i.test(data.address)) {
      err.address = "Address must include Pakistan";
    }

    if (!["male", "female", "other"].includes(data.gender)) {
      err.gender = "Select a valid gender";
    }

    if (!data.password || data.password.length < 6) {
      err.password = "Password must be at least 6 characters";
    }

    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate(formData);
    setErrors(err);

    if (Object.keys(err).length === 0) {
      fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
            alert("Signup successful!");
            navigate("/");
            console.log("navigating to homepage");
          } else {
            alert(data.message || "Signup failed!");
          }

          setFormData({
            username: "",
            email: "",
            phone: "",
            address: "",
            gender: "",
            password: "",
          });
        })
        .catch((err) => {
          console.error("Signup failed", err);
          alert("Signup failed! See console.");
        });
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Sign Up here</h2>
        <h2>Create Your Account on Roamify</h2>
        <div className="justify-content-center">
          <Link to="/" className="navbar-brand justify-content-center">
            <img
              src="/Roamify.png"
              alt="Logo"
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
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
              placeholder={`Enter ${field}`}
            />
            <small className="error">{errors[field]}</small>
          </div>
        ))}

        <div className="form-group">
          <label>Gender:</label>
          <select
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <small className="error">{errors.gender}</small>
        </div>

        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder="Enter your address including Pakistan"
          />
          <small className="error">{errors.address}</small>
          <iframe
            title="Map"
            src="https://maps.google.com/maps?q=Pakistan&t=&z=5&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="200"
            style={{ border: 0, marginTop: "10px" }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        <button type="submit" className="submit-button">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUp;
