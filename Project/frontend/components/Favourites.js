import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import { useNavigate } from "react-router-dom";

function Favourites() {
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [userId, setUserId] = useState(null);
  const [allCities, setAllCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser._id) {
      navigate("/Login");
    } else {
      setUserId(storedUser._id);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchAllCities = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cities");
        setAllCities(res.data);
      } catch (err) {
        console.error("Failed to fetch all cities:", err);
      }
    };
    fetchAllCities();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userRes = await axios.get(
          `http://localhost:5000/api/users/${userId}`
        );
        const favoriteIds = userRes.data.favouriteCities || [];

        const cityPromises = favoriteIds.map((id) =>
          axios
            .get(`http://localhost:5000/api/cities/${id}`)
            .then((res) => res.data)
        );

        const savedCities = await Promise.all(cityPromises);
        setFavoriteCities(savedCities);
      } catch (error) {
        console.error("Failed to load favorite cities:", error);
      }
    };

    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  const removeFavorite = async (cityId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/users/favorite/${cityId}`,
        { userId }
      );

      const updatedFavoriteIds = res.data.favorites;
      setFavoriteCities((prev) =>
        prev.filter((city) => updatedFavoriteIds.includes(city._id))
      );
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  const mostFavoritedCities = [...allCities]
    .sort((a, b) => b.favouritesCount - a.favouritesCount)
    .slice(0, 3);

  const sortedByTravelers = [...allCities].sort(
    (a, b) => b.totalTravelers - a.totalTravelers
  );
  const mostTraveledCity = sortedByTravelers[0];

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h2 className="mb-4 text-center">❤️ Your Saved Destinations</h2>

        {/* FAVORITE CITIES */}
        <div className="row mb-5">
          <div className="col-12">
            <h4 className="mb-3">📍 Your Favorite Cities</h4>
            {favoriteCities.length === 0 ? (
              <p className="text-muted">
                You haven't saved any destinations yet.
              </p>
            ) : (
              <div className="row g-4">
                {favoriteCities.map((city) => (
                  <div className="col-md-6" key={city._id}>
                    <div className="card shadow-sm rounded h-100 border-0">
                      <img
                        src={`/${city.name}.jpg`}
                        className="card-img-top"
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
                        <button
                          className="btn btn-outline-danger mt-3"
                          onClick={() => removeFavorite(city._id)}
                        >
                          Remove from Favorites
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* TOP FAVORITE CITY */}
        <div className="row mb-5">
          <div className="col-md-6">
            <h5>📌 Top Favorite Destination</h5>
            {mostFavoritedCities.length > 0 ? (
              <div className="card border-success shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{mostFavoritedCities[0].name}</h5>
                  <p className="card-text">
                    {mostFavoritedCities[0].description}
                  </p>
                  <span className="badge bg-success">
                    {mostFavoritedCities[0].favouritesCount} Favourites
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-muted">No data available.</p>
            )}
          </div>
        </div>

        {/* MOST TRAVELED CITY */}
        <div className="row mb-5">
          <div className="col-md-6">
            <h4 className="text-primary mb-3">
              🌍 Recommended Based on Travelers
            </h4>
            {mostTraveledCity ? (
              <div className="card border-info shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    {mostTraveledCity.name} – Most Traveled
                  </h5>
                  <p className="card-text">{mostTraveledCity.description}</p>
                  <span className="badge bg-info">
                    {mostTraveledCity.totalTravelers} Travelers
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-muted">Travel data not available.</p>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}

export default Favourites;
