import React, { useState } from "react";
import Sidebar from "./Sidebar";
import UserTypePieChart from "./AnalyticsChart"; // Existing pie chart component
import BookingManagement from "./BookingManagement";
import CityManagement from "./CityManager";
import Logout from "./Logout";
import MonthlyCityBookingChart from "./MonthlyCityBookingChart"; // <-- import your new chart component
import "../components/CSS/AdminDashboard.css";

export default function AdminDashboard() {
  const [selectedPanel, setSelectedPanel] = useState("analytics");

  function renderPanel() {
    switch (selectedPanel) {
      case "analytics":
        return <UserTypePieChart />;
      case "bookings":
        return <BookingManagement />;
      case "cities":
        return <CityManagement />;
      case "monthlyBookings":   // New panel
        return <MonthlyCityBookingChart />;
      case "logout":
        return <Logout />;
      default:
        return <UserTypePieChart />;
    }
  }

  return (
    <div className="admin-dashboard">
      <Sidebar selected={selectedPanel} setSelected={setSelectedPanel} />
      <div className="dashboard-content">{renderPanel()}</div>
    </div>
  );
}
