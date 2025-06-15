import React, { useState, useEffect } from "react";
import axios from "axios";
import { getWeatherForCity } from "../Weather";
import "./CSS/Homepage.css";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const [cities, setCities] = useState([]);
  const [weather, setWeather] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  // 🔐 Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Login");
    }
  }, [navigate]);

  // 🌐 Fetch cities and weather data
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("http://localhost:5000/cities");
        const cityData = response.data;
        setCities(cityData);
        console.log("Fetched cities:", cityData);

        const weatherData = {};
        for (let city of cityData) {
          const data = await getWeatherForCity(city.name);
          console.log("Weather for", city.name, ":", data);
          if (data) {
            weatherData[city.name] = {
              description: data.weather[0].description,
              temp: Math.round(data.main.temp),
            };
          }
        }
        setWeather(weatherData);
      } catch (error) {
        console.error("Failed to fetch cities or weather:", error);
      }
    };

    fetchCities();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container py-3">
        {/* 🔔 Notifications Toggle */}
        <div className="text-center mb-3">
          <button
            className="btn btn-warning"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔 Notifications
          </button>
        </div>

        {/* 🔔 Notifications Panel */}
        {showNotifications && (
          <div className="alert alert-info text-start">
            <h5>🌦️ Weather Alerts</h5>
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

        {/* 🏙️ City Cards */}
        <div className="row gx-5">
          {cities.map((city) => (
            <div className="col-md-4 mb-4" key={city._id}>
              <div className="card shadow-lg rounded h-100">
                <img
                  src={`/${city.name}.jpg`}
                  className="card-img-top rounded-top"
                  alt={city.name}
                  style={{ height: "180px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "/default-city.jpg"; // fallback if image not found
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{city.name}</h5>
                  <p className="card-text">{city.description}</p>
                  <button className="btn btn-outline-primary w-100">
                    See more details!
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Homepage;
