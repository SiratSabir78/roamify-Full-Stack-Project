import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import { useNavigate } from "react-router-dom";

function Favourites() {
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [userId, setUserId] = useState(null);
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
    const fetchFavorites = async () => {
      try {
        const userRes = await axios.get(
          `http://localhost:5000/users/${userId}`
        );
        const favoriteIds = userRes.data.favouriteCities || [];

        const cityPromises = favoriteIds.map((id) =>
          axios
            .get(`http://localhost:5000/cities/${id}`)
            .then((res) => res.data)
        );

        const savedCities = await Promise.all(cityPromises);
        setFavoriteCities(savedCities);

        // Optional debug logs
        console.log("Favorite City IDs:", favoriteIds);
        console.log("Fetched City Details:", savedCities);
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
        `http://localhost:5000/users/favorite/${cityId}`,
        {
          userId,
        }
      );

      const updatedFavoriteIds = res.data.favorites;
      setFavoriteCities((prev) =>
        prev.filter((city) => updatedFavoriteIds.includes(city._id))
      );
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h2 className="mb-4 text-center">❤️ Your Saved Destinations</h2>

        {favoriteCities.length === 0 ? (
          <div className="text-center text-muted">
            You haven’t saved any destinations yet.
          </div>
        ) : (
          <div className="row gx-4 gy-4">
            {favoriteCities.map((city) => (
              <div className="col-md-4" key={city._id}>
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
      <BottomNav />
    </>
  );
}

export default Favourites;
