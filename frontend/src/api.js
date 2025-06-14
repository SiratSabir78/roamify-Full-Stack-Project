import axios from "axios";

const BASE_URL = "http://localhost:5000"; // Change this if your backend URL is different

export const adminLogin = (credentials) => {
  return axios.post(`${BASE_URL}/admin/login`, credentials);
};

export const fetchCities = () => {
  return axios.get(`${BASE_URL}/cities`);
};

export const addCity = (cityData) => {
  return axios.post(`${BASE_URL}/cities`, cityData);
};

export const updateCity = (cityId, cityData) => {
  return axios.put(`${BASE_URL}/cities/${cityId}`, cityData);
};

export const deleteCity = (cityId) => {
  return axios.delete(`${BASE_URL}/cities/${cityId}`);
};

export const fetchBookings = () => {
  return axios.get(`${BASE_URL}/bookings`);
};

