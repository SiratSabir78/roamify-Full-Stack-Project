import React, { useEffect, useState } from "react";
import { fetchBookings } from "../api";

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetchBookings(); // axios response
        console.log("Fetched bookings response:", response.data); // ✅ Debugging
        const bookingArray = Array.isArray(response.data)
          ? response.data
          : response.data.bookings || [];
        setBookings(bookingArray);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    }
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Booking Management</h2>
      <table border="1" cellPadding="8" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>User</th>
            <th>City</th>
            <th>Date</th>
            <th>People Count</th>
            <th>Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.user?.username || "N/A"}</td>
              <td>{b.city?.name || "N/A"}</td>
              <td>{new Date(b.date).toLocaleDateString()}</td>
              <td>{b.peopleCount}</td>
              <td>{b.totalCost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
