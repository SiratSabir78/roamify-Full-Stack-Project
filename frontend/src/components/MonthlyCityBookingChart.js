// MonthlyCityBookingChart.js
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { fetchMonthlyCityBookingSummary } from "../api";

export default function MonthlyCityBookingChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadSummary() {
      try {
        const res = await fetchMonthlyCityBookingSummary();
        const chartData = res.data.map(({ _id: month, cities }) => {
          const obj = { month };
          cities.forEach(({ city, count }) => {
            obj[city] = count;
          });
          return obj;
        });
        setData(chartData);
      } catch (err) {
        console.error("Failed to load monthly city booking summary", err);
      }
    }
    loadSummary();
  }, []);

  // Get all city names dynamically for bars
  const allCities = new Set();
  data.forEach(d => {
    Object.keys(d).forEach(key => {
      if (key !== "month") allCities.add(key);
    });
  });

  // Generate consistent colors for each city (simple hash)
  const cityColors = {};
  [...allCities].forEach(city => {
    let hash = 0;
    for (let i = 0; i < city.length; i++) {
      hash = city.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 50%)`;
    cityColors[city] = color;
  });

  return (
    <div style={{ width: "100%", height: 400, marginTop: 30 }}>
      <h2>Bookings per City (Last 6 Months)</h2>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          stackOffset="expand"
        >
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => Math.round(value * 100) + "%"} />
          <Tooltip formatter={(value) => Math.round(value * 100) + "%"} />
          <Legend />
          {[...allCities].map((city) => (
            <Bar
              key={city}
              dataKey={city}
              stackId="a"
              fill={cityColors[city]}
              name={city}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
