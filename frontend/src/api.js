import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const adminLogin = (credentials) => {
  return axios.post(`${BASE_URL}/admin/login`, credentials);
};

export const userLogin = (credentials) => {
  return axios.post(`${BASE_URL}/api/auth/login`, credentials);
};

export const fetchUserProfile = (userId) => {
  return axios.get(`${BASE_URL}/api/users/${userId}`);
};

export const updateUserProfile = (profileData) => {
  return axios.put(`${BASE_URL}/api/users/update`, profileData);
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

export const addReview = (cityId, reviewData) => {
  return axios.post(`${BASE_URL}/cities/${cityId}/reviews`, reviewData);
};

export const deleteReview = (cityId, reviewId, userId) => {
  return axios.delete(`${BASE_URL}/cities/${cityId}/reviews/${reviewId}`, {
    data: { userId },
  });
};

export const fetchUserStats = async () => {
  return axios.get(`${BASE_URL}/api/users/stats/gender`);
};

export const fetchMonthlyCityBookingSummary = () => {
  return axios.get(`${BASE_URL}/bookings/summary/monthly-city`);
};
