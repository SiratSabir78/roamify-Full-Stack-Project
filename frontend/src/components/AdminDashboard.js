import React, { useState } from "react";
import Sidebar from "./Sidebar";
import UserTypePieChart from "./AnalyticsChart"; // Existing pie chart component
import CityManagement from "./CityManager";
import Logout from "./Logout";
import "../components/CSS/AdminDashboard.css";

export default function AdminDashboard() {
  const [selectedPanel, setSelectedPanel] = useState("analytics");

  function renderPanel() {
    switch (selectedPanel) {
      case "analytics":
        return <UserTypePieChart />;
      case "cities":
        return <CityManagement />;
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
