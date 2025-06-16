import React, { useState, useEffect } from "react";
import axios from "axios";
import { getWeatherForCity } from "../Weather";
import "./CSS/Homepage.css";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const [cities, setCities] = useState([]);
  const [weather, setWeather] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser._id) {
      setUserId(storedUser._id);
    }
  }, []);

  useEffect(() => {
    const fetchCitiesAndWeather = async () => {
      try {
        const response = await axios.get("http://localhost:5000/cities");
        const cityData = response.data;
        setCities(cityData);

        const weatherData = {};
        for (let city of cityData) {
          const data = await getWeatherForCity(city.name);
          if (data) {
            weatherData[city.name] = {
              description: data.weather[0].description,
              temp: Math.round(data.main.temp),
            };
          }
        }
        setWeather(weatherData);
      } catch (error) {
        console.error("Error fetching cities/weather:", error);
      }
    };

    fetchCitiesAndWeather();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`http://localhost:5000/users/${userId}`);
        setFavorites(res.data.favouriteCities || []);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      }
    };

    fetchFavorites();
  }, [userId]);

  const handleFavorite = async (cityId) => {
    if (!userId) {
      alert("Please log in to save destinations.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/users/favorite/${cityId}`,
        { userId }
      );
      setFavorites(res.data.favorites || []);
    } catch (err) {
      console.error("Favorite error:", err.response?.data || err.message);
      alert("Failed to update favorites.");
    }
  };

  const isFavorite = (cityId) => favorites.map(String).includes(cityId);

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="text-center mb-4">
          <button
            className="btn btn-warning"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔 Weather Alerts
          </button>
        </div>

        {showNotifications && (
          <div className="alert alert-info text-start">
            <h5>🌤️ Current Weather</h5>
            <ul className="mb-0">
              {cities.map((city) => (
                <li key={city._id}>
                  <strong>{city.name}:</strong>{" "}
                  {weather[city.name]
                    ? `${weather[city.name].description}, ${
                        weather[city.name].temp
                      }°C`
                    : "Loading..."}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="row gx-4 gy-4">
          {cities.map((city) => (
            <div className="col-md-4" key={city._id}>
              <div className="card shadow-sm rounded h-100 border-0">
                <img
                  src={`/${city.name}.jpg`}
                  className="card-img-top rounded-top"
                  alt={city.name}
                  style={{ height: "180px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "/default-city.jpg";
                  }}
                />
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title">{city.name}</h5>
                    <p className="card-text">{city.description}</p>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <button className="btn btn-outline-primary w-75">
                      See more details!
                    </button>
                    <button
                      className={`btn ms-2 ${
                        isFavorite(city._id)
                          ? "btn-success"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() => handleFavorite(city._id)}
                      title={
                        isFavorite(city._id)
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      {isFavorite(city._id) ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <BottomNav />
      </div>
    </>
  );
}

export default Homepage;
