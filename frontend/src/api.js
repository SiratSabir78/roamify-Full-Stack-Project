import axios from "axios";

const BASE_URL = "http://localhost:5000";

// AUTH
export const adminLogin = (credentials) => {
  axios.post(`${BASE_URL}/api/admin/login`, credentials);

};

export const userLogin = (credentials) => {
  return axios.post(`${BASE_URL}/api/auth/login`, credentials);
};

// USER
export const fetchUserProfile = (userId) => {
  return axios.get(`${BASE_URL}/api/users/${userId}`);
};

export const updateUserProfile = (profileData) => {
  return axios.put(`${BASE_URL}/api/users/update`, profileData);
};

// ✅ CITIES (Fix here)
export const fetchCities = () => {
  return axios.get(`${BASE_URL}/api/cities`);
};

export const addCity = (cityData) => {
  return axios.post(`${BASE_URL}/api/cities`, cityData);
};

export const updateCity = (cityId, cityData) => {
  return axios.put(`${BASE_URL}/api/cities/${cityId}`, cityData);
};

export const deleteCity = (cityId) => {
  return axios.delete(`${BASE_URL}/api/cities/${cityId}`);
};

// ✅ BOOKINGS (Fix here too)
export const fetchBookings = () => {
  return axios.get(`${BASE_URL}/api/bookings`);
};

// ✅ REVIEWS (Fix review endpoints)
export const addReview = (cityId, reviewData) => {
  return axios.post(`${BASE_URL}/api/cities/${cityId}/reviews`, reviewData);
};

export const deleteReview = (cityId, reviewId, userId) => {
  return axios.delete(`${BASE_URL}/api/cities/${cityId}/reviews/${reviewId}`, {
    data: { userId },
  });
};

// USER STATS
export const fetchUserStats = async () => {
  return axios.get(`${BASE_URL}/api/users/stats/gender`);
};

// BOOKING SUMMARY
export const fetchMonthlyCityBookingSummary = () => {
  return axios.get(`${BASE_URL}/api/bookings/summary/monthly-city`);
};
