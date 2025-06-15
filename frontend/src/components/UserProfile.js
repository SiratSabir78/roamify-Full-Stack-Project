import React, { useState, useEffect } from "react";
import { fetchUserProfile, updateUserProfile } from "../api";
import "./CSS/UserProfile.css";

function UserProfile() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id;

  const [formData, setFormData] = useState({
    userId: userId || "",
    username: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function getUserData() {
      setLoading(true);
      setMessage("");
      try {
        const res = await fetchUserProfile(userId);
        const data = res.data;
        setFormData({
          userId: data._id,
          username: data.username,
          email: data.email,
          phone: data.phone,
          address: data.address,
          gender: data.gender,
          password: "",
        });
      } catch (error) {
        setMessage("Failed to load user data");
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      getUserData();
    } else {
      setLoading(false);
      setMessage("No user ID found");
    }
  }, [userId]);

  const validate = (data) => {
    const err = {};
    if (!data.username || data.username.length < 3)
      err.username = "Username must be at least 3 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      err.email = "Please enter a valid email address";
    else if (!/@gmail\.com$/.test(data.email))
      err.email = "Only Gmail addresses are allowed";
    if (!/^((\+92)|(0092)|(92)|0)?3[0-9]{9}$/.test(data.phone))
      err.phone = "Enter a valid Pakistani phone number (e.g. 03xxxxxxxxx)";
    if (!data.address || !/pakistan/i.test(data.address))
      err.address = "Address must include Pakistan";
    if (!["male", "female", "other"].includes(data.gender))
      err.gender = "Select a valid gender";
    if (data.password && data.password.length > 0 && data.password.length < 6)
      err.password = "Password must be at least 6 characters";
    return err;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate(formData);
    setErrors(err);
    if (Object.keys(err).length === 0) {
      try {
        const res = await updateUserProfile(formData);
        setMessage(res.data.message || "Profile updated successfully");
        setErrors({});
        setFormData((prev) => ({ ...prev, password: "" }));
        setIsEditing(false);
      } catch (error) {
        setMessage("");
        setErrors({ form: error.response?.data?.error || "Update failed" });
      }
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {message && <div className="form-success">{message}</div>}
      {errors.form && <div className="form-error">{errors.form}</div>}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          {Object.entries({
            username: "Username",
            email: "Email",
            phone: "Phone",
            address: "Address",
            password: "Password",
          }).map(([key, label]) => (
            <div key={key} className="form-group">
              <label htmlFor={key}>{label}:</label>
              <input
                id={key}
                name={key}
                type={key === "password" ? "password" : "text"}
                value={formData[key]}
                onChange={handleChange}
                placeholder={`Enter ${label.toLowerCase()}`}
                autoComplete={key === "password" ? "new-password" : "off"}
                className="profile-input"
              />
              <small className="error">{errors[key]}</small>
            </div>
          ))}

          <div className="form-group">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="profile-select"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <small className="error">{errors.gender}</small>
          </div>

          <div className="modal-buttons">
            <button type="submit" className="submit-button">
              Save
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          <div>
            <strong>Username:</strong> {formData.username}
          </div>
          <div>
            <strong>Email:</strong> {formData.email}
          </div>
          <div>
            <strong>Phone:</strong> {formData.phone}
          </div>
          <div>
            <strong>Address:</strong> {formData.address}
          </div>
          <div>
            <strong>Gender:</strong> {formData.gender}
          </div>
          <div>
            <strong>Password:</strong> *******
          </div>
          <button
            className="submit-button"
            onClick={() => setIsEditing(true)}
          >
            Update
          </button>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
