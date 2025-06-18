import React, { useEffect, useState } from "react";
import axios from "axios";
//import "./CSS/AdminPanel.css";

const AdminPanel = () => {
  const [analytics, setAnalytics] = useState({});
  const [users, setUsers] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    axios.get("/admin/analytics").then((res) => setAnalytics(res.data));
    axios.get("/admin/cities").then((res) => setCities(res.data));
    axios.get("/admin/user-bookings").then((res) => setUsers(res.data));
  }, []);

  return (
    <div className="admin-panel">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li>Authentication</li>
          <li>Analytical Graphs</li>
          <li>User Management</li>
          <li>About Us</li>
          <li>City Management</li>
          <li>Booking Management</li>
        </ul>
      </aside>

      <main className="admin-content">
        <h3>Analytics Overview</h3>
        <p>Total Users: {analytics.totalUsers}</p>
        <p>Total Cities: {analytics.totalCities}</p>

        <h4>City Traveler Count:</h4>
        <ul>
          {analytics.cityTravelData?.map((city) => (
            <li key={city._id}>
              {city.name} - {city.totalTravelers} travelers
            </li>
          ))}
        </ul>

        <h4>User Bookings</h4>
        {users.map((user) => (
          <div key={user._id}>
            <strong>{user.username}:</strong> {user.citiesTravelled.join(", ")}
          </div>
        ))}
      </main>
    </div>
  );
};

export default AdminPanel;
