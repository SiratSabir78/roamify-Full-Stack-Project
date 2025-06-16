import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axios is used for making HTTP requests

// --- API functions (These should ideally be in your 'frontend/api.js' file) ---
// Base URL for your backend API. Make sure this matches your backend server's address.
const API_BASE_URL = 'http://localhost:5000/api'; // Consistently using /api prefix

// Function to fetch all bookings from your backend's /api/bookings endpoint
const fetchBookings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings`);
    return response;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    // Removed fallback to mock data. Now it will genuinely error if the API fails.
    throw new Error(`Failed to fetch bookings: ${error.message || error.response?.data?.message}`);
  }
};

// Function to create a new booking via your backend's /api/bookings POST endpoint
const createBooking = async (bookingData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData);
    return response;
  } catch (error) {
    console.error("Error creating booking:", error);
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred.';
    throw new Error(`Failed to create booking: ${errorMessage}`);
  }
};

// Function to delete a booking via your backend's /api/bookings/:id DELETE endpoint
const deleteBooking = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/bookings/${id}`);
    return response;
  } catch (error) {
    console.error(`Error deleting booking with ID ${id}:`, error);
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred.';
    throw new Error(`Failed to delete booking: ${errorMessage}`);
  }
};

// Function to fetch cities from your backend's /api/cities endpoint
const fetchCities = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cities`);
    return response;
  } catch (error) {
    console.error("Error fetching cities:", error);
    // Removed fallback to mock data. Now it will genuinely error if the API fails.
    throw new Error(`Failed to fetch destinations: ${error.message || error.response?.data?.message}`);
  }
};

// Main BookingsPage React Component
export default function BookingsPage({ loggedInUserId }) {
  // State variables for the new booking form inputs
  const [selectedCityId, setSelectedCityId] = useState('');
  const [numTravelers, setNumTravelers] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // State variables for managing the display of existing bookings
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [errorBookings, setErrorBookings] = useState(null);

  // State variables for managing the city dropdown data
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [errorCities, setErrorCities] = useState(null);

  // State for a custom alert/confirmation modal (replaces alert())
  const [messageBox, setMessageBox] = useState({ show: false, type: 'info', message: '' });
  const [confirmDelete, setConfirmDelete] = useState({ show: false, bookingId: null });


  // Determine the userId to use for bookings
  // This should ideally come from a proper authentication context.
  // For now, it defaults to the seeded 'testUserBooking' ID if not provided as a prop.
  const currentUserId = loggedInUserId || '685049f6f67f2d4776742054'; // Fallback to a valid seeded ID

  // Function to show a custom message box
  const showMessageBox = (message, type = 'info') => {
    setMessageBox({ show: true, type, message });
  };

  // Function to hide the custom message box
  const hideMessageBox = () => {
    setMessageBox({ show: false, type: 'info', message: '' });
  };

  // Load initial data (cities and bookings) when the component mounts
  useEffect(() => {
    // Warn if no actual logged-in user ID is provided (only during development)
    if (!loggedInUserId) {
      console.warn("BookingsPage: No loggedInUserId prop provided. Using a default ID for testing. Integrate with an actual authentication system for dynamic user IDs.");
    }

    async function loadInitialData() {
      // Fetch available cities
      try {
        setLoadingCities(true);
        const response = await fetchCities();
        setCities(response.data);
      } catch (err) {
        console.error("Error fetching cities (component level handling):", err);
        setErrorCities(err.message); // Display specific error message
      } finally {
        setLoadingCities(false);
      }

      // Fetch existing bookings
      try {
        setLoadingBookings(true);
        const response = await fetchBookings();
        // Ensure response.data is an array. If backend sends an object with a 'bookings' key, use that.
        const bookingArray = Array.isArray(response.data) ? response.data : response.data.bookings || [];
        setBookings(bookingArray);
      } catch (err) {
        console.error("Error fetching bookings (component level handling):", err);
        setErrorBookings(err.message); // Display specific error message
      } finally {
        setLoadingBookings(false);
      }
    }
    loadInitialData();
  }, [loggedInUserId]); // Dependency array includes loggedInUserId to re-fetch if it changes

  // Handler for the new booking form submission
  const handleConfirmBooking = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!selectedCityId || !startDate || !endDate || numTravelers < 1 || !currentUserId) {
      showMessageBox('Please fill in all required fields (Destination, Dates, People) and ensure a user is logged in.', 'warning');
      return;
    }

    const selectedCity = cities.find(city => city._id === selectedCityId);
    if (!selectedCity) {
      showMessageBox('Selected destination not found. Please choose a valid destination from the list.', 'warning');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Date validation: End date must be on or after start date
    if (end < start) {
      showMessageBox('End date cannot be before start date.', 'warning');
      return;
    }

    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const daysToCharge = diffDays > 0 ? diffDays : 1; // Minimum 1 day charge

    const calculatedTotalPrice = (selectedCity.pricePerPerson || 10000) * numTravelers * daysToCharge;

    const bookingData = {
      userId: currentUserId,
      cityId: selectedCityId,
      date: startDate, // Send as string for backend Date parsing
      numberOfPeople: numTravelers,
      totalPrice: calculatedTotalPrice,
    };

    try {
      const response = await createBooking(bookingData);
      console.log('New booking created successfully:', response.data);
      setBookings((prevBookings) => [...prevBookings, response.data]); // Add new booking to the list
      // Clear form inputs
      setSelectedCityId('');
      setNumTravelers(1);
      setStartDate('');
      setEndDate('');
      showMessageBox('Your booking has been successfully confirmed and saved!', 'success');
    } catch (submitError) {
      console.error('Error submitting new booking:', submitError);
      showMessageBox(`Error: ${submitError.message}. Please try again.`, 'danger');
    }
  };

  // Handler for initiating booking deletion
  const handleDeleteClick = (bookingId) => {
    setConfirmDelete({ show: true, bookingId });
  };

  // Handler for confirming deletion in the modal
  const handleConfirmDelete = async () => {
    const { bookingId } = confirmDelete;
    if (!bookingId) return; // Should not happen

    try {
      await deleteBooking(bookingId);
      // Remove the deleted booking from the state
      setBookings((prevBookings) => prevBookings.filter((b) => b._id !== bookingId));
      showMessageBox('Booking successfully deleted!', 'success');
    } catch (deleteError) {
      console.error('Error during booking deletion:', deleteError);
      showMessageBox(`Error: ${deleteError.message}. Please try again.`, 'danger');
    } finally {
      setConfirmDelete({ show: false, bookingId: null }); // Close confirmation modal
    }
  };

  // Handler for cancelling deletion
  const handleCancelDelete = () => {
    setConfirmDelete({ show: false, bookingId: null });
  };


  return (
    <div
      className="d-flex flex-column align-items-center py-4"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #d8b4fe, #93c5fd, #818cf8)',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Custom Message Box */}
      {messageBox.show && (
        <div className={`alert alert-${messageBox.type} alert-dismissible fade show fixed-top mx-auto mt-3`} role="alert"
             style={{ maxWidth: '400px', zIndex: 1050 }}>
          {messageBox.message}
          <button type="button" className="btn-close" onClick={hideMessageBox} aria-label="Close"></button>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      {confirmDelete.show && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1040 }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content rounded-3 shadow">
              <div className="modal-header bg-warning-subtle border-0">
                <h5 className="modal-title text-warning-emphasis">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={handleCancelDelete} aria-label="Close"></button>
              </div>
              <div className="modal-body text-center py-4">
                Are you sure you want to delete this booking? This action cannot be undone.
              </div>
              <div className="modal-footer justify-content-center border-0">
                <button type="button" className="btn btn-secondary px-4 me-2 rounded-pill" onClick={handleCancelDelete}>Cancel</button>
                <button type="button" className="btn btn-danger px-4 rounded-pill" onClick={handleConfirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-5 rounded-3 shadow mb-5 mt-5" style={{ maxWidth: '900px', width: '100%' }}>
        <h1 className="display-4 fw-bold text-dark mb-5 text-center">Your Bookings</h1>

        <div className="mb-5 pb-4 border-bottom border-primary border-opacity-25">
          <h2 className="h3 fw-semibold text-secondary mb-4 text-center">Book Your Next Adventure!</h2>
          <form onSubmit={handleConfirmBooking} className="row g-4">
            <div className="col-12 col-md-6">
              <label htmlFor="citySelect" className="form-label text-secondary fs-5 fw-medium mb-2">
                Select a Destination:
              </label>
              {loadingCities ? (
                <p className="text-muted">Loading destinations...</p>
              ) : errorCities ? (
                <p className="text-danger">{errorCities}</p>
              ) : (
                <select
                  id="citySelect"
                  value={selectedCityId}
                  onChange={(e) => setSelectedCityId(e.target.value)}
                  className="form-select form-control-lg text-dark bg-white shadow-sm"
                  required
                >
                  <option value="">Select a Destination</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>
                      {city.name} (Rs. {city.pricePerPerson?.toLocaleString() || 'N/A'}/day)
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="numTravelers" className="form-label text-secondary fs-5 fw-medium mb-2">
                Number of People:
              </label>
              <input
                type="number"
                id="numTravelers"
                value={numTravelers}
                onChange={(e) => setNumTravelers(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                className="form-control form-control-lg text-dark shadow-sm"
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="startDate" className="form-label text-secondary fs-5 fw-medium mb-2">
                Preferred Start Date:
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-control form-control-lg text-dark shadow-sm"
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="endDate" className="form-label text-secondary fs-5 fw-medium mb-2">
                Preferred End Date:
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-control form-control-lg text-dark shadow-sm"
                required
              />
            </div>

            <div className="col-12 d-flex justify-content-center mt-4">
              <button
                type="submit"
                className="btn btn-success btn-lg fw-semibold rounded-pill shadow-sm transition-transform-hover"
                style={{
                  paddingLeft: '3rem',
                  paddingRight: '3rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  transition: 'transform 0.3s ease-in-out',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>

        <div>
          <h2 className="h3 fw-semibold text-secondary mb-4 text-center">Your Upcoming Trips</h2>

          {loadingBookings ? (
            <p className="text-muted text-center fs-5 py-5">Loading your bookings...</p>
          ) : errorBookings ? (
            <p className="text-danger text-center fs-5 py-5">{errorBookings}</p>
          ) : bookings.length === 0 ? (
            <p className="text-muted text-center fs-5 py-5">
              Looks like you haven't booked any trips yet! Start by selecting a destination above.
            </p>
          ) : (
            <div className="table-responsive rounded shadow-sm border border-light">
              <table className="table table-hover mb-0">
                <thead className="bg-primary bg-opacity-10">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-start text-sm fw-medium text-secondary text-uppercase">
                      User
                    </th>
                    <th scope="col" className="px-4 py-3 text-start text-sm fw-medium text-secondary text-uppercase">
                      City
                    </th>
                    <th scope="col" className="px-4 py-3 text-start text-sm fw-medium text-secondary text-uppercase">
                      Date
                    </th>
                    <th scope="col" className="px-4 py-3 text-start text-sm fw-medium text-secondary text-uppercase">
                      People
                    </th>
                    <th scope="col" className="px-4 py-3 text-start text-sm fw-medium text-secondary text-uppercase">
                      Total Cost
                    </th>
                    <th scope="col" className="px-4 py-3 text-start text-sm fw-medium text-secondary text-uppercase">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-start text-sm fw-medium text-secondary text-uppercase">
                      Actions
                    </th> {/* Added Actions column */}
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td className="px-4 py-3 text-nowrap text-dark">{b.userId?.username || "N/A"}</td>
                      <td className="px-4 py-3 text-nowrap text-dark">{b.cityId?.name || "N/A"}</td>
                      <td className="px-4 py-3 text-nowrap text-muted">
                        {b.date ? new Date(b.date).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-nowrap text-muted">{b.numberOfPeople}</td>
                      <td className="px-4 py-3 text-nowrap text-dark fw-semibold">
                        Rs. {b.totalPrice?.toLocaleString() || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-nowrap">
                        <span className="badge rounded-pill bg-success-subtle text-success-emphasis py-2 px-3 fw-semibold">
                          Confirmed
                        </span>
                      </td>
                      <td className="px-4 py-3 text-nowrap">
                        {/* Delete Button */}
                        <button
                          className="btn btn-sm btn-danger rounded-pill d-inline-flex align-items-center justify-content-center"
                          style={{ width: '32px', height: '32px', padding: 0 }}
                          onClick={() => handleDeleteClick(b._id)}
                          title="Delete Booking"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

