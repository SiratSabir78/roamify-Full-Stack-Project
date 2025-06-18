import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { addReview, deleteReview } from "../api";
import axios from "axios";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";

function CityDetails() {
  const { id } = useParams();
  const [city, setCity] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/cities/${id}`);
        setCity(res.data);
      } catch (err) {
        console.error("Failed to fetch city details:", err);
      }
    };
    fetchCity();
  }, [id]);

  const handleAddReview = async () => {
    if (!reviewText.trim() || rating === 0) {
      alert("Please enter a review and select a rating.");
      return;
    }

    const res = await addReview(id, {
      userId: user._id,
      username: user.username,
      text: reviewText,
      rating,
    });

    setCity((prev) => ({
      ...prev,
      reviews: [...prev.reviews, res.data.review],
    }));
    setReviewText("");
    setRating(0);
  };

  const handleDeleteReview = async (reviewId) => {
    await deleteReview(id, reviewId, user._id);

    setCity((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((r) => r.id !== reviewId),
    }));
  };

  if (!city) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>
          <strong>Name: </strong>
          {city.name}
        </h2>
        <img src={`/${city.name}.jpg`} alt={city.name} className="img-fluid" />
        <p>
          <strong>Description: </strong>
          {city.description}
        </p>
        <p>
          <strong>Trip Dates: </strong>
          {city.tripDates}
        </p>

        <div className="my-3">
          <textarea
            className="form-control"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review..."
          />
          <div className="my-2">
            <label>Rating: </label>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{
                  cursor: "pointer",
                  color: star <= rating ? "#ffd700" : "#ccc",
                  fontSize: "24px",
                }}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <button className="btn btn-primary mt-2" onClick={handleAddReview}>
            Submit Review
          </button>
        </div>

        <h4>Reviews</h4>
        <ul className="list-group">
          {city.reviews.map((review) => (
            <li
              key={review.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{review.username}</strong>: {review.text}
                <div>
                  {review.rating} {review.rating === 1 ? "star" : "stars"}
                </div>
              </div>
              {user._id === review.userId && (
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteReview(review.id)}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <BottomNav />
    </>
  );
}

export default CityDetails;
