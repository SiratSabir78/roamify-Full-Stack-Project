import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { fetchBookings } from "../api";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AnalyticsChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchBookings();  // Axios response
        const bookings = res.data;          // Extract the bookings array from response

        // Count bookings per city name
        const counts = {};
        bookings.forEach((b) => {
          const cityName = b.city?.name || "Unknown";
          counts[cityName] = (counts[cityName] || 0) + 1;
        });

        setChartData({
          labels: Object.keys(counts),
          datasets: [
            {
              label: "# Bookings per City",
              data: Object.values(counts),
              backgroundColor: "rgba(75,192,192,0.6)",
            },
          ],
        });
      } catch (error) {
        console.error("Error loading bookings data for chart:", error);
      }
    }
    loadData();
  }, []);

  if (!chartData) return <p>Loading chart...</p>;

  return <Bar data={chartData} />;
}
