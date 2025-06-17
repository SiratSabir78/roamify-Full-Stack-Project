import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/Reviews.css";
import BottomNav from "./BottomNav";
import Navbar from "./Navbar";

const Reviews = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [userReviewsByCity, setUserReviewsByCity] = useState([]);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cities");

        const filtered = res.data
          .map((city) => {
            const userReviews = (city.reviews || []).filter(
              (review) => review.userId?.toString() === user._id.toString()
            );
            return {
              cityId: city._id,
              cityName: city.name,
              reviews: userReviews,
            };
          })
          .filter((entry) => entry.reviews.length > 0);

        setUserReviewsByCity(filtered);
      } catch (err) {
        console.error("Failed to fetch cities and reviews:", err);
      }
    };

    if (user && user._id) {
      fetchUserReviews();
    }
  }, [user]);

  const handleDeleteReview = async (cityId, reviewId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/cities/${cityId}/reviews/${reviewId}`,
        {
          data: { userId: user._id },
        }
      );

      setUserReviewsByCity((prev) =>
        prev
          .map((city) => ({
            ...city,
            reviews: city.reviews.filter((r) => r._id !== reviewId),
          }))
          .filter((city) => city.reviews.length > 0)
      );
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="reviews-container pb-5">
        <h2>Your Reviews</h2>
        {userReviewsByCity.length === 0 ? (
          <p>No reviews found.</p>
        ) : (
          userReviewsByCity.map((city) => (
            <div key={city.cityId} className="mb-4">
              <h3>{city.cityName}</h3>
              {city.reviews.map((review) => (
                <div key={review._id} className="review-card border p-3 mb-2">
                  <p>
                    <strong>Review:</strong> {review.text}
                  </p>
                  <p>
                    <strong>Rating:</strong> {review.rating}{" "}
                    {review.rating === 1 ? "star" : "stars"}
                  </p>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteReview(city.cityId, review._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ))
        )}
        <BottomNav />
      </div>
    </>
  );
};

export default Reviews;
