import React, { useState } from "react";
import Sidebar from "./Sidebar";
import AnalyticsChart from "./AnalyticsChart";
import BookingManagement from "./BookingManagement";
import CityManagement from "./CityManager";
import Logout from "./Logout";
import "../components/CSS/AdminDashboard.css";

export default function AdminDashboard() {
  const [selectedPanel, setSelectedPanel] = useState("analytics");

  function renderPanel() {
    switch (selectedPanel) {
      case "analytics":
        return <AnalyticsChart />;
      case "bookings":
        return <BookingManagement />;
      case "cities":
        return <CityManagement />;
      case "logout":
        return <Logout />;
      default:
        return <AnalyticsChart />;
    }
  }

  return (
    <div className="admin-dashboard">
      <Sidebar selected={selectedPanel} setSelected={setSelectedPanel} />
      <div className="dashboard-content">{renderPanel()}</div>
    </div>
  );
}
