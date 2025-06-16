import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { fetchUserStats } from "../api";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function UserTypePieChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchUserStats(); // { male, female, other }
        const { male, female, other } = res.data;

        setChartData({
          labels: ["Male", "Female", "Other"],
          datasets: [
            {
              label: "User Type Distribution",
              data: [male, female, other],
              backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
              hoverOffset: 6,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    }
    loadData();
  }, []);

  if (!chartData) return <p>Loading user chart...</p>;

  return (
    <div style={{ width: "400px", margin: "auto", textAlign: "center" }}>
      <h3>User Gender Distribution</h3>
      <Pie data={chartData} />
    </div>
  );
}
