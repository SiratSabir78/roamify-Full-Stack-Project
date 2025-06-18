import React from "react";

export default function Sidebar({ selected, setSelected }) {
  return (
    <div
      style={{
        width: 200,
        height: "100vh",
        borderRight: "1px solid #ccc",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <h3>Admin Panel</h3>
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li
            onClick={() => setSelected("analytics")}
            style={{
              padding: "10px 5px",
              cursor: "pointer",
              backgroundColor: selected === "analytics" ? "#eee" : "transparent",
            }}
          >
            Analytics
          </li>
          <li
            onClick={() => setSelected("bookings")}
            style={{
              padding: "10px 5px",
              cursor: "pointer",
              backgroundColor: selected === "bookings" ? "#eee" : "transparent",
            }}
          >
            Booking Management
          </li>
          <li
            onClick={() => setSelected("cities")}
            style={{
              padding: "10px 5px",
              cursor: "pointer",
              backgroundColor: selected === "cities" ? "#eee" : "transparent",
            }}
          >
            Cities Management
          </li>
          <li
            onClick={() => setSelected("monthlyBookings")} // New menu item
            style={{
              padding: "10px 5px",
              cursor: "pointer",
              backgroundColor: selected === "monthlyBookings" ? "#eee" : "transparent",
            }}
          >
            Monthly Bookings
          </li>
          <li
            onClick={() => setSelected("logout")}
            style={{
              padding: "10px 5px",
              cursor: "pointer",
              backgroundColor: selected === "logout" ? "#eee" : "transparent",
            }}
          >
            Logout
          </li>
        </ul>
      </nav>
    </div>
  );
}
