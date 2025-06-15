import React, { useState, useEffect } from "react";
import axios from "axios";
import { getWeatherForCity } from "../Weather";
import "./CSS/Homepage.css";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const [cities, setCities] = useState([]);
  const [weather, setWeather] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/Login");
  }, [navigate]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("http://localhost:5000/cities");
        const cityData = response.data;
        setCities(cityData);

        const weatherData = {};
        for (let city of cityData) {
          const data = await getWeatherForCity(city.name);
          if (data) {
            weatherData[city.name] = data.weather[0].description;
          }
        }
        setWeather(weatherData);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };

    fetchCities();
  }, []);

  return (
    <div className="container py-3">
      <div className="text-center mb-3">
        <button
          className="btn btn-warning"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          🔔 Notifications
        </button>
      </div>

      {showNotifications && (
        <div className="alert alert-info text-start">
          <h5>🌦️ Weather Alerts</h5>
          <ul className="mb-0">
            {cities.map((city) => (
              <li key={city._id}>
                <strong>{city.name}:</strong>{" "}
                {weather[city.name] || "Loading..."}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="row gx-5">
        {cities.map((city) => (
          <div className="col-md-4" key={city._id}>
            <div className="card shadow-lg rounded" style={{ height: "100%" }}>
              <img
                src={`./${city.name}.jpg`}
                className="card-img-top rounded-top"
                alt={city.name}
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{city.name}</h5>
                <p className="card-text">{city.description}</p>
                <button className="btn detailButton">See more details!</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Homepage;
