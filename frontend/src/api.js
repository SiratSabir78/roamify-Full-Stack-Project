import axios from "axios";

const BASE_URL = "http://localhost:5000"; // Change this if your backend URL is different

// Admin login API call
export const adminLogin = (credentials) => {
  return axios.post(`${BASE_URL}/admin/login`, credentials);
};

// Fetch all cities
export const fetchCities = () => {
  return axios.get(`${BASE_URL}/cities`);
};

// Add a new city
export const addCity = (cityData) => {
  return axios.post(`${BASE_URL}/cities`, cityData);
};

// Update city by ID
export const updateCity = (cityId, cityData) => {
  return axios.put(`${BASE_URL}/cities/${cityId}`, cityData);
};

// Delete city by ID
export const deleteCity = (cityId) => {
  return axios.delete(`${BASE_URL}/cities/${cityId}`);
};

// Fetch all bookings
export const fetchBookings = () => {
  return axios.get(`${BASE_URL}/bookings`);
};

// Add more API calls as needed
